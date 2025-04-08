<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Controller;
use Exception;

class ResetPasswordController extends Controller
{
    // Afficher le formulaire de réinitialisation du mot de passe
    public function showForm($email)
    {
        try {
            // Vérifier si l'email existe
            if (!User::where('email', $email)->exists()) {
                return redirect()->route('login')->withErrors(['email' => 'Email non trouvé']);
            }

            // Afficher le formulaire de réinitialisation
            return view('auth.reset_password', compact('email'));

        } catch (Exception $e) {
            // Gestion des erreurs
            return redirect()->route('login')->withErrors(['error' => 'Une erreur s\'est produite lors de la vérification de l\'email : ' . $e->getMessage()]);
        }
    }

    // Réinitialiser le mot de passe
    public function reset(Request $request)
    {
        try {
            // Valider la requête
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|confirmed|min:8',
            ]);

            // Chercher l'utilisateur par email
            $user = User::where('email', $request->email)->first();

            // Vérifier si l'utilisateur existe
            if (!$user) {
                return redirect()->route('login')->withErrors(['email' => 'Email non trouvé']);
            }

            // Mettre à jour le mot de passe
            $user->password = Hash::make($request->password);
            $user->save();

            return redirect()->route('login')->with('status', 'Votre mot de passe a été réinitialisé avec succès!');

        } catch (Exception $e) {
            // Gestion des erreurs
            return redirect()->route('login')->withErrors(['error' => 'Une erreur s\'est produite lors de la réinitialisation du mot de passe : ' . $e->getMessage()]);
        }
    }
}
