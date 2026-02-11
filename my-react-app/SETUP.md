# Configuration Frontend-Backend

## Étape 1 : Créer le fichier .env

Créez un fichier `.env` à la racine du dossier `my-react-app` avec le contenu suivant :

```
VITE_API_BASE_URL=http://localhost:8080
```

## Étape 2 : Démarrer le backend

Assurez-vous que votre application Spring Boot est démarrée et accessible sur `http://localhost:8080`

```bash
# Dans le dossier racine du projet
mvn spring-boot:run
```

## Étape 3 : Démarrer le frontend

```bash
# Dans le dossier my-react-app
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## Configuration CORS

Le backend a été configuré pour accepter les requêtes depuis :
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server alternatif)

## Test de connexion

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Connectez-vous avec vos identifiants
3. Le token JWT sera automatiquement stocké et utilisé pour les requêtes suivantes

## Dépannage

### Erreur CORS
Si vous voyez des erreurs CORS dans la console :
- Vérifiez que le backend est démarré
- Vérifiez que l'URL dans `.env` correspond à l'URL du backend
- Vérifiez les logs du backend pour voir les requêtes reçues

### Erreur 401 (Unauthorized)
- Vérifiez que vous êtes bien connecté
- Vérifiez que le token est bien stocké dans le localStorage
- Vérifiez que le token n'est pas expiré

### Erreur 403 (Forbidden)
- Vérifiez que votre utilisateur a le bon rôle (ADMIN pour certaines actions)
- Vérifiez que le token contient bien les bonnes autorités

