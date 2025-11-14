# Fix Vercel Deployment Issues

## Problem
App works locally but fails on Vercel with authentication errors (buffering, 505 error, etc.)

## Root Cause
Environment variables not configured in Vercel deployment.

## Solution

### 1. Add Environment Variables to Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL=https://vjbuanixlbwbwsialfjo.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnVhbml4bGJ3YndzaWFsZmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzI3MDIsImV4cCI6MjA3ODYwODcwMn0.vfGnLBQrSyJq_YrXTpKiaGis_7Ry8u1GlgmxzW4ivVE

NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
```

**Replace** `your-vercel-app.vercel.app` with your actual Vercel URL.

### 2. Update Supabase Redirect URLs

Go to Supabase Dashboard → Authentication → URL Configuration

**Site URL:**
```
https://your-vercel-app.vercel.app
```

**Redirect URLs (add all of these):**
```
http://localhost:3000/**
http://localhost:3001/**
https://your-vercel-app.vercel.app/**
https://your-vercel-app.vercel.app/auth/callback
```

### 3. Enable Email Authentication

Go to Supabase Dashboard → Authentication → Providers

1. Enable **Email** provider
2. Confirm email templates are configured
3. Save changes

### 4. Redeploy on Vercel

After adding environment variables:

**Option A: Via Vercel Dashboard**
1. Go to Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"

**Option B: Via Git Push**
```bash
git add .
git commit -m "Configure environment variables"
git push
```

### 5. Test the Deployment

1. Visit your Vercel URL
2. Go to `/sign-in`
3. Try signing in with email/password
4. Check browser console for any errors

## Common Issues

### Issue: Still getting errors after adding env vars
**Solution:** Make sure you clicked "Redeploy" after adding environment variables.

### Issue: Redirect loop
**Solution:** Check that all redirect URLs are added to Supabase, including the `/auth/callback` route.

### Issue: "Invalid API Key"
**Solution:** Double-check that you copied the correct ANON KEY from Supabase (not the Service Role Key).

### Issue: Email sign-up not working
**Solution:** Make sure Email provider is enabled in Supabase → Authentication → Providers.

## Verify Environment Variables

To check if env vars are set in Vercel:
1. Go to Settings → Environment Variables
2. You should see all three variables listed
3. They should be enabled for Production, Preview, and Development

## Need Help?

If issues persist:
1. Check Vercel deployment logs
2. Check Supabase logs (Dashboard → Logs)
3. Open browser console to see specific errors
