# Intégration Frontend-Backend - M.C CHEQUES

## Résumé de l'intégration

Cette documentation détaille l'intégration entre le frontend Next.js et le backend Laravel API pour la plateforme M.C CHEQUES.

## Architecture

### Frontend (Next.js)
- **Stack**: React 19, Next.js 16, TypeScript
- **Style**: Tailwind CSS
- **Client API**: `src/lib/api.ts`
- **Hooks d'authentification**: `src/lib/useAuth.ts`
- **Contexte**: `src/lib/AuthContext.tsx`

### Backend (Laravel)
- **Routes API**: `routes/api.php` (préfixe `/api/`)
- **Contrôleurs**: `app/Http/Controllers/`
- **Modèles**: `app/Models/`

## Routes API Disponibles

### Authentification
```
POST   /api/login              - Connexion utilisateur
GET    /api/user               - Récupérer l'utilisateur actuel
POST   /api/logout             - Déconnexion utilisateur
```

**Réponse login** (200):
```json
{
  "message": "Connexion réussie.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "is_active": true,
    "roles": ["client"],
    "permissions": ["cheque.view", "cheque.create"]
  }
}
```

**Erreurs**:
- 401: "Identifiants invalides."
- 403: "Compte désactivé."

### Chèques
```
GET    /api/cheques            - Récupérer tous les chèques
POST   /api/cheques            - Créer un chèque
GET    /api/cheques/{id}       - Récupérer un chèque
PUT    /api/cheques/{id}       - Mettre à jour un chèque
DELETE /api/cheques/{id}       - Supprimer un chèque
```

### Agences
```
GET    /api/agencies           - Récupérer toutes les agences
POST   /api/agencies           - Créer une agence
GET    /api/agencies/{id}      - Récupérer une agence
PUT    /api/agencies/{id}      - Mettre à jour une agence
DELETE /api/agencies/{id}      - Supprimer une agence
```

### Banques
```
GET    /api/banks              - Récupérer toutes les banques
POST   /api/banks              - Créer une banque
GET    /api/banks/{id}         - Récupérer une banque
PUT    /api/banks/{id}         - Mettre à jour une banque
DELETE /api/banks/{id}         - Supprimer une banque
```

### Fichiers
```
GET    /api/files              - Récupérer les fichiers
POST   /api/files              - Uploader un fichier
GET    /api/files/{id}         - Récupérer un fichier
DELETE /api/files/{id}         - Supprimer un fichier
```

### Statuts
```
GET    /api/statuts            - Récupérer tous les statuts
GET    /api/statuts/{id}       - Récupérer un statut
```

## Flux d'authentification

1. **Utilisateur accède à `/client/accueil`** (page publique)
2. **Clique sur "Connexion"** → redirigé vers `/client/connexion`
3. **Soumet le formulaire** → `apiClient.login(email, password)`
4. **Backend vérifie les credentials** → retourne l'utilisateur avec rôles
5. **Frontend stocke l'utilisateur** dans `sessionStorage`
6. **Frontend redirige** selon les rôles:
   - `super-admin` → `/super-admin/dashboard`
   - `admin` → `/admin/dashboard`
   - `agent` → `/agent/dashboard`
   - `client` → `/client/dashboard` (par défaut)

## Configuration Environnement

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=M.C CHEQUES
```

### Backend (.env)
```env
APP_DEBUG=true
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=mc_cheques
DB_USERNAME=root
DB_PASSWORD=
```

## Gestion des Erreurs

### Frontend (src/lib/api.ts)
- **ApiError**: Interface pour les erreurs API
- **Erreurs 401**: Redirige vers login
- **Erreurs 403**: Affiche message "Non autorisé"
- **Erreurs 500**: Affiche message générique

### Backend
- JSON responses avec messages d'erreur explicites
- Code HTTP appropriés (200, 201, 400, 401, 403, 404, 500)

## Sécurité

### Frontend
- Stockage du token/session dans `sessionStorage` (non persistant)
- Inclusion du token CSRF dans les en-têtes
- Validation des données côté client

### Backend
- Authentification via Laravel Auth
- Vérification des permissions via `hasPermission()`
- Vérification des rôles via `hasRole()`
- Protections CSRF
- Validation des données avec Form Requests

## Tests

### Comptes de Test Recommandés
```
Super Admin:
  Email: superadmin@example.com
  Password: password

Admin (ACE Finance):
  Email: admin@acefinance.com
  Password: password

Agent:
  Email: agent@example.com
  Password: password

Client:
  Email: client@example.com
  Password: password
```

## Points de Vérification

- ✅ Routes API créées dans `routes/api.php`
- ✅ Bootstrap configuré avec les routes API
- ✅ AuthController retourne rôles et permissions
- ✅ Client API implémenté avec gestion des tokens
- ✅ Page connexion utilise l'API réelle
- ✅ Routage basé sur les rôles fonctionnel
- ✅ Hooks personnalisés pour l'authentification
- ✅ Gestion des erreurs côté frontend
- ⚠️ À vérifier: CORS configuration si domaines différents
- ⚠️ À vérifier: Migrations et seeders pour données de test

## Prochaines Étapes

1. **Configurer CORS** (si domaines différents)
   - Ajouter `trusted_hosts` dans config/hashing.php
   - Configurer middleware CORS

2. **Migrations & Seeders**
   - Créer les migrations pour les tables
   - Créer des seeders pour les données de test

3. **Créer les pages des dashboards**
   - `/client/dashboard`
   - `/admin/dashboard`
   - `/agent/dashboard`
   - `/super-admin/dashboard`

4. **Implémenter les services**
   - Services pour les chèques
   - Services pour les agences
   - Services pour les fichiers

5. **Tests**
   - Tests unitaires (Jest)
   - Tests E2E (Playwright)
   - Tests API (Postman/Insomnia)
