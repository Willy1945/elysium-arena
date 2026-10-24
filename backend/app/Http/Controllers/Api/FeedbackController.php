<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\FeedbackResource;
use App\Models\Feedback;
use App\Services\TelegramService;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function __construct(protected TelegramService $telegramService)
    {
    }
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Feedback::with('user')->orderByDesc('created_at');

        if (! in_array($user->role?->name, ['OWNER', 'ADMIN'])) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        return FeedbackResource::collection($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => ['required', 'in:complaint,game_request,menu_request,other'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $feedback = Feedback::create([
            'user_id' => $request->user()->id,
            'category' => $request->category,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'pending',
        ]);

        $this->telegramService->sendFeedbackNotification($feedback);

        return new FeedbackResource($feedback->load('user'));
    }

    public function updateStatus(Request $request, Feedback $feedback)
    {
        $request->validate([
            'status' => ['required', 'in:pending,in_review,resolved'],
            'admin_response' => ['nullable', 'string', 'max:2000'],
        ]);

        $feedback->update($request->only(['status', 'admin_response']));

        return new FeedbackResource($feedback->load('user'));
    }

    public function destroy(Request $request, Feedback $feedback)
    {
        $user = $request->user();
        $isStaff = in_array($user->role?->name, ['OWNER', 'ADMIN']);

        if (!$isStaff && $feedback->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak berhak menghapus masukan ini.'], 403);
        }

        $feedback->delete();

        return response()->json(['message' => 'Masukan berhasil dihapus.']);
    }
}