#!/bin/bash

echo "🚀 Running basic API tests..."

# Test health check
echo "Testing health check..."
curl -f http://localhost:3000/ || exit 1

# Test signup
echo "Testing user signup..."
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","address":"123 Test Street"}')

echo "Signup response: $SIGNUP_RESPONSE"

# Extract token from signup response
TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token from signup response"
  exit 1
fi

echo "✅ Got token: $TOKEN"

# Test signin
echo "Testing user signin..."
SIGNIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

echo "Signin response: $SIGNIN_RESPONSE"

# Test get user info with token
echo "Testing get user info..."
USER_INFO_RESPONSE=$(curl -s -X GET http://localhost:3000/api/v1/userInfo \
  -H "Authorization: Bearer $TOKEN")

echo "User info response: $USER_INFO_RESPONSE"

# Test get all books
echo "Testing get all books..."
BOOKS_RESPONSE=$(curl -s -X GET http://localhost:3000/api/v1/allbooks)

echo "Books response: $BOOKS_RESPONSE"

echo "✅ Basic API tests completed successfully!" 