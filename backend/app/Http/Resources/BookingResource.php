<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
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
            'created_at' => $this->created_at,
        ];
    }
}