<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_id' => ['required', 'exists:devices,id'],
            'booking_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
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

    public function messages(): array
    {
        return [
            'booking_date.after_or_equal' => 'Tanggal booking tidak boleh di masa lalu.',
        ];
    }
}