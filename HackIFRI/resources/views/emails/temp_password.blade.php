<!DOCTYPE html>
<html>
    <head>
        <title>Mot de passe temporaire</title>
    </head>
    <body>
        <p>Bonjour,</p>
        <p>Voici votre mot de passe temporaire pour la plateforme RenalCare :</p>
        <h3>{{ $password }}</h3>
        <p>Connectez-vous <a href="{{ url('/login') }}">ici</a> et modifiez-le dans vos paramètres.</p>
        <p> L'équipe RenalCare</p>
    </body>
</html>