<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isStaff = in_array($this->user()->role?->name, ['OWNER', 'ADMIN', 'STAFF_CAFE']);

        return [
            'user_id' => [$isStaff ? 'required' : 'nullable', 'exists:users,id'],
            'session_id' => ['nullable', 'exists:sessions,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}