# Deployment Steps for Backend Changes

## New Files Added:
1. `backend/src/routes/admin.js` - Admin routes
2. `backend/src/controllers/adminController.js` - Admin controller with user analytics

## To Deploy to Render:

### Step 1: Commit Changes
```bash
cd c:\Users\shawn\Desktop\babyfiction
git add backend/src/routes/admin.js
git add backend/src/controllers/adminController.js
git add backend/src/server.js
git commit -m "Add admin analytics and user management endpoints"
```

### Step 2: Push to GitHub
```bash
git push origin main
```

### Step 3: Render Auto-Deploy
- Render will automatically detect the changes and redeploy
- Wait for the deployment to complete (usually 2-5 minutes)
- Check the Render dashboard for deployment status

### Step 4: Verify Deployment
Test the endpoint:
```
https://babyfiction.onrender.com/api/health
```

Then test admin endpoint (should return 401):
```
https://babyfiction.onrender.com/api/admin/analytics/users
```

## Quick Local Development Setup

For faster development, use local backend:

1. Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

2. Start backend:
```bash
cd backend
npm start
```

3. Start frontend:
```bash
cd frontend
npm run dev
```

4. Access at: http://localhost:3000

## Switching Between Local and Production

### Use Local Backend:
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Use Production Backend:
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=https://babyfiction.onrender.com
```

Or delete `.env.local` to use the default (production).
