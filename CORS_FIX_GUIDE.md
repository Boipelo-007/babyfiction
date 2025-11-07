# CORS Error Fix Guide

## 🔴 Problem
Your frontend (`localhost:3000`) is trying to connect to production backend (`babyfiction.onrender.com`) and getting CORS errors.

## ✅ Solution: Two Options

### Option 1: Use Local Backend (RECOMMENDED for Development)

I've already created `.env.local` for you with:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Now you need to:**

1. **Start your local backend:**
   ```bash
   cd c:\Users\shawn\Desktop\babyfiction\backend
   npm start
   ```

2. **Restart your frontend:**
   ```bash
   # Stop the frontend (Ctrl+C)
   # Then start it again
   cd c:\Users\shawn\Desktop\babyfiction\frontend
   npm run dev
   ```

3. **Verify it's working:**
   - Open browser console (F12)
   - You should see requests going to `localhost:4000` instead of `babyfiction.onrender.com`
   - No more CORS errors!

---

### Option 2: Fix Production CORS (If You Want to Use Production Backend)

The backend CORS is already configured to allow `localhost:3000`, but you need to make sure:

1. **Backend is deployed with latest code:**
   ```bash
   cd c:\Users\shawn\Desktop\babyfiction
   git add backend/src/server.js
   git commit -m "Update CORS configuration"
   git push origin main
   ```

2. **Wait for Render to redeploy** (2-5 minutes)

3. **Check Render logs** to verify CORS is working

---

## 🎯 Recommended Setup

### For Development (Local)
```
Frontend: http://localhost:3000
Backend: http://localhost:4000
```

**Benefits:**
- ✅ No CORS issues
- ✅ Faster development
- ✅ Can test backend changes immediately
- ✅ No need to deploy for every change

### For Production
```
Frontend: https://your-frontend.vercel.app
Backend: https://babyfiction.onrender.com
```

---

## 📋 Step-by-Step: Local Development Setup

### 1. Backend Setup

**Check if you have `.env` file:**
```bash
cd backend
ls .env
```

**If `.env` doesn't exist or is empty, create it:**
```env
# Minimum required variables
MONGO_URI=mongodb://localhost:27017/babyfiction
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-here-change-in-production
JWT_REFRESH_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

**Start backend:**
```bash
npm start
```

**You should see:**
```
🚀 Server running in development mode on port 4000
📊 Health check: http://localhost:4000/api/health
✅ MongoDB connected successfully
```

### 2. Frontend Setup

**The `.env.local` file is already created with:**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Restart frontend:**
```bash
cd frontend
npm run dev
```

### 3. Verify It's Working

Open browser console (F12) and check:
- ✅ No CORS errors
- ✅ Requests go to `localhost:4000`
- ✅ Navbar cart/wishlist counts load
- ✅ Products load on homepage

---

## 🐛 Troubleshooting

### Backend won't start?
**Error: MongoDB connection failed**
- Install MongoDB locally, OR
- Use MongoDB Atlas (cloud)
- Update `MONGO_URI` in `.env`

**Error: Port 4000 already in use**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### Frontend still hitting production?
1. Delete `.next` folder:
   ```bash
   cd frontend
   rm -rf .next
   ```
2. Restart dev server:
   ```bash
   npm run dev
   ```

### Chatbot 404 error?
The chatbot tries to hit `/api/chatbot` which needs to be proxied. Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
```

---

## 🚀 Production Deployment

When you're ready to deploy:

### 1. Deploy Backend to Render
```bash
git add .
git commit -m "Add all features"
git push origin main
```

### 2. Deploy Frontend to Vercel/Netlify
- Remove `.env.local` (it's gitignored)
- Set environment variable:
  - `NEXT_PUBLIC_API_URL=https://babyfiction.onrender.com`

### 3. Update Backend CORS
Make sure your frontend URL is in the allowed origins in `backend/src/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend.vercel.app',  // Add your frontend URL
  'https://babyfiction.vercel.app',
  'https://babyfictions.netlify.app'
];
```

---

## ✅ Summary

**Current Status:**
- ✅ `.env.local` created with `NEXT_PUBLIC_API_URL=http://localhost:4000`
- ✅ Backend CORS configured to allow `localhost:3000`

**Next Steps:**
1. Start local backend: `cd backend && npm start`
2. Restart frontend: Stop (Ctrl+C) and `npm run dev`
3. Check browser console - no more CORS errors!

**For Production:**
- Deploy backend to Render
- Set `NEXT_PUBLIC_API_URL` in frontend deployment
- Verify CORS allows your frontend URL
