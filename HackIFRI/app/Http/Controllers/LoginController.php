<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(LoginRequest $request) {

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            $token = $user->createToken($request->email);

            return ResponseController::apiResponse(true, 'Connexion réussie', [
                'accessToken' => $token->plainTextToken,
                'role' => $user->roles[0]->name,
            ]);
        }
        return ResponseController::apiResponse(false, 'Identifiants incorrects', '', 403);
    }
}
