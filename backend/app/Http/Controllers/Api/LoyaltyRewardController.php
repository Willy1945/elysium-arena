<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoyaltyRewardResource;
use App\Models\GamingSession;
use App\Models\LoyaltyReward;
use App\Models\Product;
use Illuminate\Http\Request;

class LoyaltyRewardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $completedCount = GamingSession::where('user_id', $user->id)->where('status', 'completed')->count();
        $rewards = LoyaltyReward::where('user_id', $user->id)->orderByDesc('created_at')->get();

        $rewardProduct = Product::where('is_reward_item', true)->where('is_active', true)->first();

        return response()->json([
            'completed_sessions' => $completedCount,
            'progress_current' => $completedCount % 10,
            'progress_target' => 10,
            'reward_product_name' => $rewardProduct?->name,
            'rewards' => LoyaltyRewardResource::collection($rewards),
        ]);
    }

    public function choose(Request $request, LoyaltyReward $reward)
    {
        if ($reward->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Reward ini bukan milikmu.'], 403);
        }

        if ($reward->status !== 'pending_choice') {
            return response()->json(['message' => 'Reward ini sudah dipilih sebelumnya.'], 422);
        }

        $request->validate(['type' => ['required', 'in:free_hour,free_food']]);

        $reward->update(['type' => $request->type, 'status' => 'available']);

        return new LoyaltyRewardResource($reward);
    }

    // Khusus Admin/Owner — daftar semua reward untuk pemantauan
    public function adminIndex()
    {
        $rewards = LoyaltyReward::with('user')->orderByDesc('created_at')->get();
        return LoyaltyRewardResource::collection($rewards);
    }
}