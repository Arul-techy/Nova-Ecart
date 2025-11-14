# Vercel Deployment Guide for NovaEcart

This guide will walk you through deploying NovaEcart to Vercel.

## Prerequisites

1. ✅ GitHub account (or GitLab/Bitbucket)
2. ✅ Vercel account (sign up at https://vercel.com)
3. ✅ Supabase project set up and configured
4. ✅ All SQL scripts run in Supabase
5. ✅ Storage buckets created in Supabase

## Pre-Deployment Checklist

### 1. Code Repository
- [ ] Push your code to GitHub/GitLab/Bitbucket
- [ ] Ensure `.gitignore` is properly configured
- [ ] Commit all changes

### 2. Supabase Setup
- [ ] Run `supabase-seller-setup.sql` in Supabase SQL Editor
- [ ] Run `supabase-products-setup.sql` in Supabase SQL Editor
- [ ] Run `supabase-storage-policies.sql` in Supabase SQL Editor
- [ ] Create `seller-documents` storage bucket (private)
- [ ] Create `product-images` storage bucket (public)
- [ ] Test that your Supabase connection works locally

### 3. Environment Variables
Prepare these environment variables for Vercel:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `NEXT_PUBLIC_SITE_URL` - Your Vercel deployment URL (will be set automatically)

**Optional (for Cryptomus payments):**
- `CRYPTOMUS_MERCHANT_ID` - Your Cryptomus merchant ID
- `CRYPTOMUS_API_KEY` - Your Cryptomus API key
- `CRYPTOMUS_API_URL` - Cryptomus API URL (default: https://api.cryptomus.com/v1)

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit - NovaEcart ready for deployment"
git branch -M main

# Add your GitHub repository
git remote add origin https://github.com/yourusername/novaecart.git
git push -u origin main
```

### Step 2: Import Project to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Project Settings

1. **Project Name**: `novaecart` (or your preferred name)
2. **Framework Preset**: Next.js (auto-detected)
3. **Root Directory**: `./` (default)
4. **Build Command**: `npm run build` (default)
5. **Output Directory**: `.next` (default)
6. **Install Command**: `npm install` (default)

### Step 4: Add Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Optional (for Cryptomus):

```
CRYPTOMUS_MERCHANT_ID=your-merchant-id
CRYPTOMUS_API_KEY=your-api-key
CRYPTOMUS_API_URL=https://api.cryptomus.com/v1
```

**Important Notes:**
- `NEXT_PUBLIC_SITE_URL` will be automatically set by Vercel
- For production, update `NEXT_PUBLIC_SITE_URL` to your actual domain after first deployment
- Never commit `.env` files to Git

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Vercel will provide you with a deployment URL (e.g., `novaecart.vercel.app`)

### Step 6: Update Supabase Settings

After deployment, update your Supabase project:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **Site URL**: `https://your-project.vercel.app`
3. Add to **Redirect URLs**: 
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**`

### Step 7: Update Environment Variables (if needed)

If you need to update `NEXT_PUBLIC_SITE_URL`:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add or update: `NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app`
3. Redeploy the project

## Post-Deployment

### 1. Test Your Deployment

- [ ] Visit your Vercel URL
- [ ] Test user sign-up/sign-in
- [ ] Test seller registration
- [ ] Test product viewing
- [ ] Test adding products (as approved seller)
- [ ] Test payment flow (if Cryptomus is configured)

### 2. Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase redirect URLs with your custom domain

### 3. Monitor Your Deployment

- Check Vercel Dashboard for build logs
- Monitor Supabase Dashboard for database activity
- Check Vercel Analytics for performance metrics

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error: "Environment variable missing"**
- Check all required env vars are set in Vercel
- Ensure `NEXT_PUBLIC_*` vars are set correctly

**Error: "Supabase connection failed"**
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Ensure RLS policies are set up correctly

### Runtime Errors

**"Payment service not configured"**
- This is expected if Cryptomus is not set up
- Add Cryptomus env vars or handle gracefully in UI

**"Storage bucket not found"**
- Ensure storage buckets are created in Supabase
- Verify storage policies are applied

### Common Issues

1. **CORS Errors**: Check Supabase CORS settings
2. **Redirect Issues**: Verify callback URLs in Supabase
3. **Image Upload Fails**: Check storage bucket permissions
4. **Build Timeout**: Optimize build or upgrade Vercel plan

## Production Checklist

- [ ] All environment variables configured
- [ ] Supabase redirect URLs updated
- [ ] Storage buckets created and policies applied
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Error monitoring set up
- [ ] Analytics configured (optional)
- [ ] Backup strategy in place (Supabase backups)

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Support](https://vercel.com/support)

## Quick Deploy Command

If you have Vercel CLI installed:

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts to deploy!

