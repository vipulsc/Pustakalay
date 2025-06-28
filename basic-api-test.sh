#!/bin/bash

echo "🚀 Starting Basic API Tests..."

# Wait for application to be ready
echo "⏳ Waiting for application to start..."
sleep 10

# Test health endpoint
echo "📋 Testing health endpoint..."
curl -f http://localhost:3000/ && echo "✅ Health check passed" || echo "❌ Health check failed"

# Test books endpoint
echo "📚 Testing books endpoint..."
curl -f http://localhost:3000/api/v1/allbooks && echo "✅ Books API passed" || echo "❌ Books API failed"

# Test signup endpoint
echo "👤 Testing signup endpoint..."
curl -X POST http://localhost:3000/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","address":"123 Test Street"}' \
  && echo "✅ Signup test passed" || echo "❌ Signup test failed"

# Test signin endpoint
echo "🔐 Testing signin endpoint..."
curl -X POST http://localhost:3000/api/v1/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  && echo "✅ Signin test passed" || echo "❌ Signin test failed"

echo "🎉 Basic API tests completed!" 