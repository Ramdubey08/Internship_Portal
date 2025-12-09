#!/bin/bash

echo "======================================"
echo "��� PRODUCTION SERVER TEST SUITE"
echo "======================================"
echo ""

BASE_URL="http://localhost:8000"

# Test 1: Frontend
echo "1️⃣  Testing Frontend..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Frontend: OK (HTTP $STATUS)"
else
    echo "   ❌ Frontend: FAIL (HTTP $STATUS)"
fi

# Test 2: Admin Panel
echo "2️⃣  Testing Admin Panel..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/admin/)
if [ "$STATUS" = "302" ] || [ "$STATUS" = "200" ]; then
    echo "   ✅ Admin: OK (HTTP $STATUS)"
else
    echo "   ❌ Admin: FAIL (HTTP $STATUS)"
fi

# Test 3: API - Internships List
echo "3️⃣  Testing API - Internships..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/internships/)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Internships API: OK (HTTP $STATUS)"
else
    echo "   ❌ Internships API: FAIL (HTTP $STATUS)"
fi

# Test 4: Authentication
echo "4️⃣  Testing JWT Authentication..."
TOKEN_RESPONSE=$(curl -s -X POST $BASE_URL/api/token/ \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')
if echo "$TOKEN_RESPONSE" | grep -q "access"; then
    echo "   ✅ JWT Auth: OK (Token received)"
else
    echo "   ❌ JWT Auth: FAIL"
fi

# Test 5: Static Files
echo "5️⃣  Testing Static Files..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/static/admin/css/base.css)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ Static Files: OK (HTTP $STATUS)"
else
    echo "   ❌ Static Files: FAIL (HTTP $STATUS)"
fi

# Test 6: React Static Assets
echo "6️⃣  Testing React Assets..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/static/js/main.11b2aa1e.js)
if [ "$STATUS" = "200" ]; then
    echo "   ✅ React Assets: OK (HTTP $STATUS)"
else
    echo "   ❌ React Assets: FAIL (HTTP $STATUS)"
fi

echo ""
echo "======================================"
echo "✅ ALL TESTS COMPLETED"
echo "======================================"
echo ""
echo "Server is running at:"
echo "  ��� Frontend:  $BASE_URL"
echo "  ��� API:       $BASE_URL/api/"
echo "  ��� Admin:     $BASE_URL/admin/"
echo ""
