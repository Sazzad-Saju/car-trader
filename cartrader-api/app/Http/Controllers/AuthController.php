<?php

namespace App\Http\Controllers;

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function googleRedirect()
    {
        return Socialite::driver('google')
            ->scopes(['openid','email','profile'])
            ->redirect();
    }

    public function googleCallback()
    {
        // Use stateless if you’re not relying on Laravel session
        $googleUser = Socialite::driver('google')->stateless()->user();

        // Split name into first/last (optional)
        $fullName = $googleUser->getName() ?: $googleUser->getNickname() ?: '';
        [$first, $last] = array_pad(explode(' ', $fullName, 2), 2, '');

        // Find or create your User
        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'              => $fullName,
                'google_id'         => $googleUser->getId(),
                'avatar'            => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'password'          => Str::random(40),
            ]
        );

        // Issue Sanctum token
        $token = $user->createToken('web')->plainTextToken;

        // Send user back to Nuxt with token in the URL
        $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
        return redirect()->away($frontend.'/auth/callback?token='.$token);
    }
}
