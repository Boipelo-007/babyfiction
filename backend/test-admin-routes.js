// Quick test script to verify admin routes are working
import fetch from 'node-fetch';

const API_URL = 'http://localhost:4000';

async function testRoutes() {
  console.log('🧪 Testing Backend Routes...\n');

  // Test 1: Health check
  console.log('1. Testing health endpoint...');
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('⚠️  Make sure the backend server is running on port 4000');
    return;
  }

  // Test 2: Admin analytics (without auth - should fail with 401)
  console.log('\n2. Testing admin analytics endpoint (without auth)...');
  try {
    const response = await fetch(`${API_URL}/api/admin/analytics/users`);
    const data = await response.json();
    if (response.status === 401) {
      console.log('✅ Route exists (401 Unauthorized - expected without token)');
    } else if (response.status === 404) {
      console.log('❌ Route not found (404) - admin routes not registered');
    } else {
      console.log('📊 Response:', response.status, data);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  // Test 3: Check if route is registered
  console.log('\n3. Testing if /api/admin path exists...');
  try {
    const response = await fetch(`${API_URL}/api/admin/users`);
    if (response.status === 401) {
      console.log('✅ Admin routes are registered correctly');
    } else if (response.status === 404) {
      console.log('❌ Admin routes NOT registered - check server.js');
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n📝 Summary:');
  console.log('- If you see 401 errors: Routes are working, you need a valid admin token');
  console.log('- If you see 404 errors: Routes are not registered, restart the backend server');
  console.log('- Make sure you imported and mounted adminRoutes in server.js');
}

testRoutes();
