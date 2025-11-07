# Troubleshooting Guide

## Issue: "Not found - /api/admin/analytics/users"

This error occurs when the frontend cannot reach the backend API. Follow these steps to resolve:

### Step 1: Start the Backend Server

Open a terminal and run:
```bash
cd c:\Users\shawn\Desktop\babyfiction\backend
npm start
```

Expected output:
```
🚀 Server running in development mode on port 4000
📊 Health check: http://localhost:4000/api/health
MongoDB connected successfully
```

### Step 2: Verify Backend is Running

Open your browser and visit:
```
http://localhost:4000/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-11-06T...",
  "environment": "development"
}
```

### Step 3: Check Frontend Environment Variables

Create or update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 4: Start the Frontend

In a new terminal:
```bash
cd c:\Users\shawn\Desktop\babyfiction\frontend
npm run dev
```

### Step 5: Test the API

1. Log in to your admin account
2. Go to the Admin Dashboard
3. You should see an "API Debugger" section (only in development mode)
4. Click the test buttons to verify each endpoint

### Step 6: Check Authentication

Make sure you're logged in as an admin user. The token should be stored in localStorage as `bf_token`.

To check in browser console:
```javascript
localStorage.getItem('bf_token')
```

## Common Issues

### Issue: MongoDB Connection Error
**Solution:** Make sure MongoDB is running or check your `MONGO_URI` in backend `.env`

### Issue: CORS Error
**Solution:** The backend is configured to accept requests from:
- http://localhost:3000
- https://babyfiction.vercel.app
- *.netlify.app domains

### Issue: 401 Unauthorized
**Solution:** 
1. Make sure you're logged in
2. Check that the token exists: `localStorage.getItem('bf_token')`
3. Verify your user role is 'admin'

### Issue: 403 Forbidden
**Solution:** Your user account doesn't have admin privileges. Check the database:
```javascript
// In MongoDB
db.users.findOne({ email: "your-email@example.com" })
// Make sure role is "admin"
```

## API Endpoints Reference

### Admin Analytics
```
GET /api/admin/analytics/users
Authorization: Bearer <token>
```

Returns:
```json
{
  "totalUsers": 100,
  "newUsersLast7Days": 5,
  "activeUsers": 45,
  "usersByPlan": {
    "free": 80,
    "premium": 15,
    "enterprise": 5
  }
}
```

### Admin Users List
```
GET /api/admin/users?page=1&limit=10
Authorization: Bearer <token>
```

### Update User Status
```
PATCH /api/admin/users/:userId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": true
}
```

## Development Checklist

- [ ] Backend server is running on port 4000
- [ ] Frontend server is running on port 3000
- [ ] MongoDB is connected
- [ ] Logged in as admin user
- [ ] Token exists in localStorage
- [ ] Environment variables are set correctly
- [ ] No CORS errors in browser console

## Need More Help?

1. Check browser console for errors (F12)
2. Check backend terminal for error logs
3. Use the API Debugger component in the admin dashboard
4. Verify all environment variables are set
5. Make sure all npm packages are installed (`npm install`)
