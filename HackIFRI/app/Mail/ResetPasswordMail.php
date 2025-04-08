<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\URL;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $tempPassword;

    public function __construct($tempPassword) {
        $this->tempPassword = $tempPassword;
    }

    /**
     * Construire le message de l'e-mail.
     *
     * @return $this
     */
    public function build() {
        return $this->subject('Votre mot de passe temporaire')
                   ->view('emails.temp_password', ['password' => $this->tempPassword]);
    }
}
