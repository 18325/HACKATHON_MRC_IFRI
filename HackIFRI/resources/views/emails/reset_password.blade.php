<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation du mot de passe</title>
</head>
<body>
    <h1>Bonjour {{ $user->first_name }}!</h1>
    <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous :</p>
    <a href="{{ $resetUrl }}">Réinitialiser mon mot de passe</a>
    <p>Ce lien expirera dans 60 minutes.</p>
</body>
</html>
