# CORS Fix Instructions

## Problem
The frontend at `https://words-adventure.netlify.app` is getting CORS errors when trying to access the backend at `https://web-production-e17b.up.railway.app/api`.

## Root Cause
The Railway backend's CORS configuration only allows the Netlify domain, but it needs to be properly configured to handle all the required CORS headers.

## Solution Applied (Frontend)
✅ **COMPLETED**: Updated frontend environment variable to use correct Railway URL:
- `VITE_API_BASE_URL=https://web-production-e17b.up.railway.app/api`

## Solution Required (Backend - Needs Railway Deployment)
The backend CORS configuration has been updated in the code, but needs to be deployed to Railway.

### Updated Backend File: `word-adventure-backend/src/main.py`
The CORS configuration has been updated to:
```python
# ✅ Allow Netlify frontend and localhost for development
CORS(app, origins=[
    "https://words-adventure.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000"
], supports_credentials=True)
```

### How to Deploy the Fix
1. **Push the updated backend code to your Railway deployment:**
   - The file `word-adventure-backend/src/main.py` contains the updated CORS configuration
   - Deploy this to Railway to apply the changes

2. **Alternative Quick Fix (if you have Railway access):**
   Add these environment variables in Railway dashboard:
   ```
   CORS_ORIGINS=https://words-adventure.netlify.app,http://localhost:5173,http://localhost:3000
   ```
   
   Then modify the backend to read from environment:
   ```python
   import os
   cors_origins = os.getenv('CORS_ORIGINS', 'https://words-adventure.netlify.app').split(',')
   CORS(app, origins=cors_origins, supports_credentials=True)
   ```

## Testing the Fix
Once deployed, test the connection by:

1. **Visit the API test page:**
   - Navigate to `/api-test` in your application
   - Check if all endpoints return ✅ status

2. **Check browser console:**
   - No more CORS errors should appear
   - API calls should succeed

3. **Test functionality:**
   - Login should work
   - Words should load from API
   - Categories should load from API

## Status
- ✅ Frontend configuration updated
- ⏳ Backend deployment required to apply CORS fix
- 🧪 Ready for testing after backend deployment

## Database Info
- Backend URL: `https://web-production-e17b.up.railway.app/`
- Database URL: `postgresql://postgres:pYlQWCtOwwWEcZXzOsjJTuyjEmYiPwbL@postgres.railway.internal:5432/railway`
- Health endpoint: `https://web-production-e17b.up.railway.app/api/health`

## Files Modified
1. `word-adventure-backend/src/main.py` - CORS configuration updated
2. Frontend environment variable set via DevServerControl
3. Added `ApiConnectionTest.jsx` component for debugging
