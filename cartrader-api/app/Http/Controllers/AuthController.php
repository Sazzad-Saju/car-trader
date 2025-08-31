<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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

        logger($token);

        // Send user back to Nuxt with token in the URL
        $frontend = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
        return redirect()->away($frontend.'/auth/callback?token='.$token);
    }

    // login
    public function login(Request $request)
    {
        $request->validate(
            [
                'email'      => 'nullable|required_if:user_type,customer',
                'password'   => 'nullable|required_if:user_type,customer',
            ],
            [
                'email.required_if'    => 'Email is required.',
                'password.required_if' => 'Password is required.',
            ]
        );

        $user = User::where('email', $request->email)->first();

        if(! $user) {
            throw ValidationException::withMessages([
                'email' => 'Email is not exists in our records! Please register!',
            ]);
        }

        if(! Hash::check($request->password, $user->password)) {
            return response()->json(['status' => false, 'message' => 'The provided credentials are incorrect.']);
        }

        $user->save();
        $user->token = $user->createToken('web')->plainTextToken;

        $user->user_type = 'customer';
        return new AuthResource($user);
    }
}
