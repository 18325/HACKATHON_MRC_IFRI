<?php

namespace App\Http\Controllers;
use App\Http\Requests\DoctorRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Models\Patient;
use Laravel\Sanctum\HasApiTokens;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Mail\TemporaryPasswordMail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // Créer un nouvel utilisateur (médecin, laborantin, etc.)
    public function createUser(DoctorRequest $request)
    {
        if (User::where('email', $request->email)->exists()) {
            return ResponseController::apiResponse(false, 'Cet email est déjà utilisé', '', 409);
        }
        try {
            // 1. Générer un mot de passe temporaire aléatoire
                $tempPassword = Str::password(10);

                // 2. Créer l'utilisateur avec le mot de passe temporaire
                $user = User::create([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'contact' => $request->contact,
                    'password' => Hash::make($tempPassword), //  hashage le mot de passe temporaire
                ]);

                $user->assignRole("user");

                // 3. Envoyer l'email avec le mot de passe temporaire
                Mail::to($user->email)->send(new ResetPasswordMail($tempPassword)); 

                return ResponseController::apiResponse(true, 'Médecin créé avec succès. Un mot de passe temporaire a été envoyé par email.', '', 201);

            } catch (\Exception $e) {
                return ResponseController::apiResponse(false, 'Erreur lors de la création', $e->getMessage(), 500);
            }
    }

    public function retrieveDoctor() {
        $doctors = User::role('user')->get();
        return ResponseController::apiResponse(true, '', $doctors, 200);
    }

    public function stat() {
        $nbr = User::role('user')->count();
        $nbrPatients = Patient::all()->count();
        return ResponseController::apiResponse(true, '', [$nbr, $nbrPatients], 200);
    }

    public function updateEmail(UpdateAdminRequest $request)
    {
        try {
            $user = $request->user();
            $user->email = $request->email;
            $user->save();

            return ResponseController::apiResponse(true, 'Email mis à jour avec succès', [], 200);

        } catch (\Exception $e) {
            return ResponseController::apiResponse(false, 'Une erreur est survenue lors de la mise à jour du mail.', $e->getMessage(), 500);
        }
    }
    public function update(UpdatePasswordRequest $request)
    {
        try {
            $user = $request->user();
            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'message' => 'Votre mot de passe a été mis à jour avec succès.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la mise à jour du mot de passe.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}

