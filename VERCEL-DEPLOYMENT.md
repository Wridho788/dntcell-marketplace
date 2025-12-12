# 🚀 Vercel Deployment Guide - DNTCell Marketplace

## ⚠️ CRITICAL: Environment Variables Required

Your deployment is currently failing because environment variables are not set. Follow these steps:

---

## 1️⃣ Set Environment Variables in Vercel

Go to: **https://vercel.com/your-project/settings/environment-variables**

### ✅ REQUIRED Variables (App won't work without these):

```bash
# Supabase (Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# REST API Backend
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### ⭕ OPTIONAL Variables (For additional features):

```bash
# OneSignal Push Notifications
NEXT_PUBLIC_ONESIGNAL_APP_ID=your-app-id
ONESIGNAL_API_KEY=your-rest-api-key
```

---

## 2️⃣ How to Add Variables in Vercel

1. **Login to Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Navigate to Your Project**
   - Click on `dntcell-marketplace`
   - Go to **Settings** tab
   - Click **Environment Variables** in sidebar

3. **Add Each Variable**
   - Click **Add New** button
   - Enter variable name (e.g., `NEXT_PUBLIC_API_URL`)
   - Enter value (e.g., `https://api.example.com/api`)
   - Select environment:
     - ✅ **Production**
     - ✅ **Preview** (optional)
     - ✅ **Development** (optional)
   - Click **Save**

4. **Repeat for All Variables**

---

## 3️⃣ Get Your API Keys

### Supabase:
1. Go to: https://app.supabase.com/project/_/settings/api
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### OneSignal (Optional):
1. Go to: https://dashboard.onesignal.com/apps
2. Select your app
3. Go to **Settings** → **Keys & IDs**
4. Copy **App ID** → `NEXT_PUBLIC_ONESIGNAL_APP_ID`
5. Copy **REST API Key** → `ONESIGNAL_API_KEY`

### Backend API:
- If you don't have a backend yet, you need to create one first
- Example: `https://api.dntcell.com/api` or `https://your-backend.railway.app/api`

---

## 4️⃣ Redeploy After Adding Variables

After adding all environment variables:

1. **Option A: Trigger Redeploy**
   - Go to **Deployments** tab
   - Click **⋮** (three dots) on latest deployment
   - Click **Redeploy**

2. **Option B: Push New Commit**
   ```bash
   git commit --allow-empty -m "trigger redeploy"
   git push
   ```

---

## 5️⃣ Verify Deployment

1. **Check Build Logs**
   - Open your deployment in Vercel
   - Check build logs for errors
   - Look for "Build succeeded" message

2. **Check Runtime Logs**
   - Go to **Logs** tab in Vercel
   - Monitor for errors
   - Check if API calls are working

3. **Test the App**
   - Open: https://dntcell-marketplace.vercel.app
   - Check browser console (F12)
   - Verify no "localhost" errors
   - Test main features

---

## 🐛 Current Errors You're Seeing

### Error 1: API Connection Refused
```
GET http://localhost:3001/api/categories net::ERR_CONNECTION_REFUSED
```
**Cause:** `NEXT_PUBLIC_API_URL` not set in Vercel
**Fix:** Add the variable with your production API URL

### Error 2: OneSignal Init Failed
```
Error initializing OneSignal: Cannot read properties of undefined (reading 'init')
```
**Cause:** `NEXT_PUBLIC_ONESIGNAL_APP_ID` not set or OneSignal SDK failed to load
**Fix:** Add the variable OR remove OneSignal from layout if not using it yet

---

## 📋 Quick Checklist

- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- [ ] Added `NEXT_PUBLIC_API_URL` in Vercel (or created backend API first)
- [ ] (Optional) Added `NEXT_PUBLIC_ONESIGNAL_APP_ID` in Vercel
- [ ] (Optional) Added `ONESIGNAL_API_KEY` in Vercel
- [ ] Redeployed the application
- [ ] Checked logs for errors
- [ ] Tested the deployed app

---

## 🆘 Need Help?

**If you don't have a backend API yet:**
- You need to create the REST API backend first
- Deploy it separately (Railway, Heroku, AWS, etc.)
- Then add its URL to `NEXT_PUBLIC_API_URL`

**Temporary Solution (Development Only):**
- You can temporarily disable API calls and use mock data
- Comment out API hooks in pages
- Focus on backend development first

**Order of Development:**
1. ✅ Frontend deployed (Done)
2. ⏳ Backend API (Next step)
3. ⏳ Configure environment variables
4. ⏳ Integrate frontend + backend
5. ⏳ Test end-to-end

---

## 📱 Contact

Need assistance? Check:
- Vercel Documentation: https://vercel.com/docs/concepts/projects/environment-variables
- Supabase Docs: https://supabase.com/docs
- OneSignal Docs: https://documentation.onesignal.com/

Good luck! 🚀
