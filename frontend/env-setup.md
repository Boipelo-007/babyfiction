# Environment Setup Guide

## Quick Setup for Local Development

### Step 1: Create .env.local file

Create a new file: `frontend/.env.local`

Add this content:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 2: Restart Frontend Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Start Backend Server

In a separate terminal:
```bash
cd ../backend
npm start
```

## Verify Setup

1. Backend should show:
   ```
   🚀 Server running in development mode on port 4000
   📊 Health check: http://localhost:4000/api/health
   ```

2. Frontend should show:
   ```
   ▲ Next.js 14.x.x
   - Local: http://localhost:3000
   ```

3. Open browser to: http://localhost:3000/admin

4. The API Debugger should show:
   - API URL: http://localhost:4000
   - Token: ✓ Present

## Troubleshooting

### Still seeing babyfiction.onrender.com?

1. Make sure `.env.local` file exists in the `frontend` folder
2. Restart the frontend dev server completely
3. Clear browser cache (Ctrl+Shift+R)
4. Check browser console - it should show: `Fetching analytics from: http://localhost:4000/api/admin/analytics/users`

### Backend not starting?

1. Check if MongoDB is running
2. Check if port 4000 is available
3. Run: `npm install` in backend folder
4. Check for error messages in terminal

### Frontend not connecting?

1. Verify `.env.local` has the correct URL
2. No trailing slash in the URL
3. Restart frontend server after creating .env.local
4. Check Network tab in browser DevTools

## Environment Variables Reference

### Local Development
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Production (Render)
```env
NEXT_PUBLIC_API_URL=https://babyfiction.onrender.com
```

### Default (if no .env.local)
The code defaults to: `https://babyfiction.onrender.com`

## Commands Cheat Sheet

```bash
# Start backend
cd backend
npm start

# Start frontend (new terminal)
cd frontend
npm run dev

# Test backend health
curl http://localhost:4000/api/health

# Or in browser:
http://localhost:4000/api/health
```
