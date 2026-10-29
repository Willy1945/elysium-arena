<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{

    public function redirect(Request $request)
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret) || str_contains($clientId, 'your_google')) {
            $message = 'Google OAuth belum dikonfigurasi. Harap isi GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di file .env backend.';
            if ($request->wantsJson() || $request->has('json')) {
                return response()->json(['message' => $message], 422);
            }
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("{$frontendUrl}/login?error=" . urlencode($message));
        }

        try {
            $redirectUrl = Socialite::driver('google')
                ->stateless()
                ->redirect()
                ->getTargetUrl();

            if ($request->wantsJson() || $request->has('json')) {
                return response()->json(['url' => $redirectUrl]);
            }

            return redirect($redirectUrl);
        } catch (Throwable $e) {
            $errorMsg = 'Gagal menghubungkan ke layanan Google: ' . $e->getMessage();
            if ($request->wantsJson() || $request->has('json')) {
                return response()->json(['message' => $errorMsg], 500);
            }
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect("{$frontendUrl}/login?error=" . urlencode($errorMsg));
        }
    }

    public function callback(Request $request)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        if ($request->has('error')) {
            return redirect("{$frontendUrl}/login?error=" . urlencode('Login Google dibatalkan atau ditolak.'));
        }

        try {

            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (Throwable $e) {
            return redirect("{$frontendUrl}/login?error=" . urlencode('Gagal memverifikasi akun Google: ' . $e->getMessage()));
        }

        $email = $googleUser->getEmail();
        $googleId = $googleUser->getId();
        $name = $googleUser->getName() ?: explode('@', $email)[0];
        $avatar = $googleUser->getAvatar();

        $user = User::where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            if (empty($user->google_id)) {
                $user->google_id = $googleId;
            }
            if (empty($user->avatar) && $avatar) {
                $user->avatar = $avatar;
            }
            $user->save();
        } else {
            $customerRole = Role::where('name', 'CUSTOMER')->first();
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'google_id' => $googleId,
                'avatar' => $avatar,
                'role_id' => $customerRole?->id ?? 3,
                'is_active' => true,
                'password' => null,
            ]);
        }

        if (!$user->is_active) {
            return redirect("{$frontendUrl}/login?error=" . urlencode('Akun Anda dinonaktifkan oleh administrator. Silakan hubungi manajemen arena.'));
        }

        $user->load('role');

        $token = $user->createToken('auth_token')->plainTextToken;

        $avatarUrl = $user->avatar;
        if ($avatarUrl && !str_starts_with($avatarUrl, 'http')) {
            $avatarUrl = asset('storage/' . $avatarUrl);
        }

        $payload = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'avatar' => $avatarUrl,
            'role' => $user->role?->name ?? 'CUSTOMER',
        ];

        $userData = urlencode(base64_encode(json_encode($payload)));

        return redirect("{$frontendUrl}/auth/google/callback?token={$token}&user={$userData}");
    }
}
