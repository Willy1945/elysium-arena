<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LoyaltyRewardResource;
use App\Models\GamingSession;
use App\Models\LoyaltyReward;
use App\Models\LoyaltyRewardCatalog;
use App\Models\LoyaltyTransaction;
use App\Models\Notification;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LoyaltyRewardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->fresh();

        $completedCount = GamingSession::where('user_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $totalMinutes = GamingSession::where('user_id', $user->id)
            ->where('status', 'completed')
            ->sum('duration');

        $rewards = LoyaltyReward::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        $catalog = LoyaltyRewardCatalog::where('is_active', true)
            ->orderBy('points_required', 'asc')
            ->get();

        $transactions = LoyaltyTransaction::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(30)
            ->get();

        $rewardProduct = Product::where('is_reward_item', true)->where('is_active', true)->first();

        return response()->json([
            'loyalty_points' => (int) ($user->loyalty_points ?? 0),
            'completed_sessions' => $completedCount,
            'total_hours_played' => round($totalMinutes / 60, 1),
            'progress_current' => $completedCount % 10,
            'progress_target' => 10,
            'reward_product_name' => $rewardProduct?->name,
            'catalog' => $catalog,
            'rewards' => LoyaltyRewardResource::collection($rewards),
            'transactions' => $transactions,
        ]);
    }

    public function redeem(Request $request)
    {
        $request->validate([
            'catalog_id' => ['required', 'exists:loyalty_reward_catalogs,id'],
        ]);

        $user = $request->user();

        return DB::transaction(function () use ($request, $user) {
            $user = \App\Models\User::where('id', $user->id)->lockForUpdate()->first();
            $catalog = LoyaltyRewardCatalog::where('id', $request->catalog_id)
                ->where('is_active', true)
                ->firstOrFail();

            if ($user->loyalty_points < $catalog->points_required) {
                throw ValidationException::withMessages([
                    'catalog_id' => [
                        "Poin kamu ({$user->loyalty_points} poin) tidak mencukupi untuk menukar {$catalog->title} yang membutuhkan {$catalog->points_required} poin."
                    ],
                ]);
            }

            $user->decrement('loyalty_points', $catalog->points_required);

            $reward = LoyaltyReward::create([
                'user_id' => $user->id,
                'milestone' => 0,
                'catalog_id' => $catalog->id,
                'title' => $catalog->title,
                'type' => $catalog->reward_type,
                'status' => 'available',
            ]);

            LoyaltyTransaction::create([
                'user_id' => $user->id,
                'type' => 'redeem_reward',
                'amount' => -$catalog->points_required,
                'description' => "Penukaran Hadiah: {$catalog->title}",
                'reference_id' => $reward->id,
            ]);

            Notification::create([
                'user_id' => $user->id,
                'title' => 'Penukaran Reward Berhasil! 🎉',
                'message' => "Kamu berhasil menukarkan {$catalog->points_required} koin untuk {$catalog->title}. Voucher siap digunakan saat booking atau order makanan.",
                'type' => 'loyalty_reward',
            ]);

            return response()->json([
                'message' => 'Reward berhasil ditukar! Voucher siap digunakan.',
                'reward' => new LoyaltyRewardResource($reward),
                'loyalty_points' => $user->fresh()->loyalty_points,
            ]);
        });
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

    public function adminIndex()
    {
        $rewards = LoyaltyReward::with('user', 'catalog')->orderByDesc('created_at')->get();
        return LoyaltyRewardResource::collection($rewards);
    }

    public function destroy(Request $request, LoyaltyReward $reward)
    {
        $user = $request->user();

        if ($reward->user_id !== $user->id) {
            return response()->json(['message' => 'Reward ini bukan milikmu.'], 403);
        }

        if ($reward->status !== 'redeemed') {
            return response()->json(['message' => 'Hanya voucher yang sudah terpakai yang bisa dihapus dari riwayat.'], 422);
        }

        $reward->delete();

        return response()->json(['message' => 'Riwayat voucher berhasil dihapus.']);
    }

    public function clearRedeemed(Request $request)
    {
        $user = $request->user();

        LoyaltyReward::where('user_id', $user->id)
            ->where('status', 'redeemed')
            ->delete();

        return response()->json(['message' => 'Semua riwayat voucher terpakai berhasil dibersihkan.']);
    }
}