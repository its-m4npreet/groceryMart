#!/bin/bash

# Rider Role Testing Script
# This script demonstrates how to test the rider functionality

echo "========================================"
echo "RIDER ROLE TESTING SCRIPT"
echo "========================================"
echo ""

# Configuration
API_URL="http://localhost:5000/api"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Admin@123"
RIDER_EMAIL="rider@example.com"
RIDER_PASSWORD="Rider@123"
USER_EMAIL="user@example.com"
USER_PASSWORD="User@123"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Create a Rider User${NC}"
echo "------------------------------------"
echo "You need to create a rider user first. You can either:"
echo "1. Create via signup endpoint (requires manual role change in DB)"
echo "2. Create directly in MongoDB with role: 'rider'"
echo ""
echo "MongoDB Command:"
echo -e "${YELLOW}"
cat << 'EOF'
db.users.insertOne({
  name: "John Rider",
  email: "rider@example.com",
  password: "$2a$10$hashedPasswordHere", // Use bcrypt to hash "Rider@123"
  role: "rider",
  phone: "9876543210",
  address: {
    street: "456 Delivery Lane",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400002",
    country: "India"
  },
  notifications: {
    orderUpdates: true,
    promotions: false,
    newsletter: false,
    stockAlerts: false
  },
  createdAt: new Date()
})
EOF
echo -e "${NC}"
echo ""

echo -e "${BLUE}Step 2: Login as Admin${NC}"
echo "------------------------------------"
echo "curl -X POST $API_URL/auth/signin \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"email\": \"$ADMIN_EMAIL\","
echo "    \"password\": \"$ADMIN_PASSWORD\""
echo "  }'"
echo ""
echo "Save the token as ADMIN_TOKEN"
echo ""

echo -e "${BLUE}Step 3: Login as Rider${NC}"
echo "------------------------------------"
echo "curl -X POST $API_URL/auth/signin \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"email\": \"$RIDER_EMAIL\","
echo "    \"password\": \"$RIDER_PASSWORD\""
echo "  }'"
echo ""
echo "Save the token as RIDER_TOKEN"
echo ""

echo -e "${BLUE}Step 4: Admin Gets All Riders${NC}"
echo "------------------------------------"
echo "curl -X GET $API_URL/admin/riders \\"
echo "  -H 'Authorization: Bearer \$ADMIN_TOKEN'"
echo ""

echo -e "${BLUE}Step 5: Admin Assigns Rider to an Order${NC}"
echo "------------------------------------"
echo "curl -X PATCH $API_URL/orders/{ORDER_ID}/assign-rider \\"
echo "  -H 'Authorization: Bearer \$ADMIN_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"riderId\": \"RIDER_USER_ID\""
echo "  }'"
echo ""

echo -e "${BLUE}Step 6: Rider Views Assigned Orders${NC}"
echo "------------------------------------"
echo "curl -X GET '$API_URL/rider/orders?deliveryStatus=assigned' \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN'"
echo ""

echo -e "${BLUE}Step 7: Rider Gets Statistics${NC}"
echo "------------------------------------"
echo "curl -X GET $API_URL/rider/stats \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN'"
echo ""

echo -e "${BLUE}Step 8: Rider Views Single Order${NC}"
echo "------------------------------------"
echo "curl -X GET $API_URL/rider/orders/{ORDER_ID} \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN'"
echo ""

echo -e "${BLUE}Step 9: Rider Updates to Out for Delivery${NC}"
echo "------------------------------------"
echo "curl -X PATCH $API_URL/rider/orders/{ORDER_ID}/delivery-status \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"deliveryStatus\": \"out_for_delivery\""
echo "  }'"
echo ""

echo -e "${BLUE}Step 10: Rider Marks Order as Delivered${NC}"
echo "------------------------------------"
echo "curl -X PATCH $API_URL/rider/orders/{ORDER_ID}/delivery-status \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"deliveryStatus\": \"delivered\""
echo "  }'"
echo ""

echo -e "${GREEN}========================================"
echo "TESTING SECURITY & RESTRICTIONS"
echo "========================================${NC}"
echo ""

echo -e "${YELLOW}Test 1: Rider Cannot Access Admin Endpoints${NC}"
echo "curl -X GET $API_URL/admin/orders \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN'"
echo ""
echo -e "${RED}Expected: 403 Forbidden${NC}"
echo ""

echo -e "${YELLOW}Test 2: Rider Cannot View Non-Assigned Orders${NC}"
echo "curl -X GET $API_URL/rider/orders/{OTHER_ORDER_ID} \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN'"
echo ""
echo -e "${RED}Expected: 404 Not Found${NC}"
echo ""

echo -e "${YELLOW}Test 3: User Cannot Access Rider Endpoints${NC}"
echo "curl -X GET $API_URL/rider/orders \\"
echo "  -H 'Authorization: Bearer \$USER_TOKEN'"
echo ""
echo -e "${RED}Expected: 403 Forbidden${NC}"
echo ""

