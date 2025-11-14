# Troubleshooting 505 Error on Vercel

## Issue
Getting 505 error on Vercel deployment even after adding environment variables.

## Diagnosis Steps

### 1. Check Vercel Logs
1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to "Functions" or "Runtime Logs"
4. Look for error messages

### 2. Verify Environment Variables in Vercel
Make sure ALL THREE variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

**Important:** They must be set for ALL environments (Production, Preview, Development)

### 3. Check if Email Provider is Enabled in Supabase
1. Go to Supabase Dashboard → Authentication → Providers
2. Make sure "Email" provider is **ENABLED**
3. If disabled, enable it and save

### 4. Disable Google OAuth Temporarily

Since Google OAuth is causing issues and you have email/password as alternative:

**Option A: Use Email/Password Only**
When you visit the sign-in page:
1. It defaults to email/password (which works)
2. Click "Sign in with Email" button
3. Enter email and password
4. This should work without any 505 errors

**Option B: Hide Google OAuth Button Until Configured**
The Google OAuth link is at the bottom. Just ignore it and use email sign-in for now.

### 5. Common Causes of 505 Error

**A. Google OAuth Not Configured in Supabase**
- Go to Supabase Dashboard → Authentication → Providers
- Check if Google provider is enabled
- If not, that's why it fails (but email should still work)

**B. Wrong Redirect URLs**
Check Supabase Dashboard → Authentication → URL Configuration:
```
Site URL: https://your-app.vercel.app
Redirect URLs:
  https://your-app.vercel.app/**
  https://your-app.vercel.app/auth/callback
  http://localhost:3000/**
```

**C. CORS Issues**
Make sure your Vercel URL is allowed in Supabase.

**D. Environment Variables Not Loaded**
After adding env vars, you MUST redeploy for them to take effect.

### 6. Quick Fix - Use Email Sign-In

The app now supports BOTH:
- Email/Password (works immediately)
- Google OAuth (needs configuration)

**To avoid 505 error:**
1. Go to your Vercel URL `/sign-in`
2. You'll see email/password form by default
3. Use that instead of Google OAuth
4. Create account at `/sign-up` with email

### 7. Test Locally First

Before deploying, test locally:
```bash
npm run dev
```
Visit http://localhost:3000/sign-in and try:
- Email sign-in ✅ (should work)
- Google OAuth ❌ (will fail if not configured)

### 8. Force Redeploy

Sometimes Vercel caches old builds:
1. Go to Vercel Dashboard → Deployments
2. Find latest deployment
3. Click "..." menu
4. Click "Redeploy"
5. Make sure "Use existing Build Cache" is UNCHECKED

### 9. Check Browser Console

Open browser developer tools (F12):
1. Go to Console tab
2. Try signing in
3. Look for error messages
4. Share those errors for more specific help

## Recommended Solution

**For immediate fix:**
1. Use Email/Password sign-in (bypasses Google OAuth entirely)
2. Works on both local and Vercel
3. No additional configuration needed

**For Google OAuth:**
1. Configure Google OAuth credentials in Google Cloud Console
2. Add them to Supabase → Authentication → Providers → Google
3. Then Google sign-in will work

## Verify Supabase Connection

Create a test page to verify Supabase connection:

Go to your Vercel URL and check:
- Can you access the homepage? ✅
- Can you see the sign-in page? ✅
- Can you enter email/password? ✅
- Does email sign-in work? (Should work)
- Does Google OAuth cause 505? (Expected if not configured)

## Still Not Working?

If email/password ALSO gives 505 error:

1. **Check Supabase Dashboard → SQL Editor**
   Run: `SELECT * FROM auth.users LIMIT 1;`
   If this fails, there's a Supabase issue

2. **Verify API Keys**
   Double-check you're using ANON key, not SERVICE_ROLE key

3. **Check Supabase Project Status**
   Make sure project is active and not paused

4. **Try Creating New Deployment**
   Sometimes fresh deployment helps

## Contact Points

If issues persist:
1. Check Vercel deployment logs
2. Check Supabase logs (Dashboard → Logs)
3. Share specific error messages from browser console
