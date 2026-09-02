<?php

namespace App\Http\Requests\Session;

use Illuminate\Foundation\Http\FormRequest;

class StartSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'exists:devices,id'],
            'booking_id' => ['nullable', 'exists:bookings,id'],
            'user_id' => ['required_without:booking_id', 'nullable', 'exists:users,id'],
            'duration' => [
                'required',
                'integer',
                'min:60',
                'max:480',
                function ($attribute, $value, $fail) {
                    if ($value % 60 !== 0) {
                        $fail('Durasi harus kelipatan 60 menit (1 jam).');
                    }
                },
            ],
        ];
    }
}