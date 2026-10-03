<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DeviceRatingResource;
use App\Models\DeviceRating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        if (DeviceRating::where('user_id', $user->id)->exists()) {
            return response()->json([
                'message' => 'Kamu sudah pernah memberi rating untuk Elysium Arena.',
            ], 422);
        }

        $hasPlayed = $user->sessions()->where('status', 'completed')->exists();

        if (!$hasPlayed) {
            return response()->json([
                'message' => 'Kamu cuma bisa memberi rating setelah pernah menyelesaikan sesi bermain.',
            ], 422);
        }

        $rating = DeviceRating::create([
            'user_id' => $user->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return new DeviceRatingResource($rating->load('user'));
    }

    public function recent(Request $request)
    {
        $limit = $request->get('limit', 9);

        $ratings = DeviceRating::with('user')->orderByDesc('created_at')->limit($limit)->get();
        $allRatings = DeviceRating::query();

        return response()->json([
            'overall_average' => round((clone $allRatings)->avg('rating') ?? 0, 1),
            'overall_count' => (clone $allRatings)->count(),
            'reviews' => $ratings->map(fn($r) => [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'user_name' => $r->user?->name,
                'created_at' => $r->created_at,
            ]),
        ]);
    }
}