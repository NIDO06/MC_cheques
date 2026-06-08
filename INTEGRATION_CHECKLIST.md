# Checklist d'Intégration Frontend-Backend - M.C CHEQUES

## ✅ Complété

### Frontend (Next.js)
- ✅ Page d'accueil `/client/accueil` (statique)
- ✅ Page de connexion `/client/connexion` avec API intégration
- ✅ Client API (`src/lib/api.ts`) avec gestion des erreurs
- ✅ Hook `useAuth` pour la gestion d'authentification
- ✅ Context `AuthContext` pour partager l'état utilisateur
- ✅ Composant `ProtectedRoute` pour protéger les routes
- ✅ Services (`src/lib/services.ts`) pour les ressources API
- ✅ Configuration environnement `.env.local`
- ✅ Routage basé sur les rôles dans la page connexion
- ✅ Gestion des erreurs et messages utilisateur

### Backend (Laravel)
- ✅ Routes API dans `routes/api.php` avec préfixe `/api/`
- ✅ Configuration dans `bootstrap/app.php`
- ✅ AuthController amélioré avec retour des rôles/permissions
- ✅ Nouvelle méthode `me()` pour récupérer l'utilisateur courant
- ✅ Configuration CORS `config/cors.php`
- ✅ Middleware CORS enregistré
- ✅ Tous les contrôleurs existants (ChequeController, AgencyController, etc.)
- ✅ Gestion des permissions et rôles dans les contrôleurs

## 🔄 À Faire

### Frontend
- ⏳ Créer les pages des dashboards:
  - [ ] `/client/dashboard` - Tableau de bord client
  - [ ] `/admin/dashboard` - Tableau de bord administrateur
  - [ ] `/agent/dashboard` - Tableau de bord agent
  - [ ] `/super-admin/dashboard` - Tableau de bord super-admin
  
- ⏳ Implémenter les composants:
  - [ ] Composant `ClientDashboard` - Afficher chèques, demandes
  - [ ] Composant `ChequeForm` - Créer/modifier chèque
  - [ ] Composant `UserProfile` - Profil utilisateur
  - [ ] Composant `Navigation/Header` - Navigation par rôle
  
- ⏳ Pages supplémentaires:
  - [ ] `/client/demandes` - Liste des demandes
  - [ ] `/client/parametres` - Paramètres compte
  - [ ] `/agent/cheques` - Gestion des chèques
  - [ ] `/admin/agences` - Gestion des agences
  - [ ] `/admin/platform-logs` - Logs système
  - [ ] `/super-admin/bank-management` - Gestion des banques

### Backend
- ⏳ Créer les migrations (si pas déjà fait):
  - [ ] Migration users
  - [ ] Migration roles
  - [ ] Migration permissions
  - [ ] Migration cheques
  - [ ] Migration agencies
  - [ ] Migration banks
  - [ ] Migration historique_statuts
  
- ⏳ Créer les seeders:
  - [ ] RoleSeeder (créer roles: super-admin, admin, agent, client)
  - [ ] PermissionSeeder (créer permissions par ressource)
  - [ ] UserSeeder (créer comptes de test)
  - [ ] StatutSeeder (créer statuts: EN_ATTENTE, APPROUVÉ, etc.)
  - [ ] BankSeeder (créer banques: ACE Finance, UBA, ECOBANK)
  
- ⏳ Validation et Form Requests:
  - [ ] Vérifier `StoreChequeRequest`
  - [ ] Vérifier `UpdateChequeRequest`
  - [ ] Ajouter des Form Requests pour autres ressources
  
- ⏳ Tests:
  - [ ] Tests unitaires des contrôleurs
  - [ ] Tests API avec Postman/Insomnia
  - [ ] Tests d'authentification
  - [ ] Tests de permissions

## 🧪 Tests Manuels à Faire

### 1. Vérifier que le Backend Fonctionne

```bash
# Terminal 1: Lancer le serveur Laravel
cd mon-projet-laravel
php artisan serve

# Terminal 2: Tester les routes
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Vérifier que le Frontend Se Connecte

```bash
# Terminal: Lancer le dev server Next.js
cd MC_cheques
npm run dev

# Ouvrir http://localhost:3000/client/accueil
# Cliquer sur "Connexion"
# Tester avec un compte existant
```

### 3. Vérifier la CORS

```bash
# Depuis la console du navigateur (F12), aller dans Network
# et vérifier que les requêtes API incluent les headers CORS
```

### 4. Vérifier le Routage par Rôle

Tester avec différents comptes:
- Email contenant "superadmin" → `/super-admin/dashboard`
- Email contenant "admin" → `/admin/dashboard`
- Email contenant "agent" → `/agent/dashboard`
- Autres → `/client/dashboard`

## 📋 Fichiers Créés/Modifiés

### Frontend
```
MC_cheques/
├── .env.local (NEW)
├── src/
│   └── lib/
│       ├── api.ts (NEW)
│       ├── useAuth.ts (NEW)
│       ├── AuthContext.tsx (NEW)
│       ├── ProtectedRoute.tsx (NEW)
│       └── services.ts (NEW)
├── INTEGRATION_NOTES.md (NEW)
└── src/app/client/connexion/page.tsx (MODIFIED)
```

### Backend
```
mon-projet-laravel/
├── routes/api.php (NEW)
├── bootstrap/app.php (MODIFIED)
├── config/cors.php (NEW)
└── app/Http/Controllers/AuthController.php (MODIFIED)
```

## 🔐 Variables d'Environnement

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=M.C CHEQUES
```

### Backend (.env)
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 📞 Dépannage

### Problème: "CORS policy error"
- Vérifier que `config/cors.php` existe
- Vérifier que le middleware CORS est enregistré dans `bootstrap/app.php`
- Vérifier les URLs autorisées dans la config CORS

### Problème: "404 Not Found" sur /api/login
- Vérifier que `routes/api.php` existe
- Vérifier que `bootstrap/app.php` configure les routes API
- Vérifier que le serveur Laravel est lancé sur `http://localhost:8000`

### Problème: "Erreur de connexion"
- Vérifier les logs Laravel: `storage/logs/laravel.log`
- Vérifier que le compte utilisateur existe en base de données
- Vérifier que la colonne `is_active` est à `true`

### Problème: "Utilisateur non authentifié"
- Vérifier que les cookies de session sont activés
- Vérifier que `credentials: 'include'` est présent dans le client API
- Vérifier que la session Laravel est configurée correctement

## 📚 Ressources Utiles

- [Laravel API Routes](https://laravel.com/docs/13.x/routing#api-routes)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [CORS in Laravel](https://laravel.com/docs/13.x/cors)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
