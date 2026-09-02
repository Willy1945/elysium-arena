<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Game\StoreGameRequest;
use App\Http\Requests\Game\UpdateGameRequest;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $query = Game::query();

        if ($request->filled('platform')) {
            $query->whereJsonContains('platforms', $request->platform);
        }

        return GameResource::collection($query->orderBy('name')->get());
    }

    public function show(Game $game)
    {
        return new GameResource($game->load('devices.deviceType'));
    }

    public function store(StoreGameRequest $request)
    {
        $data = $request->only(['name', 'platforms', 'description']);

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('games', 'public');
        }

        $game = Game::create($data);

        return new GameResource($game);
    }

    public function update(UpdateGameRequest $request, Game $game)
    {
        $data = $request->only(['name', 'platforms', 'description']);

        if ($request->hasFile('cover_image')) {
            if ($game->cover_image) {
                Storage::disk('public')->delete($game->cover_image);
            }
            $data['cover_image'] = $request->file('cover_image')->store('games', 'public');
        }

        $game->update($data);

        // Bersihkan relasi ke device yang tipenya sudah tidak ada di platforms baru
        if (array_key_exists('platforms', $data)) {
            $game->load('devices.deviceType');
            $invalidDeviceIds = $game->devices
                ->filter(fn($device) => !in_array($device->deviceType->name, $data['platforms'] ?? []))
                ->pluck('id');

            if ($invalidDeviceIds->isNotEmpty()) {
                $game->devices()->detach($invalidDeviceIds);
            }
        }

        return new GameResource($game->fresh());
    }

    public function destroy(Game $game)
    {
        if ($game->cover_image) {
            Storage::disk('public')->delete($game->cover_image);
        }

        $game->delete();

        return response()->json(['message' => 'Game berhasil dihapus.']);
    }
}