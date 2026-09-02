<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Session\ExtendSessionRequest;
use App\Http\Requests\Session\StartSessionRequest;
use App\Http\Resources\SessionResource;
use App\Models\GamingSession;
use App\Services\SessionService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SessionController extends Controller
{
    public function __construct(protected SessionService $sessionService)
    {
    }

    public function active()
    {
        $sessions = GamingSession::with(['user', 'device.deviceType'])
            ->where('status', 'active')
            ->orderBy('end_time')
            ->get();

        return SessionResource::collection($sessions);
    }

    public function index(Request $request)
    {
        $query = GamingSession::with(['user', 'device.deviceType']);

        $user = $request->user();
        if (! in_array($user->role?->name, ['OWNER', 'ADMIN'])) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return SessionResource::collection($query->orderByDesc('start_time')->paginate(20));
    }

    public function start(StartSessionRequest $request)
    {
        try {
            $session = $this->sessionService->start($request->validated());
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal memulai session.', 'errors' => $e->errors()], 422);
        }

        return new SessionResource($session->load(['user', 'device.deviceType']));
    }

    public function extend(ExtendSessionRequest $request, GamingSession $session)
    {
        try {
            $session = $this->sessionService->extend($session, $request->additional_minutes);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal extend session.', 'errors' => $e->errors()], 422);
        }

        return new SessionResource($session->load(['user', 'device.deviceType']));
    }

    public function end(GamingSession $session)
    {
        try {
            $session = $this->sessionService->end($session);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal mengakhiri session.', 'errors' => $e->errors()], 422);
        }

        return new SessionResource($session->load(['user', 'device.deviceType']));
    }
}