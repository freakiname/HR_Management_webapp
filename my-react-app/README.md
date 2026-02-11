# HR Management - Frontend React

Application React pour la gestion des ressources humaines, connectée à une API Spring Boot.

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs (Button, Input, Loading)
│   └── Layout/         # Layout et Navigation
├── pages/              # Pages de l'application
│   ├── Login/          # Page de connexion
│   ├── Dashboard/      # Tableau de bord
│   └── Departments/    # Gestion des départements
├── services/            # Services API
│   ├── api.js          # Configuration axios
│   ├── authService.js  # Service d'authentification
│   ├── departmentService.js
│   └── employeeService.js
├── context/            # Context API
│   └── AuthContext.jsx # Contexte d'authentification
├── hooks/              # Hooks personnalisés
│   └── useProtectedRoute.js
├── utils/              # Utilitaires
│   ├── constants.js    # Constantes
│   └── helpers.js      # Fonctions utilitaires
├── config/             # Configuration
│   └── api.js          # Configuration API
└── App.jsx             # Composant principal
```

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à la racine du projet :
```
VITE_API_BASE_URL=http://localhost:8080
```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Gestion des rôles (ADMIN, USER)
- ✅ Protection des routes
- ✅ Navigation avec React Router
- ✅ Services API pour les départements et employés
- ✅ Composants réutilisables

## Technologies utilisées

- React 19
- Vite
- React Router DOM
- Axios
- JWT Decode
- Context API
