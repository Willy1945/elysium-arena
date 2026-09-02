<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_code' => $this->order_code,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'session' => $this->session_id ? [
                'id' => $this->session?->id,
                'device_code' => $this->session?->device?->code,
            ] : null,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'total_price' => $this->total_price,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}