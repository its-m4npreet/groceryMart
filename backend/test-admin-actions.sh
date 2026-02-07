#!/bin/bash

# Admin Actions Test Script
# This script tests all admin action endpoints

BASE_URL="http://localhost:5000/api"
ADMIN_TOKEN="YOUR_ADMIN_TOKEN_HERE"

echo "==================================="
echo "Admin Actions API Test Suite"
echo "==================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Bulk Price Update (Increase)
echo -e "${YELLOW}Test 1: Bulk Price Update (Increase 10%)${NC}"
curl -s -X PATCH "$BASE_URL/admin/products/bulk-price" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"percentage": 10, "action": "increase"}' | jq .
echo ""

# Test 2: Bulk Stock Update (Add)
echo -e "${YELLOW}Test 2: Bulk Stock Update (Add 50 units)${NC}"
curl -s -X PATCH "$BASE_URL/admin/products/bulk-stock" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"quantity": 50, "action": "add"}' | jq .
echo ""

# Test 3: Get Analytics Dashboard
echo -e "${YELLOW}Test 3: Get Analytics Dashboard${NC}"
curl -s -X GET "$BASE_URL/admin/analytics/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# Test 4: Export Products
echo -e "${YELLOW}Test 4: Export Products to CSV${NC}"
curl -s -X GET "$BASE_URL/admin/export/products" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  --output products_export.csv
if [ -f "products_export.csv" ]; then
  echo -e "${GREEN}✓ Products exported successfully${NC}"
  wc -l products_export.csv
else
  echo -e "${RED}✗ Export failed${NC}"
fi
echo ""

# Test 5: Export Orders
echo -e "${YELLOW}Test 5: Export Orders to CSV${NC}"
curl -s -X GET "$BASE_URL/admin/export/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  --output orders_export.csv
if [ -f "orders_export.csv" ]; then
  echo -e "${GREEN}✓ Orders exported successfully${NC}"
  wc -l orders_export.csv
else
  echo -e "${RED}✗ Export failed${NC}"
fi
echo ""

# Test 6: Export Users
echo -e "${YELLOW}Test 6: Export Users to CSV${NC}"
curl -s -X GET "$BASE_URL/admin/export/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  --output users_export.csv
if [ -f "users_export.csv" ]; then
  echo -e "${GREEN}✓ Users exported successfully${NC}"
  wc -l users_export.csv
else
  echo -e "${RED}✗ Export failed${NC}"
fi
echo ""

# Test 7: Clear Cache
echo -e "${YELLOW}Test 7: Clear Cache${NC}"
curl -s -X POST "$BASE_URL/admin/system/clear-cache" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# Test 8: Database Cleanup
echo -e "${YELLOW}Test 8: Database Cleanup${NC}"
curl -s -X POST "$BASE_URL/admin/system/cleanup-db" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# Test 9: Get Low Stock Products
echo -e "${YELLOW}Test 9: Get Low Stock Products${NC}"
curl -s -X GET "$BASE_URL/admin/analytics/low-stock?threshold=20" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

# Test 10: Get Best Selling Products
echo -e "${YELLOW}Test 10: Get Best Selling Products${NC}"
curl -s -X GET "$BASE_URL/admin/analytics/best-selling?limit=5" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
echo ""

echo "==================================="
echo -e "${GREEN}Test Suite Completed${NC}"
echo "==================================="
echo ""
echo "Note: Replace YOUR_ADMIN_TOKEN_HERE with actual admin token"
echo "Install jq for better JSON formatting: sudo apt install jq"
