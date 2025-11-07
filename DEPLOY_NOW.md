# Deploy Backend to Fix 404 Errors

## 🔴 Current Issue
Your frontend is trying to reach these endpoints on production:
- `/api/admin/analytics/users` - **404 (not deployed yet)**
- `/api/chatbot` - **404 (not deployed yet)**
- Other routes work fine

## ✅ Solution: Deploy Backend

### Step 1: Commit Changes

Open Git Bash or PowerShell and run:

```bash
cd C:\Users\shawn\Desktop\babyfiction

# Add backend files
git add backend/src/routes/admin.js
git add backend/src/controllers/adminController.js
git add backend/src/routes/chatbot.js
git add backend/src/controllers/chatbotController.js
git add backend/src/server.js

# Add frontend files
git add frontend/src/components/CookieConsent.tsx
git add frontend/src/components/NewsletterPopup.tsx
git add frontend/src/components/Navbar.tsx

# Commit
git commit -m "Add admin analytics and chatbot endpoints"

# Push to trigger Render deployment
git push origin main
```

### Step 2: Wait for Render Deployment

1. Go to: https://dashboard.render.com
2. Select your backend service
3. Watch the deployment progress (3-5 minutes)
4. Wait until it says **"Live"**

### Step 3: Add Environment Variable

While waiting, add the chatbot API key:

1. In Render Dashboard → Your backend service
2. Click **"Environment"** tab
3. Add new variable:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: Your GitHub token (get from https://github.com/settings/tokens)
4. Click **"Save Changes"**

### Step 4: Verify It Works

After deployment completes:

1. Refresh your frontend (`http://localhost:3000`)
2. Check browser console (F12)
3. The 404 errors should be gone!
4. Admin dashboard should show analytics
5. Chatbot should work

---

## 🎯 What Gets Fixed

After deployment:
- ✅ Admin analytics will load (no more 404)
- ✅ Chatbot will work (no more 404)
- ✅ Cookie consent "Decline" button is now visible
- ✅ Newsletter popup shows BlackFriday.webp image

---

## 📝 Quick Commands

**If you're using Git Bash:**
```bash
cd /c/Users/shawn/Desktop/babyfiction
git add backend/src/routes/*.js backend/src/controllers/*.js backend/src/server.js
git add frontend/src/components/CookieConsent.tsx frontend/src/components/NewsletterPopup.tsx
git commit -m "Add admin and chatbot features"
git push origin main
```

**If you're using GitHub Desktop:**
1. Open GitHub Desktop
2. Select all changed files
3. Write commit message: "Add admin and chatbot features"
4. Click "Commit to main"
5. Click "Push origin"

---

## ⏱️ Timeline

- **Commit & Push**: 1 minute
- **Render Deployment**: 3-5 minutes
- **Total**: ~5 minutes

Then everything will work! 🎉
