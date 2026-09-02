<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // sudah dijamin login lewat middleware auth:sanctum di route
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'email' => [
                'sometimes',
                'string',
                'email',
                Rule::unique('users', 'email')->ignore($this->user()->id),
            ],
            'avatar' => ['sometimes', 'nullable', 'image', 'max:2048'],
        ];
    }
}