echo -e "${YELLOW}Test 4: Rider Cannot Skip Status Transition${NC}"
echo "curl -X PATCH $API_URL/rider/orders/{ORDER_ID}/delivery-status \\"
echo "  -H 'Authorization: Bearer \$RIDER_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{"
echo "    \"deliveryStatus\": \"delivered\""
echo "  }'"
echo ""
echo -e "${RED}Expected: 400 Bad Request (when current status is 'assigned')${NC}"
echo ""

echo -e "${GREEN}========================================"
echo "POSTMAN COLLECTION SETUP"
echo "========================================${NC}"
echo ""
echo "Create these requests in Postman:"
echo ""
echo "1. Folder: Rider Management"
echo "   - GET /api/rider/orders"
echo "   - GET /api/rider/orders/:id"
echo "   - PATCH /api/rider/orders/:id/delivery-status"
echo "   - GET /api/rider/stats"
echo ""
echo "2. Folder: Admin - Rider Management"
echo "   - GET /api/admin/riders"
echo "   - PATCH /api/orders/:id/assign-rider"
echo ""
echo "3. Environment Variables:"
echo "   - BASE_URL: http://localhost:5000/api"
echo "   - ADMIN_TOKEN: (from login response)"
echo "   - RIDER_TOKEN: (from login response)"
echo "   - USER_TOKEN: (from login response)"
echo ""

echo -e "${GREEN}========================================"
echo "SAMPLE NODE.JS TEST SCRIPT"
echo "========================================${NC}"
echo ""
echo "Create a file: test-rider.js"
echo ""
cat << 'EOF'
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let adminToken, riderToken, riderId, orderId;

async function testRiderFlow() {
  try {
    // 1. Admin Login
    console.log('1. Admin Login...');
    const adminLogin = await axios.post(`${API_URL}/auth/signin`, {
      email: 'admin@example.com',
      password: 'Admin@123'
    });
    adminToken = adminLogin.data.token;
    console.log('✓ Admin logged in');

    // 2. Rider Login
    console.log('\n2. Rider Login...');
    const riderLogin = await axios.post(`${API_URL}/auth/signin`, {
      email: 'rider@example.com',
      password: 'Rider@123'
    });
    riderToken = riderLogin.data.token;
    riderId = riderLogin.data.user.id;
    console.log('✓ Rider logged in');

    // 3. Get an order (admin)
    console.log('\n3. Getting an order to assign...');
    const orders = await axios.get(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    orderId = orders.data.data[0]._id;
    console.log(`✓ Found order: ${orderId}`);

    // 4. Assign rider to order (admin)
    console.log('\n4. Assigning rider to order...');
    await axios.patch(
      `${API_URL}/orders/${orderId}/assign-rider`,
      { riderId },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✓ Rider assigned');

    // 5. Rider views assigned orders
    console.log('\n5. Rider viewing assigned orders...');
    const assignedOrders = await axios.get(`${API_URL}/rider/orders`, {
      headers: { Authorization: `Bearer ${riderToken}` }
    });
    console.log(`✓ Found ${assignedOrders.data.data.length} assigned orders`);

    // 6. Rider updates to out for delivery
    console.log('\n6. Updating to out for delivery...');
    await axios.patch(
      `${API_URL}/rider/orders/${orderId}/delivery-status`,
      { deliveryStatus: 'out_for_delivery' },
      { headers: { Authorization: `Bearer ${riderToken}` } }
    );
    console.log('✓ Status updated to out_for_delivery');

    // 7. Rider marks as delivered
    console.log('\n7. Marking as delivered...');
    await axios.patch(
      `${API_URL}/rider/orders/${orderId}/delivery-status`,
      { deliveryStatus: 'delivered' },
      { headers: { Authorization: `Bearer ${riderToken}` } }
    );
    console.log('✓ Status updated to delivered');

    // 8. Rider gets stats
    console.log('\n8. Getting rider stats...');
    const stats = await axios.get(`${API_URL}/rider/stats`, {
      headers: { Authorization: `Bearer ${riderToken}` }
    });
    console.log('✓ Stats:', stats.data.data);

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRiderFlow();
EOF
echo ""
echo "Run with: node test-rider.js"
echo ""

echo -e "${GREEN}========================================"
echo "WEBSOCKET EVENTS TO LISTEN FOR"
echo "========================================${NC}"
echo ""
echo "Rider should listen for:"
echo "  - 'order-assigned' (when admin assigns order)"
echo ""
echo "Customer should listen for:"
echo "  - 'rider-assigned' (when rider is assigned)"
echo "  - 'order-status-updated' (when rider updates delivery status)"
echo ""
echo "Admin should listen for:"
echo "  - 'rider-assigned-to-order' (when order is assigned)"
echo "  - 'delivery-status-updated' (when rider updates status)"
echo ""

echo -e "${GREEN}========================================"
echo "COMPLETED!"
echo "========================================${NC}"
