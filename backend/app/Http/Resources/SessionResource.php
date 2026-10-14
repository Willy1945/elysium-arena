<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_id' => $this->booking_id,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name ?: ($this->guest_name ?: 'Tamu (Walk-In)'),
            ],
            'guest_name' => $this->guest_name,
            'is_guest' => is_null($this->user_id),
            'device' => new DeviceResource($this->whenLoaded('device')),
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'duration' => $this->duration,
            'price' => $this->price,
            'status' => $this->status,
            'remaining_seconds' => $this->status === 'active' ? $this->remaining_seconds : 0,
        ];
    }
}