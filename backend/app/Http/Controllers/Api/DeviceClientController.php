<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DeviceClientController extends Controller
{
    public function status(Request $request)
    {
        $device = $request->attributes->get('client_device');

        $session = $device->sessions()
            ->where('status', 'active')
            ->latest('start_time')
            ->first();

        $locked = true;
        $sessionData = null;

        if ($session && now()->lt($session->end_time)) {
            $locked = false;
            $sessionData = [
                'id' => $session->id,
                'end_time' => $session->end_time->toIso8601String(),
                'remaining_seconds' => $session->remaining_seconds,
            ];
        }

        return response()->json([
            'device_code' => $device->code,
            'status' => $device->status,
            'locked' => $locked,
            'session' => $sessionData,
        ]);
    }
}