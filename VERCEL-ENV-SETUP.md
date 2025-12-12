# ⚡ Quick Fix: Set Environment Variables in Vercel

## 🚨 Current Issue
Your app is deployed but cannot fetch data because `NEXT_PUBLIC_API_URL` is not set.

---

## ✅ Solution: Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/wridho788s-projects/dntcell-marketplace/settings/environment-variables
```

### Step 2: Add These Variables

Click **"Add New"** for each variable:

#### ✅ REQUIRED (Copy-paste these exactly):

**Variable 1:**
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: https://ivufhejdmtyzxqcocmaq.supabase.co
```

**Variable 2:**
```
Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2dWZoZWpkbXR5enhxY29jbWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTQxNTUsImV4cCI6MjA3NjIzMDE1NX0.lWpeQE84UbmHVxUz5v_pSHwIXDo6bhqQDuHvfeE-Ve4
```

**Variable 3:**
```
Name:  NEXT_PUBLIC_API_URL
Value: [LEAVE EMPTY FOR NOW OR ADD YOUR BACKEND API URL]
```

#### ⭕ OPTIONAL (For OneSignal push notifications):

**Variable 4:**
```
Name:  NEXT_PUBLIC_ONESIGNAL_APP_ID
Value: bc61c070-c6d1-450e-a770-1e06970c6194
```

**Variable 5:**
```
Name:  ONESIGNAL_API_KEY  
Value: xkrnd5nfxeoynqvfbvksaoboc
```

---

### Step 3: Select Environment

For each variable, check these boxes:
- ✅ **Production**
- ✅ **Preview** (optional)
- ✅ **Development** (optional)

---

### Step 4: Redeploy

After adding all variables:

**Option A: Redeploy from Vercel**
1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**
4. ✅ **Use existing Build Cache** (faster)

**Option B: Push a new commit**
```bash
git commit --allow-empty -m "trigger redeploy"
git push
```

---

## 📊 What Will Happen After Setup

### ✅ With Supabase Variables Set:
- Authentication will work
- User login/register enabled
- Profile management functional

### ⚠️ Without `NEXT_PUBLIC_API_URL`:
- Yellow warning banner will show (user-friendly)
- App still loads without crashing
- Empty states shown for products/categories
- Console shows: "Failed to fetch products" (expected)

### ✅ After Backend API is Ready:
1. Deploy your backend API
2. Get the API URL (e.g., `https://api.example.com/api`)
3. Update `NEXT_PUBLIC_API_URL` in Vercel
4. Redeploy
5. Full functionality enabled!

---

## 🔍 Verify Setup

After redeployment, check:

1. **Open your app**: https://dncell-marketplace.vercel.app
2. **Check console** (F12): Should see Supabase connected
3. **Login page**: Should work (if Supabase set correctly)
4. **Homepage**: 
   - If API set: Products load
   - If API not set: Yellow warning banner shows (this is correct!)

---

## 📋 Quick Checklist

Before clicking "Add":
- [ ] Copied variable names exactly (case-sensitive!)
- [ ] Pasted values without extra spaces
- [ ] Selected "Production" environment
- [ ] Clicked "Save" for each variable
- [ ] All 2 required variables added (Supabase URL + Key)
- [ ] Triggered redeploy

---

## 🆘 Still Not Working?

### Error: "Supabase URL is required"
- ✅ Check variable name is EXACTLY: `NEXT_PUBLIC_SUPABASE_URL`
- ✅ No spaces before/after the value
- ✅ Environment selected: Production

### Error: "API Connection Refused"
- ✅ This is normal if `NEXT_PUBLIC_API_URL` is empty
- ✅ Yellow banner should show with instructions
- ✅ Wait until backend API is deployed

### Deployment Failed
- Check Vercel build logs
- Look for "Build succeeded" message
- Common issue: Environment variable typo

---

## 🎯 Summary

**Immediate Action:**
```
Add these 2 variables to Vercel NOW:
1. NEXT_PUBLIC_SUPABASE_URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY

Then redeploy.
```

**Later (when backend ready):**
```
Add backend API URL:
3. NEXT_PUBLIC_API_URL

Then redeploy again.
```

**That's it!** 🚀

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs/concepts/projects/environment-variables
- Check: VERCEL-DEPLOYMENT.md (detailed guide)
