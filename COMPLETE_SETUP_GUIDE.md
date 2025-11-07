# Complete Setup Guide - Baby Fiction Streetwear Store

## ✅ What's Been Implemented

### 1. Mega Menu Navigation
- **Hover dropdowns** on desktop navigation
- Categories: NEW & BEST, TOP PICKS, PROMOS
- Subcategories automatically show when hovering
- Mobile-friendly accordion menu

### 2. Streetwear Products (17 items)
- **T-Shirts** (5): Graphic tees, Piano People collection, vintage wash
- **Hoodies** (3): Rocking The Daisies, oversized pullovers
- **Accessories** (3): Sunglasses, bucket hats, dad caps
- **Bags** (2): Canvas totes, crossbody bags
- **Pants** (2): Cargo pants, wide leg jeans
- **Jackets** (2): Denim jacket, windbreaker
- **Special Collections**: Piano People, Rocking The Daisies, Last of the Large

### 3. Features Already Working
- ✅ Newsletter popup (Black Friday style)
- ✅ Chatbot widget ("Need help?" button)
- ✅ Cookie consent
- ✅ Admin dashboard (needs backend deployment)
- ✅ User management page

---

## 🚀 Setup Instructions

### Step 1: Add Products to Database

Run this command to add all streetwear products:

```bash
cd c:\Users\shawn\Desktop\babyfiction\backend
node src/scripts/seedStreetwearProducts.js
```

Expected output:
```
🌱 Connecting to database...
🗑️  Clearing existing products...
📦 Adding streetwear products...
✅ Successfully added 17 products!
```

### Step 2: Deploy Backend to Render

Your backend on Render needs the new admin routes. Commit and push:

```bash
cd c:\Users\shawn\Desktop\babyfiction

# Add all changes
git add .

# Commit
git commit -m "Add mega menu, streetwear products, chatbot, and admin features"

# Push to trigger Render deployment
git push origin main
```

### Step 3: Wait for Render Deployment

1. Go to https://dashboard.render.com
2. Select your backend service
3. Watch the deployment progress (2-5 minutes)
4. Once it says "Live", the admin analytics will work

### Step 4: Add Environment Variables to Render

Add these to your Render backend environment:

1. **GITHUB_TOKEN** - For chatbot AI (get from https://github.com/settings/tokens)
2. Verify all other variables from your local `.env` are in Render

---

## 📋 Testing Checklist

### Test Mega Menu
- [ ] Hover over "NEW & BEST" - dropdown should appear
- [ ] Hover over "TOP PICKS" - dropdown should appear
- [ ] Click any submenu item - should navigate to filtered catalog
- [ ] Test on mobile - accordion menu should work

### Test Products
- [ ] Go to `/catalog` - should see 17 products
- [ ] Filter by category - should work
- [ ] Search for products - should work
- [ ] Click product - should show details
- [ ] Products should appear in admin dashboard

### Test Newsletter Popup
- [ ] Open site in incognito mode
- [ ] Wait 5 seconds - popup should appear
- [ ] Test "SIGN UP" button
- [ ] Test "NO, THANKS" button
- [ ] Close with X button

### Test Chatbot
- [ ] Look for "Need help?" button in bottom right
- [ ] Hover - text should expand
- [ ] Click to open chat window
- [ ] Send a message - should get AI response
- [ ] Test conversation flow

### Test Admin Dashboard
- [ ] Log in as admin
- [ ] Go to `/admin`
- [ ] Should see user analytics (after backend deployment)
- [ ] Click "Manage Users" - should show user list
- [ ] Test activate/deactivate users

---

## 🎨 Product Categories in Navbar

### NEW & BEST
- All New Arrivals
- Spring | Summer
- Piano People
- New T-Shirts
- Best Sellers

### TOP PICKS
- T-Shirts
- Sunglasses
- Hats
- Bags
- All Products

### PROMOS
- Rocking The Daisies
- Piano People
- Last of the Large

---

## 🛍️ Products Added

### T-Shirts (R420 - R550)
1. Oversized Graphic Tee - Black
2. Piano People Signature Tee
3. Vintage Wash Oversized Tee
4. Last of the Large - Oversized Tee

### Hoodies (R750 - R880)
1. Rocking The Daisies Hoodie
2. Oversized Pullover Hoodie
3. Last of the Large - Graphic Hoodie

### Accessories (R280 - R350)
1. Retro Sunglasses
2. Streetwear Bucket Hat
3. Embroidered Dad Cap

### Bags (R380 - R450)
1. Canvas Tote Bag
2. Mini Crossbody Bag

### Pants (R680 - R750)
1. Cargo Pants - Black
2. Wide Leg Jeans

### Jackets (R850 - R950)
1. Denim Jacket - Oversized
2. Windbreaker Jacket

---

## 🔧 Troubleshooting

### Mega menu not showing?
- Clear browser cache
- Check that `activeDropdown` state is working
- Verify `ChevronDown` icon is imported

### Products not appearing?
- Run the seed script: `node src/scripts/seedStreetwearProducts.js`
- Check MongoDB connection
- Verify products in database: `db.products.find()`

### Admin analytics still showing 404?
- Backend must be deployed to Render
- Check Render deployment logs
- Verify admin routes are registered in `server.js`

### Chatbot not responding?
- Add GITHUB_TOKEN to Render environment
- Install packages: `npm install @azure-rest/ai-inference @azure/core-auth`
- Check backend logs for errors

---

## 📦 Package Installation

If you haven't installed the chatbot packages:

```bash
cd backend
npm install @azure-rest/ai-inference @azure/core-auth
```

---

## 🎯 Next Steps

1. ✅ Run product seeder script
2. ✅ Deploy backend to Render
3. ✅ Add GITHUB_TOKEN to Render
4. ✅ Test all features
5. 📸 Add product images to `/public/images/products/`
6. 🎨 Customize chatbot responses
7. 📧 Set up email service for newsletter

---

## 📞 Support

If something isn't working:
1. Check browser console for errors (F12)
2. Check Render backend logs
3. Verify all environment variables are set
4. Make sure MongoDB is connected
5. Ensure all npm packages are installed

All features are ready to go! Just follow the setup steps above.
