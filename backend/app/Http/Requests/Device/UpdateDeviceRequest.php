<?php

namespace App\Http\Requests\Device;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_type_id' => ['sometimes', 'exists:device_types,id'],
            'code' => ['sometimes', 'string', 'max:255'],
            'price_per_hour' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', 'in:available,booked,occupied,maintenance'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'description' => ['nullable', 'string'],
            'game_ids' => ['nullable', 'array'],
            'game_ids.*' => ['exists:games,id'],
        ];
    }
}