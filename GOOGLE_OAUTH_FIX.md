# Google OAuth Issue on Vercel - Complete Fix

## Problem Summary
- ✅ Works on localhost (http://localhost:3000)
- ❌ Fails on Vercel (infinite buffering after Google login)
- Google OAuth redirects correctly but gets stuck after authentication

## Root Cause
The issue is with the **OAuth callback URL configuration** for production vs development environments.

---

## 🔧 Solution: Fix Google OAuth Redirect URLs

### Step 1: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, make sure you have BOTH:

```
https://vjbuanixlbwbwsialfjo.supabase.co/auth/v1/callback
```

**Note:** This is the Supabase callback URL, NOT your Vercel URL. Google redirects to Supabase first, then Supabase redirects to your app.

### Step 2: Update Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**

**Site URL:**
```
https://nova-ecart.vercel.app
```
(Replace with your actual Vercel URL)

**Redirect URLs:** (Add ALL of these)
```
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
https://nova-ecart.vercel.app/**
https://nova-ecart.vercel.app/auth/callback
https://*.vercel.app/**
https://*.vercel.app/auth/callback
```

The wildcard `*.vercel.app` entries allow preview deployments to work.

### Step 3: Verify Vercel Environment Variables

Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Make sure these are set for **Production, Preview, AND Development**:

```
NEXT_PUBLIC_SUPABASE_URL = https://vjbuanixlbwbwsialfjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnVhbml4bGJ3YndzaWFsZmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzI3MDIsImV4cCI6MjA3ODYwODcwMn0.vfGnLBQrSyJq_YrXTpKiaGis_7Ry8u1GlgmxzW4ivVE
NEXT_PUBLIC_SITE_URL = https://nova-ecart.vercel.app
```

**Important:** `NEXT_PUBLIC_SITE_URL` must match your production Vercel URL exactly.

### Step 4: Redeploy on Vercel

After making the above changes:

1. Go to **Vercel Dashboard** → **Deployments**
2. Click **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. **UNCHECK** "Use existing Build Cache"
5. Click **"Redeploy"**

This ensures the new environment variables are loaded.

---

## 🧪 Testing the Fix

### Test on Localhost
```bash
npm run dev
```
Visit http://localhost:3000/sign-in
- Click "Continue with Google"
- Should redirect to Google
- After login, should return and you're signed in ✅

### Test on Vercel
Visit https://your-app.vercel.app/sign-in
- Click "Continue with Google"
- Should redirect to Google
- After login, should return and you're signed in ✅

---

## 🔍 Debugging Tips

### Check Browser Console
Open browser DevTools (F12) → Console tab

**Look for:**
- Any CORS errors
- "Failed to fetch" errors
- Network errors
- Authentication errors

### Check Network Tab
Open browser DevTools (F12) → Network tab

**Watch the redirect flow:**
1. Click "Continue with Google"
2. You should see redirect to `accounts.google.com`
3. Then redirect to `vjbuanixlbwbwsialfjo.supabase.co/auth/v1/callback`
4. Then redirect to `your-app.vercel.app/auth/callback`
5. Finally redirect to `your-app.vercel.app/` (homepage)

**If stuck:** Check which step fails and look at the error response.

### Check Vercel Function Logs
1. Go to Vercel Dashboard → Your Project
2. Click **"Logs"** or **"Functions"**
3. Look for errors from `/auth/callback` route

Common errors you might see:
- ❌ "Missing authorization code" → Check redirect URLs
- ❌ "Configuration error" → Check environment variables
- ❌ "exchangeCodeForSession failed" → Check Supabase connection

### Check Supabase Auth Logs
1. Go to Supabase Dashboard
2. Click **"Logs"** in sidebar
3. Filter by **"Auth"**
4. Look for failed authentication attempts

---

## 🎯 Common Issues & Fixes

### Issue 1: Infinite Buffering After Google Login
**Symptoms:** Redirected to Google, login successful, but stuck buffering on return

**Cause:** Callback route can't exchange code for session

**Fix:**
1. Check Supabase redirect URLs include your Vercel domain
2. Check `NEXT_PUBLIC_SITE_URL` matches your Vercel URL
3. Redeploy without cache

### Issue 2: "This site can't be reached" After Google Login
**Symptoms:** After Google login, browser shows connection error

**Cause:** Redirect URL not whitelisted in Supabase

**Fix:**
Add `https://your-app.vercel.app/auth/callback` to Supabase redirect URLs

### Issue 3: Works in Preview, Fails in Production
**Symptoms:** Works on preview deployments but not production

**Cause:** Environment variables or redirect URLs missing for production

**Fix:**
1. Check environment variables are set for "Production" environment
2. Add production URL to Supabase redirect URLs

### Issue 4: "Configuration Error" Message
**Symptoms:** Error message appears on sign-in page

**Cause:** Missing or incorrect environment variables

**Fix:**
1. Verify all 3 environment variables are set in Vercel
2. Check they're enabled for all environments
3. Redeploy

---

## 🔐 Security Checklist

✅ Only use ANON key (not SERVICE_ROLE key) in environment variables
✅ All keys stored in environment variables, not hardcoded
✅ Redirect URLs properly whitelisted in both Google and Supabase
✅ HTTPS enforced in production
✅ Supabase RLS policies configured (see your SQL setup files)

---

## 📋 Complete Checklist

### Google Cloud Console
- [ ] OAuth 2.0 Client created
- [ ] Supabase callback URL added: `https://vjbuanixlbwbwsialfjo.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied

### Supabase Dashboard
- [ ] Google provider enabled
- [ ] Google Client ID added
- [ ] Google Client Secret added
- [ ] Site URL set to Vercel URL
- [ ] All redirect URLs added (localhost + Vercel)
- [ ] Email confirmations disabled (optional)

### Vercel Dashboard
- [ ] Repository connected
- [ ] All 3 environment variables added
- [ ] Variables enabled for all environments
- [ ] Latest deployment successful
- [ ] Environment variables loaded (redeployed after adding)

### Testing
- [ ] Localhost Google OAuth works
- [ ] Vercel Google OAuth works
- [ ] Can sign up with Google
- [ ] Can sign in with Google
- [ ] User data saved correctly
- [ ] No console errors

---

## 🚀 Quick Test Script

Run this in your browser console on the sign-in page:

```javascript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL);
```

**Expected output on Vercel:**
```
Supabase URL: https://vjbuanixlbwbwsialfjo.supabase.co
Site URL: https://your-app.vercel.app
```

If you see `undefined`, environment variables aren't loaded → Redeploy!

---

## 💡 Alternative: Use Development Mode Temporarily

If you need the app working immediately while debugging OAuth:

1. In Vercel, temporarily set:
   ```
   NEXT_PUBLIC_SITE_URL = http://localhost:3000
   ```

2. Test from localhost only
3. Once OAuth works, switch back to production URL

**Note:** This is only for debugging. Don't use localhost URL in production.

---

## 📞 Still Having Issues?

If Google OAuth still doesn't work after following all steps:

1. **Capture the exact error:**
   - Open browser console (F12)
   - Click "Continue with Google"
   - Copy the full error message
   - Check Network tab for failed requests

2. **Check Vercel logs:**
   - Go to Vercel Dashboard → Logs
   - Look for errors from the callback route
   - Share the error messages

3. **Verify Google OAuth setup:**
   - Google Cloud Console → OAuth consent screen
   - Make sure app is in "Production" not "Testing"
   - Check test users are added if in "Testing" mode

4. **Try signing out of Google:**
   - Sign out of all Google accounts in browser
   - Try Google OAuth again with fresh login
   - Sometimes cached sessions cause issues

---

## ✅ Success Indicators

You'll know it's working when:

1. Click "Continue with Google" → Redirects to Google login
2. Select Google account → Redirects back to your app
3. You're signed in immediately (see user info in header)
4. No errors in console
5. Can navigate the app while signed in
6. Signing out and in again works consistently

---

**Status:** Ready to deploy
**Last Updated:** 2024-11-14
**Next Step:** Update Google Cloud redirect URLs and redeploy
