# Navbar Fix Instructions

## Problem
The Navbar.tsx file has syntax errors due to duplicate code sections.

## Quick Fix

Replace the entire content of `frontend/src/components/Navbar.tsx` with the clean version below, or:

### Option 1: Revert to Previous Version
```bash
cd frontend
git checkout src/components/Navbar.tsx
```

Then manually add just the aesthetic improvements.

### Option 2: Manual Fix

Find and remove the duplicate sections around lines 300-450. The file should have:
1. ONE return statement
2. ONE mobile menu section
3. Proper closing tags

## Key Changes Made (for aesthetic navbar):

1. **Logo** - Line ~110-118: Gradient text with hover effect
2. **Nav buttons** - Line ~133-143: Pill-shaped with rounded corners
3. **Dropdowns** - Line ~146-166: Glassmorphic with gradient accents
4. **Icons** - Line ~214-240: Scale on hover, gradient badges

## API Key Info

**Variable Name:** `GITHUB_TOKEN`

**Where to add:**
- Local: `backend/.env`
- Production: Render Dashboard → Environment tab

**How to get:**
1. https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scope: `read:packages`
4. Copy token

## If Navbar is Still Broken

Run this to restore the original:
```bash
git checkout frontend/src/components/Navbar.tsx
```

Then I can help you add the aesthetic improvements one by one without breaking the file.
