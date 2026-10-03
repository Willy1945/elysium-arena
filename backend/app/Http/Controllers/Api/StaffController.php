<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    private const STAFF_ROLES = ['ADMIN', 'STAFF_CAFE'];

    public function index(Request $request)
    {
        $query = User::with('role')->whereHas('role', fn ($q) => $q->whereIn('name', self::STAFF_ROLES));

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return UserResource::collection($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:' . implode(',', self::STAFF_ROLES)],
        ]);

        $role = Role::where('name', $request->role)->first();

        $staff = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role_id' => $role->id,
            'is_active' => true,
        ]);

        return response()->json(['user' => new UserResource($staff->load('role'))], 201);
    }

    public function update(Request $request, User $staff)
    {
        $this->ensureIsStaff($staff);

        $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'unique:users,email,' . $staff->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['sometimes', 'in:' . implode(',', self::STAFF_ROLES)],
        ]);

        $data = $request->only(['name', 'email', 'phone']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->filled('role')) {
            $data['role_id'] = Role::where('name', $request->role)->first()->id;
        }

        $staff->update($data);

        return response()->json(['user' => new UserResource($staff->fresh()->load('role'))]);
    }

    public function toggleStatus(User $staff)
    {
        $this->ensureIsStaff($staff);

        $staff->update(['is_active' => !$staff->is_active]);

        return response()->json(['user' => new UserResource($staff->fresh()->load('role'))]);
    }

    private function ensureIsStaff(User $staff): void
    {
        abort_unless(in_array($staff->role?->name, self::STAFF_ROLES), 404);
    }
}