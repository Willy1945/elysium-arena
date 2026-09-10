<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeviceRatingResource;
use App\Models\Device;
use App\Models\DeviceRating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function index(Device $device)
    {
        $ratings = $device->ratings()->with('user')->orderByDesc('created_at')->get();

        $distribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $distribution[$i] = $ratings->where('rating', $i)->count();
        }

        return response()->json([
            'average' => $ratings->isNotEmpty() ? round($ratings->avg('rating'), 1) : 0,
            'count' => $ratings->count(),
            'distribution' => $distribution,
            'ratings' => DeviceRatingResource::collection($ratings),
        ]);
    }

    public function store(Request $request, Device $device)
    {
        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        $hasPlayed = $user->sessions()
            ->where('device_id', $device->id)
            ->where('status', 'completed')
            ->exists();

        if (!$hasPlayed) {
            return response()->json([
                'message' => 'Kamu cuma bisa memberi rating setelah pernah bermain di device ini.',
            ], 422);
        }

        $rating = DeviceRating::updateOrCreate(
            ['device_id' => $device->id, 'user_id' => $user->id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );

        return new DeviceRatingResource($rating->load('user'));
    }

    public function recent(Request $request)
    {
        $limit = $request->get('limit', 9);

        $ratings = DeviceRating::with(['user', 'device'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        $allRatings = DeviceRating::query();

        return response()->json([
            'overall_average' => round((clone $allRatings)->avg('rating') ?? 0, 1),
            'overall_count' => (clone $allRatings)->count(),
            'reviews' => $ratings->map(fn($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'user_name' => $r->user?->name,
                'device_code' => $r->device?->code,
                'created_at' => $r->created_at,
            ]),
        ]);
    }
}