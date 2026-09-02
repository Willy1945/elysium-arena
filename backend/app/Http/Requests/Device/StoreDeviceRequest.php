<?php

namespace App\Http\Requests\Device;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah dijaga role middleware di route
    }

    public function rules(): array
    {
        return [
            'device_type_id' => ['required', 'exists:device_types,id'],
            'code' => ['required', 'string', 'max:255'],
            'price_per_hour' => ['required', 'integer', 'min:0'],
            'status' => ['nullable', 'in:available,booked,occupied,maintenance'],
            'photo' => ['nullable', 'image', 'max:2048'],
            'description' => ['nullable', 'string'],
            'game_ids' => ['nullable', 'array'],
            'game_ids.*' => ['exists:games,id'],
        ];
    }
}