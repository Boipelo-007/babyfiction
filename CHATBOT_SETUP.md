# Chatbot Setup Guide

## What I've Implemented

### ✅ Newsletter Popup
- **Design**: Matches your Black Friday image with split layout
- **Features**:
  - Left side: Promotional image (or gradient fallback)
  - Right side: Subscription form
  - "SIGN UP" button
  - "NO, THANKS" button
  - Shows after 5 seconds on first visit
  - Only appears once per session

### ✅ Chatbot Widget
- **Location**: Bottom right corner
- **Features**:
  - Floating button with "Need help?" text on hover
  - Full chat interface when opened
  - Real-time messaging
  - Powered by GitHub Models (GPT-4)
  - Custom trained for Baby Fiction store

## Setup Required

### 1. Get GitHub Token for AI Models

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Baby Fiction Chatbot"
4. Select scopes: `read:packages` (for GitHub Models)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### 2. Add to Backend .env

Add this line to your `backend/.env` file:

```env
GITHUB_TOKEN=your_github_token_here
```

### 3. Install Required Packages

```bash
cd backend
npm install @azure-rest/ai-inference @azure/core-auth
```

### 4. Deploy Backend Changes

```bash
cd c:\Users\shawn\Desktop\babyfiction

# Add new files
git add backend/src/routes/chatbot.js
git add backend/src/controllers/chatbotController.js
git add backend/src/server.js
git add frontend/src/components/ChatbotWidget.tsx
git add frontend/src/components/NewsletterPopup.tsx
git add frontend/src/app/layout.tsx

# Commit
git commit -m "Add chatbot widget and update newsletter popup"

# Push to deploy
git push origin main
```

### 5. Add Environment Variable to Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add new environment variable:
   - Key: `GITHUB_TOKEN`
   - Value: (paste your GitHub token)
5. Save changes (this will trigger a redeploy)

## How It Works

### Newsletter Popup
- Appears 5 seconds after page load
- Only shows once per browser session
- Sends email to `/api/newsletter/subscribe`
- Styled to match your Black Friday theme

### Chatbot
- Click "Need help?" button in bottom right
- Opens chat window
- AI assistant trained on:
  - Product information
  - Shipping & returns policy
  - Order tracking
  - General customer service

### AI Model
- **Provider**: GitHub Models (Azure AI)
- **Model**: GPT-4o
- **Endpoint**: https://models.inference.ai.azure.com
- **Cost**: Free tier available

## Customization

### Change Chatbot Behavior

Edit `backend/src/controllers/chatbotController.js`:

```javascript
const systemMessage = {
  role: "system",
  content: `Your custom instructions here...`
};
```

### Change Newsletter Timing

Edit `frontend/src/components/NewsletterPopup.tsx`:

```javascript
setTimeout(() => {
  setIsOpen(true);
}, 5000); // Change 5000 to desired milliseconds
```

### Add Newsletter Image

Place your image at: `frontend/public/images/newsletter-promo.jpg`

Or update the image path in `NewsletterPopup.tsx`:

```jsx
<img src="/images/your-image.jpg" alt="Subscribe" />
```

## Testing

### Test Newsletter Popup
1. Open your site in incognito mode
2. Wait 5 seconds
3. Popup should appear
4. Test "SIGN UP" and "NO, THANKS" buttons

### Test Chatbot
1. Look for "Need help?" button in bottom right
2. Click to open chat
3. Type a message like "What are your shipping options?"
4. AI should respond with relevant information

## Troubleshooting

### Chatbot not responding?
- Check GITHUB_TOKEN is set in backend .env
- Check backend logs for errors
- Verify packages are installed: `@azure-rest/ai-inference` and `@azure/core-auth`

### Newsletter not appearing?
- Clear browser session storage
- Check browser console for errors
- Verify the component is imported in layout.tsx

### Image not loading in newsletter?
- Add image to `frontend/public/images/` folder
- Or it will show a gradient fallback

## Next Steps

1. ✅ Set up GITHUB_TOKEN
2. ✅ Install npm packages
3. ✅ Deploy to Render
4. ✅ Test both features
5. 📸 Add newsletter promotional image
6. 🎨 Customize chatbot responses for your store

## Support

If you need help:
- Check backend logs in Render dashboard
- Check browser console for frontend errors
- Verify all environment variables are set
