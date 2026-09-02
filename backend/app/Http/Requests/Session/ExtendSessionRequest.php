<?php

namespace App\Http\Requests\Session;

use Illuminate\Foundation\Http\FormRequest;

class ExtendSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'additional_minutes' => ['required', 'integer', 'in:30,60,120'],
        ];
    }
}