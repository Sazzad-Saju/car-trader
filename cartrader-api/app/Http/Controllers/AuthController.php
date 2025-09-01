<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function googleRedirect()
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'email', 'profile'])
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
        return redirect()->away($frontend . '/auth/callback?token=' . $token);
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

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'Email is not exists in our records! Please register!',
            ]);
        }

        if (! Hash::check($request->password, $user->password)) {
            return response()->json(['status' => false, 'message' => 'The provided credentials are incorrect.']);
        }

        $user->save();
        $user->token = $user->createToken('web')->plainTextToken;

        $user->user_type = 'customer';
        return new AuthResource($user);
    }

    public function register(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'avatar' => ['nullable', 'image', 'max:2048'],
                'password' => ['required', 'confirmed', 'min:8'],
            ]);

            // Handle avatar upload
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'avatar' => $avatarPath,
                'password' => Hash::make($validated['password']),
            ]);

            DB::commit();
            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'Sign up completed. Please verify your email.'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Catch the validation error and return a structured response
            DB::rollback();
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),  // This gives the validation errors in the correct format
                'message' => 'Sign up failed!'
            ]);
        } catch (\Exception $e) {
            logger('error');
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Sign up failed! ' . $e->getMessage()
            ]);
        }
    }

    public function user(Request $request)
    {
        logger($request->user());
        return new AuthResource($request->user());
    }
}
