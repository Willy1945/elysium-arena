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
        \Log::info("SMARTLOCK REQUEST from IP: " . $request->ip() . " | X-Client-Token: [" . ($token ?? 'NULL') . "]");

        if (! $token) {
            \Log::warning("SMARTLOCK 401: Token client tidak ditemukan di header.");
            return response()->json(['message' => 'Token client tidak ditemukan.'], 401);
        }

        $device = Device::where('client_token', trim($token))->first();

        if (! $device) {
            \Log::warning("SMARTLOCK 401: Token [" . $token . "] tidak cocok dengan device manapun di database.");
            return response()->json(['message' => 'Token client tidak valid.'], 401);
        }

        \Log::info("SMARTLOCK 200: Device match! Found device code: " . $device->code . " (ID: " . $device->id . ")");

        $request->attributes->set('client_device', $device);

        return $next($request);
    }
}