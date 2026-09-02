<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'name' => $this->name,
            'price' => $this->price,
            'stock' => $this->stock,
            'minimum_stock' => $this->minimum_stock,
            'stock_status' => $this->stock_status, // pakai accessor dari Model
            'image' => $this->image ? Storage::url($this->image) : null,
            'description' => $this->description,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at,
        ];
    }
}