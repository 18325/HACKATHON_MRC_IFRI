<!-- resources/views/auth/reset_password.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialiser le mot de passe</title>
</head>
<body>
    <h2>Réinitialiser votre mot de passe</h2>

    <form method="POST" action="{{ route('password.update') }}">
        @csrf
        <input type="hidden" name="email" value="{{ $email }}">

        <label for="password">Nouveau mot de passe</label>
        <input type="password" name="password" required><br><br>

        <label for="password_confirmation">Confirmer le mot de passe</label>
        <input type="password" name="password_confirmation" required><br><br>

        <button type="submit">Réinitialiser le mot de passe</button>
    </form>
</body>
</html>
