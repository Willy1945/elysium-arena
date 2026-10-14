<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoyaltyRewardResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'milestone' => $this->milestone,
            'title' => $this->title ?? ($this->type === 'free_hour' ? 'Gratis 1 Jam Bermain' : ($this->type === 'free_2_hours' ? 'Gratis 2 Jam Bermain' : 'Gratis Menu Kafe')),
            'type' => $this->type,
            'status' => $this->status,
            'catalog_id' => $this->catalog_id,
            'redeemed_at' => $this->redeemed_at,
            'user_name' => $this->whenLoaded('user', fn () => $this->user->name),
            'created_at' => $this->created_at,
        ];
    }
}