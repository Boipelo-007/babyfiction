# Product Issues Debug Guide

## 🔍 Issues Found

### 1. **Red Hat Missing**
- The "Red Bucket Hat" was updated in seed data
- Need to re-run seed script to update database

### 2. **Buttons Not Working**
- "Shop Collection" and "New Arrivals" should go to `/catalog`
- Code is correct, might be cache issue

---

## 🛠️ Fix Steps

### Step 1: Update Products Database
```bash
cd backend
node src/scripts/seed-products.js
```

This will:
- ✅ Clear old products
- ✅ Add "Red Bucket Hat" with proper image
- ✅ Ensure all 12 products exist

### Step 2: Test API Endpoint
Visit: `https://your-backend-url.render.com/api/products`

Should return:
```json
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "name": "Classic Baseball Cap",
      "category": "hats",
      "price": 299,
      "thumbnail": "https://images.unsplash.com/..."
    },
    {
      "_id": "...",
      "name": "Red Bucket Hat",
      "category": "hats", 
      "price": 349,
      "thumbnail": "https://images.unsplash.com/..."
    }
    // ... more products
  ]
}
```

### Step 3: Check Frontend API Call
In browser console on homepage/catalog:
```javascript
// Check if API is being called
fetch('https://your-backend-url.render.com/api/products?limit=100')
  .then(r => r.json())
  .then(data => console.log('Products:', data));
```

### Step 4: Clear Cache
- **Hard refresh**: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- **Incognito mode**: Test in private browsing
- **Clear browser cache**: Settings → Clear browsing data

---

## 📊 Expected Products

### Hats (3):
1. **Classic Baseball Cap** - R299
2. **Beanie Winter Hat** - R249  
3. **Red Bucket Hat** - R349 ← This should now show!

### Shirts (3):
1. **Classic White T-Shirt** - R399
2. **Graphic Print Tee** - R449
3. **Long Sleeve Shirt** - R549

### Hoodies (3):
1. **Premium Pullover Hoodie** - R899
2. **Zip-Up Hoodie** - R949
3. **Oversized Hoodie** - R999

### Pants (3):
1. **Classic Denim Jeans** - R799
2. **Cargo Pants** - R849
3. **Jogger Pants** - R699

**Total: 12 products**

---

## 🧪 Test Checklist

- [ ] Run seed script: `node backend/src/scripts/seed-products.js`
- [ ] Check API returns 12 products
- [ ] Verify "Red Bucket Hat" exists
- [ ] Test homepage shows 3 hats in hats section
- [ ] Test catalog shows all products
- [ ] Test category filtering works
- [ ] Test "Shop Collection" button → `/catalog`
- [ ] Test "New Arrivals" button → `/catalog`

---

## 🚨 Common Issues

### API Not Loading:
- Check backend is running
- Verify CORS settings
- Check network tab for errors

### Products Not Showing:
- Database might be empty
- API endpoint might be wrong
- Frontend API URL might be incorrect

### Buttons Not Working:
- Check browser console for errors
- Verify React Router is working
- Test direct URL navigation

### Images Not Loading:
- Unsplash URLs might be blocked
- Check image URLs are valid
- Verify CORS for images

---

## 🔧 Quick Fixes

### Re-seed Database:
```bash
cd backend
node src/scripts/seed-products.js
```

### Check Environment Variables:
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://your-backend.render.com

# Backend  
MONGODB_URI=mongodb+srv://...
```

### Test API Manually:
```bash
curl https://your-backend.render.com/api/products
```

---

**After running the seed script, you should see the red hat and all products!** 🎩
