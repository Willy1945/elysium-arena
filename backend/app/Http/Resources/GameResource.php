<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GameResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'platforms' => $this->platforms ?? [],
            'cover_image' => $this->cover_image ? Storage::url($this->cover_image) : null,
            'description' => $this->description,
            'devices' => DeviceResource::collection($this->whenLoaded('devices')),
        ];
    }
}