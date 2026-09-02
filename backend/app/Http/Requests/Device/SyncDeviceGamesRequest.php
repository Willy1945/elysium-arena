<?php

namespace App\Http\Requests\Device;

use Illuminate\Foundation\Http\FormRequest;

class SyncDeviceGamesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'game_ids' => ['required', 'array'],
            'game_ids.*' => ['exists:games,id'],
        ];
    }
}