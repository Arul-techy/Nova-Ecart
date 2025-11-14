# Vercel Deployment Guide - Complete Setup

## ✅ Prerequisites Completed
- Google OAuth configured in Google Cloud Console
- Google OAuth credentials added to Supabase
- Redirect URLs configured in Supabase

## 🚀 Deployment Steps

### 1. Commit and Push Your Code
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Arul-techy/Nova-Ecart`
4. Configure project settings (keep defaults)
5. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 3. Add Environment Variables in Vercel

Go to: **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these 3 variables for **ALL environments** (Production, Preview, Development):

```
NEXT_PUBLIC_SUPABASE_URL = https://vjbuanixlbwbwsialfjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnVhbml4bGJ3YndzaWFsZmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzI3MDIsImV4cCI6MjA3ODYwODcwMn0.vfGnLBQrSyJq_YrXTpKiaGis_7Ry8u1GlgmxzW4ivVE
NEXT_PUBLIC_SITE_URL = https://your-app-name.vercel.app
```

**Important:** Replace `your-app-name.vercel.app` with your actual Vercel deployment URL.

### 4. Update Supabase with Vercel URL

Go to: **Supabase Dashboard** → **Authentication** → **URL Configuration**

**Site URL:**
```
https://your-app-name.vercel.app
```

**Redirect URLs:** (Add all of these)
```
https://your-app-name.vercel.app/**
https://your-app-name.vercel.app/auth/callback
http://localhost:3000/**
http://localhost:3000/auth/callback
```

### 5. Redeploy on Vercel

After adding environment variables:
1. Go to **Vercel Dashboard** → **Deployments**
2. Click the **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. **UNCHECK** "Use existing Build Cache"
5. Click **"Redeploy"**

## 🧪 Testing Your Deployment

### Test 1: Homepage
Visit: `https://your-app-name.vercel.app`
- Should load without errors
- Products should be visible

### Test 2: Google Sign In
Visit: `https://your-app-name.vercel.app/sign-in`
1. Click "Continue with Google"
2. Should redirect to Google login
3. After login, should return to your app
4. Should be signed in successfully

### Test 3: Sign Up
Visit: `https://your-app-name.vercel.app/sign-up`
1. Click "Create account with Google"
2. Should work same as sign-in

## 🎯 How It Works

### Authentication Flow:
1. User clicks "Continue with Google" → `/sign-in`
2. App calls Supabase OAuth → `signInWithGoogle()`
3. Supabase redirects to Google login
4. User logs in with Google
5. Google redirects to Supabase: `supabase.co/auth/v1/callback`
6. Supabase exchanges token and redirects to: `your-app.vercel.app/auth/callback`
7. App callback route (`/auth/callback/route.ts`) exchanges code for session
8. User is redirected to homepage, signed in ✅

## 🔧 Configuration Files

### Environment Variables (.env.local for local dev)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://vjbuanixlbwbwsialfjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnVhbml4bGJ3YndzaWFsZmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzI3MDIsImV4cCI6MjA3ODYwODcwMn0.vfGnLBQrSyJq_YrXTpKiaGis_7Ry8u1GlgmxzW4ivVE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Supabase Setup Checklist
- ✅ Google Provider Enabled
- ✅ Google Client ID added
- ✅ Google Client Secret added
- ✅ Redirect URLs configured
- ✅ Email confirmations disabled (optional)

### Vercel Setup Checklist
- ✅ Repository connected
- ✅ Environment variables added
- ✅ Build successful
- ✅ Deployment live

## ⚠️ Troubleshooting

### Issue: 505 Error on Sign In
**Cause:** Environment variables not loaded
**Fix:** Redeploy without cache (see Step 5)

### Issue: "Missing code" Error
**Cause:** Redirect URL not configured in Supabase
**Fix:** Add your Vercel URL to Supabase redirect URLs

### Issue: "Configuration error"
**Cause:** Environment variables missing
**Fix:** Check all 3 variables are set in Vercel for ALL environments

### Issue: Google OAuth Button Shows Error Message
**Cause:** Google provider not enabled in Supabase
**Fix:** Enable Google in Supabase → Authentication → Providers

### Issue: Redirect Loop
**Cause:** Wrong Site URL in Supabase
**Fix:** Make sure Site URL matches your Vercel deployment URL exactly

## 📊 Monitoring

### Check Vercel Logs
1. Go to **Vercel Dashboard** → Your Project
2. Click **"Logs"** or **"Functions"**
3. View real-time logs for errors

### Check Supabase Logs
1. Go to **Supabase Dashboard**
2. Click **"Logs"** in left sidebar
3. Filter by "Auth" to see authentication logs

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Vercel build completes successfully
- ✅ Homepage loads on Vercel URL
- ✅ Clicking "Continue with Google" redirects to Google
- ✅ After Google login, you return to your app
- ✅ You're signed in and can see your profile
- ✅ No console errors in browser

## 🔄 Making Changes

When you make code changes:
1. Commit and push to GitHub
2. Vercel automatically deploys
3. No need to redeploy manually
4. Check deployment status in Vercel Dashboard

## 📝 Important URLs

**Your App:** https://your-app-name.vercel.app
**Vercel Dashboard:** https://vercel.com/dashboard
**Supabase Dashboard:** https://supabase.com/dashboard
**GitHub Repo:** https://github.com/Arul-techy/Nova-Ecart

## 💡 Pro Tips

1. **Always test locally first** with `npm run dev` before deploying
2. **Check Vercel logs** if something doesn't work
3. **Clear browser cache** if you see old behavior
4. **Use incognito mode** to test sign-in without cached sessions
5. **Keep backup** of environment variables in a secure place

## 🛡️ Security Notes

- ✅ ANON key is safe to expose (client-side)
- ❌ Never commit SERVICE_ROLE key to git
- ✅ Use environment variables for all keys
- ✅ Supabase Row Level Security (RLS) protects your data
- ✅ Google OAuth handles password security

## 📞 Support

If issues persist:
1. Check TROUBLESHOOTING_505.md
2. Review Vercel build logs
3. Check Supabase auth logs
4. Verify all environment variables are set correctly
5. Ensure Google OAuth credentials are correct

---

**Status:** ✅ Ready for Production
**Last Updated:** 2024-11-14
**Version:** 1.0.0
