# Create .env.local File

## Quick Fix - Manual Creation

1. **Open your file explorer**
2. **Navigate to:** `C:\Users\shawn\Desktop\babyfiction\frontend`
3. **Create a new file** named `.env.local` (include the dot at the start)
4. **Open it with Notepad** and paste this single line:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```
5. **Save and close**

## OR Use Command Line

Open PowerShell in the frontend folder and run:

```powershell
"NEXT_PUBLIC_API_URL=http://localhost:4000" | Out-File -FilePath .env.local -Encoding utf8
```

## Then Restart Frontend

After creating the file:

1. **Stop the frontend** (Ctrl+C in terminal)
2. **Delete .next folder:**
   ```bash
   rm -r -fo .next
   ```
3. **Start frontend again:**
   ```bash
   npm run dev
   ```

## Verify It Works

1. Open browser console (F12)
2. Check Network tab
3. Requests should go to `localhost:4000` instead of `babyfiction.onrender.com`

---

## Alternative: Just Use Production Backend

If you don't want to run local backend, you can keep using production. But you need to:

1. **Deploy the latest backend code to Render** (with admin routes)
2. **Wait for deployment** to complete
3. **Refresh your frontend**

The CORS errors will go away once the backend is deployed with the updated CORS config.
