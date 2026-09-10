<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService)
    {
    }

    public function index(Request $request)
    {
        $query = Order::with(['user', 'session.device', 'items.product']);

        $user = $request->user();
        if (!in_array($user->role?->name, ['OWNER', 'ADMIN', 'STAFF_CAFE'])) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return OrderResource::collection($query->orderByDesc('created_at')->get());
    }

    public function show(Order $order)
    {
        return new OrderResource($order->load(['user', 'session.device', 'items.product']));
    }

    public function store(StoreOrderRequest $request)
    {
        $actor = $request->user();
        $data = $request->validated();

        $isStaff = in_array($actor->role?->name, ['OWNER', 'ADMIN', 'STAFF_CAFE']);

        if (!$isStaff) {
            // Customer cuma boleh order atas nama dirinya sendiri
            $data['user_id'] = $actor->id;

            // Kalau menyertakan session_id, pastikan itu session miliknya sendiri & masih aktif
            if (!empty($data['session_id'])) {
                $session = \App\Models\GamingSession::find($data['session_id']);
                if (!$session || $session->user_id !== $actor->id || $session->status !== 'active') {
                    return response()->json(['message' => 'Session tidak valid.'], 422);
                }
            }
        }

        try {
            $order = $this->orderService->create($data, $actor->id);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal membuat order.', 'errors' => $e->errors()], 422);
        }

        return new OrderResource($order->load(['user', 'session.device', 'items.product']));
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => ['required', 'in:processing,ready,delivered,completed,cancelled'],
        ]);

        $order = $this->orderService->updateStatus($order, $request->status, $request->user()->id);

        return new OrderResource($order->load(['user', 'session.device', 'items.product']));
    }
}