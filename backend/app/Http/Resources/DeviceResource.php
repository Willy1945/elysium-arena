<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DeviceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
        'code' => $this->code,
        'device_type' => new DeviceTypeResource($this->whenLoaded('deviceType')),
        'price_per_hour' => $this->price_per_hour,
        'status' => $this->status,
        'photo' => $this->photo ? Storage::url($this->photo) : null,
        'description' => $this->description,
        'games' => GameResource::collection($this->whenLoaded('games')),
        'today_bookings_count' => $this->today_bookings_count ?? 0,   // ← baru
        'created_at' => $this->created_at,
        ];
    }
}