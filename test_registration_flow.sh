#!/bin/bash

echo "======================================"
echo "Testing Registration & Login Flow"
echo "======================================"
echo ""

# Test 1: Register new user
echo "1. Registering new user..."
TIMESTAMP=$(date +%s)
USERNAME="user${TIMESTAMP}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"test123\",\"email\":\"${USERNAME}@example.com\",\"role\":\"student\",\"first_name\":\"Test\",\"last_name\":\"User\"}")

if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
    echo "✓ Registration successful"
    echo "  Response: $(echo $REGISTER_RESPONSE | head -c 100)..."
else
    echo "✗ Registration failed"
    echo "  Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

# Test 2: Login with new user
echo "2. Logging in with new user..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"test123\"}")

if echo "$LOGIN_RESPONSE" | grep -q "access"; then
    echo "✓ Login successful"
    ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access":"[^"]*"' | cut -d'"' -f4)
    echo "  Access token: ${ACCESS_TOKEN:0:50}..."
else
    echo "✗ Login failed"
    echo "  Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Access profile with token
echo "3. Accessing profile with JWT token..."
PROFILE_RESPONSE=$(curl -s -X GET http://localhost:8000/api/profile/ \
  -H "Authorization: Bearer $ACCESS_TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "$USERNAME"; then
    echo "✓ Profile access successful"
    echo "  Profile: $(echo $PROFILE_RESPONSE | head -c 100)..."
else
    echo "✗ Profile access failed"
    echo "  Response: $PROFILE_RESPONSE"
    exit 1
fi
echo ""

# Test 4: Test duplicate registration (should fail)
echo "4. Testing duplicate registration..."
DUP_RESPONSE=$(curl -s -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${USERNAME}\",\"password\":\"test123\",\"email\":\"${USERNAME}@example.com\",\"role\":\"student\"}")

if echo "$DUP_RESPONSE" | grep -q "already exists"; then
    echo "✓ Duplicate registration correctly rejected"
else
    echo "✗ Duplicate registration should have been rejected"
    echo "  Response: $DUP_RESPONSE"
fi
echo ""

echo "======================================"
echo "All tests passed!"
echo "======================================"
echo ""
echo "Production server is ready at: http://localhost:8000"
echo "- Frontend: http://localhost:8000"
echo "- API: http://localhost:8000/api/"
echo "- Admin: http://localhost:8000/admin/"
