# Guide de connexion Frontend-Backend

## ✅ Configuration terminée

### Backend (Spring Boot)
- ✅ Configuration CORS ajoutée dans `CorsConfig.java`
- ✅ CORS activé dans `SecurityConfig.java`
- ✅ Autorisation des origines : `http://localhost:5173` et `http://localhost:3000`

### Frontend (React)
- ✅ Configuration API dans `src/config/api.js`
- ✅ Service axios avec intercepteurs configuré
- ✅ Gestion automatique du token JWT

## 📝 Créer le fichier .env

**IMPORTANT** : Créez manuellement un fichier `.env` à la racine de `my-react-app` avec :

```
VITE_API_BASE_URL=http://localhost:8080
```

### Méthode 1 : Via PowerShell
```powershell
cd my-react-app
echo "VITE_API_BASE_URL=http://localhost:8080" > .env
```

### Méthode 2 : Via l'éditeur
Créez un fichier nommé `.env` dans le dossier `my-react-app` et ajoutez :
```
VITE_API_BASE_URL=http://localhost:8080
```

## 🚀 Démarrer l'application

### 1. Démarrer le backend
```bash
# Dans le dossier racine (demo)
mvn spring-boot:run
```
Le backend sera accessible sur `http://localhost:8080`

### 2. Démarrer le frontend
```bash
# Dans le dossier my-react-app
npm run dev
```
Le frontend sera accessible sur `http://localhost:5173`

## 🧪 Tester la connexion

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Vous devriez voir la page de connexion
3. Connectez-vous avec vos identifiants
4. Le token JWT sera automatiquement stocké dans le localStorage
5. Vous serez redirigé vers le Dashboard

## 🔍 Vérification

### Dans la console du navigateur (F12)
- Vérifiez qu'il n'y a pas d'erreurs CORS
- Vérifiez que les requêtes sont bien envoyées vers `http://localhost:8080`
- Vérifiez que le token est stocké : `localStorage.getItem('auth_token')`

### Dans les logs du backend
- Vérifiez que les requêtes arrivent bien
- Vérifiez les logs de sécurité Spring

## ⚠️ Dépannage

### Erreur CORS
**Symptôme** : `Access to XMLHttpRequest at 'http://localhost:8080/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution** :
- Vérifiez que le backend est démarré
- Vérifiez que `CorsConfig.java` est bien compilé
- Redémarrez le backend

### Erreur 401 (Unauthorized)
**Symptôme** : `401 Unauthorized` lors de la connexion

**Solution** :
- Vérifiez vos identifiants
- Vérifiez que l'utilisateur existe dans la base de données
- Vérifiez les logs du backend pour plus de détails

### Erreur 403 (Forbidden)
**Symptôme** : `403 Forbidden` après connexion

**Solution** :
- Vérifiez que votre utilisateur a le rôle ADMIN si nécessaire
- Vérifiez que le token contient bien les bonnes autorités
- Vérifiez la configuration dans `SecurityConfig.java`

### Le token n'est pas stocké
**Symptôme** : Connexion réussie mais redirection vers login

**Solution** :
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que `authService.login()` retourne bien un token
- Vérifiez que `setToken()` fonctionne correctement

## 📚 Endpoints disponibles

### Authentification
- `POST /auth/login` - Connexion
- `POST /auth/signup?token=...` - Inscription

### Départements (nécessite ADMIN)
- `GET /departments/list-departments` - Liste des départements
- `POST /departments/create-department` - Créer un département
- `GET /departments/view/{id}` - Voir un département
- `PUT /departments/edit/{id}` - Modifier un département
- `DELETE /departments/{id}` - Supprimer un département

### Employés
- `GET /employees` - Liste des employés (ADMIN)
- `GET /employees/{id}` - Voir un employé (ADMIN ou USER)
- `POST /employees` - Créer un employé (ADMIN)
- `PUT /employees/{id}` - Modifier un employé (ADMIN ou USER)
- `DELETE /employees/{id}` - Supprimer un employé (ADMIN)

