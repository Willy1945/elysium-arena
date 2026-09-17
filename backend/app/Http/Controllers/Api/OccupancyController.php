<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\GamingSession;
use Illuminate\Support\Carbon;

class OccupancyController extends Controller
{
    public function stats()
    {
        $since = now()->subDays(7);
        $totalDevices = max(Device::count(), 1);

        $sessions = GamingSession::where('start_time', '>=', $since)->get(['start_time']);

        $hourly = collect(range(10, 21))->mapWithKeys(fn ($h) => [$h => 0]);

        foreach ($sessions as $s) {
            $hour = (int) Carbon::parse($s->start_time)->format('G');
            if ($hourly->has($hour)) {
                $hourly[$hour] = $hourly[$hour] + 1;
            }
        }

        $maxCount = $hourly->max() ?: 1;

        $result = $hourly->map(function ($count, $hour) use ($maxCount, $totalDevices) {
            return [
                'hour' => $hour,
                'count' => $count,
                'bar_pct' => round(($count / $maxCount) * 100),
                'occupancy_pct' => round(($count / ($totalDevices * 7)) * 100),
            ];
        })->values();

        $hasData = $sessions->count() > 0;

        return response()->json([
            'has_data' => $hasData,
            'hourly' => $result,
            'busiest' => $hasData ? $result->sortByDesc('count')->first() : null,
            'quietest' => $hasData ? $result->sortBy('count')->first() : null,
        ]);
    }
}