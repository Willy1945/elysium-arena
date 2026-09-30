<?php

namespace App\Http\Middleware;

use App\Models\Device;
use Closure;
use Illuminate\Http\Request;

class AuthenticateDeviceClient
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('X-Client-Token');

        if (! $token) {
            return response()->json(['message' => 'Token client tidak ditemukan.'], 401);
        }

        $device = Device::where('client_token', $token)->first();

        if (! $device) {
            return response()->json(['message' => 'Token client tidak valid.'], 401);
        }

        // Tempelkan device ke request supaya controller tinggal ambil, tidak perlu query ulang
        $request->attributes->set('client_device', $device);

        return $next($request);
    }
}