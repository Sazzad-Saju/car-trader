<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/health', fn () => ['status' => 'ok']);
Route::get('/greeting', fn () => ['message' => 'Hello from Laravel API']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $u = $request->user(); // User model from your googleCallback
    return response()->json([
        'id'          => $u->id,
        'name'        => $u->name,
        'email'       => $u->email,
        'avatar'      => $u->avatar,
    ]);
});

Route::middleware('auth:sanctum')->post('/auth/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();
    return response()->noContent();
});
