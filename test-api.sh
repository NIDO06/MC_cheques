#!/bin/bash

# Script de test des routes API
# Exécutez ce script pour tester les endpoints API

BASE_URL="http://localhost:8000/api"

echo "================================"
echo "Tests des Routes API"
echo "================================"
echo ""

# Test 1: Login avec mauvaises credentials
echo "1️⃣ Test POST /api/login (identifiants incorrects):"
curl -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}' \
  -w "\nStatus: %{http_code}\n\n"

# Test 2: Login avec bonnes credentials (à adapter selon vos données)
echo "2️⃣ Test POST /api/login (identifiants corrects):"
echo "   ⚠️ À adapter selon vos données en base de données"
curl -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  -w "\nStatus: %{http_code}\n\n" \
  -c cookies.txt

# Test 3: Obtenir l'utilisateur courant
echo "3️⃣ Test GET /api/user (avec cookies de session):"
curl -X GET "$BASE_URL/user" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "\nStatus: %{http_code}\n\n"

# Test 4: Récupérer les chèques
echo "4️⃣ Test GET /api/cheques:"
curl -X GET "$BASE_URL/cheques" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "\nStatus: %{http_code}\n\n"

# Test 5: Récupérer les banques
echo "5️⃣ Test GET /api/banks:"
curl -X GET "$BASE_URL/banks" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "\nStatus: %{http_code}\n\n"

# Test 6: Récupérer les agences
echo "6️⃣ Test GET /api/agencies:"
curl -X GET "$BASE_URL/agencies" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "\nStatus: %{http_code}\n\n"

# Test 7: Récupérer les statuts
echo "7️⃣ Test GET /api/statuts:"
curl -X GET "$BASE_URL/statuts" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "\nStatus: %{http_code}\n\n"

# Test 8: Logout
echo "8️⃣ Test POST /api/logout:"
curl -X POST "$BASE_URL/logout" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -w "\nStatus: %{http_code}\n\n"

echo ""
echo "================================"
echo "Tests Terminés"
echo "================================"
echo ""
echo "💡 Conseils:"
echo "- Si vous obtenez 401 Unauthorized, c'est normal sans authentification valide"
echo "- Si vous obtenez 404, vérifiez que les routes sont enregistrées dans routes/api.php"
echo "- Si vous obtenez une erreur CORS, vérifiez la configuration dans config/cors.php"
echo ""
