<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Device\StoreDeviceRequest;
use App\Http\Requests\Device\SyncDeviceGamesRequest;
use App\Http\Requests\Device\UpdateDeviceRequest;
use App\Http\Resources\DeviceResource;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DeviceController extends Controller
{
    public function index(Request $request)
    {
        $query = Device::with(['deviceType', 'games'])
            ->withCount([
                'bookings as today_bookings_count' => function ($q) {
                    $q->where('booking_date', now()->toDateString())
                        ->whereIn('status', ['pending', 'confirmed']);
                }
            ]);

        if ($request->filled('type')) {
            $query->whereHas('deviceType', fn($q) => $q->where('name', $request->type));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('code', 'like', '%' . $request->search . '%');
        }

        return DeviceResource::collection($query->orderBy('code')->get());
    }

    public function show(Device $device)
    {
        $device->loadCount([
            'bookings as today_bookings_count' => function ($q) {
                $q->where('booking_date', now()->toDateString())
                    ->whereIn('status', ['pending', 'confirmed']);
            }
        ]);

        return new DeviceResource($device->load(['deviceType', 'games']));
    }

    public function store(StoreDeviceRequest $request)
    {
        $data = $request->only(['device_type_id', 'code', 'price_per_hour', 'status', 'description']);
        $data['status'] = $data['status'] ?? 'available';

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('devices', 'public');
        }

        $device = Device::create($data);

        if ($request->filled('game_ids')) {
            $device->games()->sync($request->game_ids);
        }

        return new DeviceResource($device->load(['deviceType', 'games']));
    }

    public function update(UpdateDeviceRequest $request, Device $device)
    {
        $data = $request->only(['device_type_id', 'code', 'price_per_hour', 'status', 'description']);

        if ($request->hasFile('photo')) {
            if ($device->photo) {
                Storage::disk('public')->delete($device->photo);
            }
            $data['photo'] = $request->file('photo')->store('devices', 'public');
        }

        $device->update($data);

        if ($request->has('game_ids')) {
            $device->games()->sync($request->game_ids ?? []);
        }

        return new DeviceResource($device->load(['deviceType', 'games']));
    }

    public function updateStatus(Request $request, Device $device)
    {
        $request->validate([
            'status' => ['required', 'in:available,booked,occupied,maintenance'],
        ]);

        $device->update(['status' => $request->status]);

        return new DeviceResource($device->load(['deviceType', 'games']));
    }

    public function syncGames(SyncDeviceGamesRequest $request, Device $device)
    {
        $device->games()->sync($request->game_ids);

        return new DeviceResource($device->load(['deviceType', 'games']));
    }

    public function destroy(Device $device)
    {
        if ($device->bookings()->exists() || $device->sessions()->exists()) {
            return response()->json([
                'message' => 'Device tidak bisa dihapus karena masih memiliki riwayat booking/session.',
            ], 422);
        }

        if ($device->photo) {
            Storage::disk('public')->delete($device->photo);
        }

        $device->delete();

        return response()->json(['message' => 'Device berhasil dihapus.']);
    }
}