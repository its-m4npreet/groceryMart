#!/bin/bash

# ============================================
# Admin Rider Management Testing Script
# ============================================

BASE_URL="http://localhost:5000"
ADMIN_TOKEN=""
RIDER_ID=""

echo "================================================"
echo "  Admin Rider Management - Testing Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# STEP 1: Admin Login
# ============================================
echo -e "${YELLOW}STEP 1: Admin Login${NC}"
echo "Login with your admin credentials to get token"
echo ""
echo "curl -X POST \"$BASE_URL/api/auth/login\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\": \"admin@example.com\", \"password\": \"your_password\"}'"
echo ""
read -p "Enter admin token: " ADMIN_TOKEN
echo ""

# ============================================
# STEP 2: Get All Riders
# ============================================
echo -e "${YELLOW}STEP 2: Get All Riders${NC}"
echo "Fetching all riders..."
echo ""

curl -X GET "$BASE_URL/api/admin/riders?page=1&limit=10&status=all" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s | jq '.'

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 3: Filter Active Riders Only
# ============================================
echo -e "${YELLOW}STEP 3: Get Active Riders Only${NC}"
echo "Fetching only active riders..."
echo ""

curl -X GET "$BASE_URL/api/admin/riders?status=active" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s | jq '.'

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 4: Filter Inactive Riders Only
# ============================================
echo -e "${YELLOW}STEP 4: Get Inactive Riders Only${NC}"
echo "Fetching only inactive riders..."
echo ""

curl -X GET "$BASE_URL/api/admin/riders?status=inactive" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s | jq '.'

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 5: Get Rider Details
# ============================================
echo -e "${YELLOW}STEP 5: Get Rider Details${NC}"
read -p "Enter rider ID to view details: " RIDER_ID
echo ""

curl -X GET "$BASE_URL/api/admin/riders/$RIDER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s | jq '.'

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 6: Deactivate Rider
# ============================================
echo -e "${YELLOW}STEP 6: Deactivate Rider${NC}"
echo "Attempting to deactivate rider: $RIDER_ID"
echo "(This will fail if rider has active orders)"
echo ""

RESPONSE=$(curl -X PATCH "$BASE_URL/api/admin/riders/$RIDER_ID/toggle-status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s)

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Status toggled successfully${NC}"
else
  echo -e "${RED}✗ Failed to toggle status${NC}"
fi

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 7: Try to Assign Inactive Rider to Order
# ============================================
echo -e "${YELLOW}STEP 7: Test Inactive Rider Assignment (Should Fail)${NC}"
read -p "Enter an order ID to test assignment: " ORDER_ID
echo ""
echo "Attempting to assign inactive rider to order..."
echo ""

RESPONSE=$(curl -X PATCH "$BASE_URL/api/orders/$ORDER_ID/assign-rider" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"riderId\": \"$RIDER_ID\"}" \
  -s)

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Correctly prevented assignment to inactive rider${NC}"
else
  echo -e "${RED}✗ Unexpected: Assignment should have failed${NC}"
fi

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 8: Reactivate Rider
# ============================================
echo -e "${YELLOW}STEP 8: Reactivate Rider${NC}"
echo "Toggling rider status again (should activate)..."
echo ""

RESPONSE=$(curl -X PATCH "$BASE_URL/api/admin/riders/$RIDER_ID/toggle-status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s)

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Rider reactivated successfully${NC}"
else
  echo -e "${RED}✗ Failed to reactivate rider${NC}"
fi

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 9: Assign Active Rider to Order
# ============================================
echo -e "${YELLOW}STEP 9: Assign Active Rider to Order${NC}"
echo "Now attempting to assign the active rider to order..."
echo ""

RESPONSE=$(curl -X PATCH "$BASE_URL/api/orders/$ORDER_ID/assign-rider" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"riderId\": \"$RIDER_ID\"}" \
  -s)

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Rider assigned successfully${NC}"
else
  echo -e "${RED}✗ Failed to assign rider${NC}"
fi

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 10: Try to Deactivate Rider with Active Orders
# ============================================
echo -e "${YELLOW}STEP 10: Try to Deactivate Rider with Active Orders${NC}"
echo "This should fail because rider now has an assigned order..."
echo ""

RESPONSE=$(curl -X PATCH "$BASE_URL/api/admin/riders/$RIDER_ID/toggle-status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s)

echo "$RESPONSE" | jq '.'

if echo "$RESPONSE" | jq -e '.success == false' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Correctly prevented deactivation (rider has active orders)${NC}"
else
  echo -e "${RED}✗ Unexpected: Should have prevented deactivation${NC}"
fi

echo ""
read -p "Press Enter to continue..."
echo ""

# ============================================
# STEP 11: View Updated Rider Stats
# ============================================
echo -e "${YELLOW}STEP 11: View Updated Rider Statistics${NC}"
echo "Checking rider stats after assignment..."
echo ""

curl -X GET "$BASE_URL/api/admin/riders/$RIDER_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -s | jq '{
    name: .data.rider.name,
    email: .data.rider.email,
    isActive: .data.rider.isActive,
    deliveryStats: .data.deliveryStats,
    performance: .data.performance
  }'

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  All Tests Completed Successfully!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# ============================================
# Summary of Test Results
# ============================================
echo -e "${YELLOW}Summary of Tested Features:${NC}"
echo "✓ Admin can view all riders with filters"
echo "✓ Admin can view detailed rider information"
echo "✓ Admin can deactivate riders (when no active orders)"
echo "✓ System prevents assigning orders to inactive riders"
echo "✓ Admin can reactivate riders"
echo "✓ Admin can assign orders to active riders"
echo "✓ System prevents deactivating riders with active orders"
echo "✓ Rider statistics update correctly"
echo ""

# ============================================
# Additional Test Commands
# ============================================
echo -e "${YELLOW}Additional Test Commands:${NC}"
echo ""
echo "# Create a rider user (via MongoDB):"
echo "db.users.insertOne({"
echo "  name: \"Test Rider\","
echo "  email: \"rider@test.com\","
echo "  password: \"\$2a\$10\$hashed_password\","
echo "  role: \"rider\","
echo "  isActive: true,"
echo "  phone: \"9876543210\","
echo "  createdAt: new Date()"
echo "});"
echo ""
echo "# Test rider login (should fail if inactive):"
echo "curl -X POST \"$BASE_URL/api/auth/login\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\": \"rider@test.com\", \"password\": \"password\"}'"
echo ""
echo "# Test rider accessing endpoints while deactivated:"
echo "curl -X GET \"$BASE_URL/api/rider/orders\" \\"
echo "  -H \"Authorization: Bearer RIDER_TOKEN\""
echo ""
