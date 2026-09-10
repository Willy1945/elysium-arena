<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'transaction_code' => $this->transaction_code,
            'is_archived' => !is_null($this->archived_at),
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'session' => $this->session_id ? [
                'id' => $this->session?->id,
                'device_id' => $this->session?->device_id,
                'device_code' => $this->session?->device?->code,
                'duration' => $this->session?->duration,
            ] : null,
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
            'gaming_amount' => $this->gaming_amount,
            'food_amount' => $this->food_amount,
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
        ];
    }
}