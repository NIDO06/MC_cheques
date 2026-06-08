#!/bin/bash

# Script de vérification de l'intégration frontend-backend
# Usage: bash check-integration.sh

echo "========================================="
echo "Vérification de l'Intégration M.C CHEQUES"
echo "========================================="
echo ""

# Vérifier que le backend Laravel est accessible
echo "1️⃣ Vérification du serveur Backend..."
if curl -s http://localhost:8000/up > /dev/null 2>&1; then
    echo "✅ Backend est accessible sur http://localhost:8000"
else
    echo "❌ Backend n'est pas accessible"
    echo "   Lancez: php artisan serve"
    exit 1
fi

# Vérifier que le frontend Next.js est accessible
echo ""
echo "2️⃣ Vérification du serveur Frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend est accessible sur http://localhost:3000"
else
    echo "⚠️ Frontend n'est pas accessible sur le port 3000"
    echo "   Assurez-vous que npm run dev est lancé"
fi

# Vérifier la route API login
echo ""
echo "3️⃣ Vérification de la route API /api/login..."
RESPONSE=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}')

if echo "$RESPONSE" | grep -q "message"; then
    echo "✅ Route /api/login répond correctement"
    echo "   Réponse: $RESPONSE"
else
    echo "⚠️ Route /api/login n'a pas répondu comme prévu"
fi

# Vérifier les fichiers clés du frontend
echo ""
echo "4️⃣ Vérification des fichiers Frontend..."
FILES=(
    "src/lib/api.ts"
    "src/lib/useAuth.ts"
    "src/lib/AuthContext.tsx"
    "src/lib/ProtectedRoute.tsx"
    "src/lib/services.ts"
    "src/lib/config.ts"
    ".env.local"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file est manquant"
    fi
done

# Vérifier les fichiers clés du backend
echo ""
echo "5️⃣ Vérification des fichiers Backend..."
BACKEND_FILES=(
    "routes/api.php"
    "config/cors.php"
    "app/Http/Controllers/AuthController.php"
)

cd ../mon-projet-laravel

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file est manquant"
    fi
done

cd ../MC_cheques

# Vérifier package.json
echo ""
echo "6️⃣ Vérification des dépendances..."
if grep -q '"next"' package.json; then
    echo "✅ Next.js est installé"
else
    echo "⚠️ Next.js ne semble pas être dans package.json"
fi

# Afficher les commandes de démarrage
echo ""
echo "========================================="
echo "🚀 Prochaines Étapes:"
echo "========================================="
echo ""
echo "Terminal 1 - Lancer le backend:"
echo "  cd ../mon-projet-laravel"
echo "  php artisan serve"
echo ""
echo "Terminal 2 - Lancer le frontend:"
echo "  npm run dev"
echo ""
echo "Puis ouvrir: http://localhost:3000/client/accueil"
echo ""
echo "========================================="
