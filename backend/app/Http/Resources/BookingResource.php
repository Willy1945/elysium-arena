<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isPlaying = \App\Models\GamingSession::where('status', 'active')
            ->where(function ($q) {
                $q->where('booking_id', $this->id)
                  ->orWhere(function ($sub) {
                      $sub->where('device_id', $this->device_id)
                          ->where('user_id', $this->user_id);
                  });
            })
            ->exists();

        return [
            'id' => $this->id,
            'booking_code' => $this->booking_code,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
            ],
            'device' => new DeviceResource($this->whenLoaded('device')),
            'booking_date' => $this->booking_date->format('Y-m-d'),
            'start_time' => substr($this->start_time, 0, 5),
            'end_time' => substr($this->end_time, 0, 5),
            'duration' => $this->duration,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'is_playing' => $isPlaying,
            'can_cancel' => in_array($this->status, ['pending', 'confirmed']) && ! $isPlaying,
            'created_at' => $this->created_at,
        ];
    }
}