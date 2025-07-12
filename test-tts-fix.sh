#!/bin/bash

# Test the T2A v2 synthesis endpoint

echo "Testing MiniMax T2A v2 API fix..."
echo "================================"

# Test the new POST endpoint
echo -e "\n1. Testing T2A v2 synthesis endpoint:"
curl -X POST http://localhost:3000/api/voice/test-minimax \
  -H "Content-Type: application/json" \
  -s | jq '.'

echo -e "\n2. Testing voice clone status endpoint (original):"
curl http://localhost:3000/api/voice/test-minimax \
  -H "Content-Type: application/json" \
  -s | jq '.'

echo -e "\nDone!"