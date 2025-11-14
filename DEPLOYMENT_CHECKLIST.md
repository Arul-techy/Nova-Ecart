# Pre-Deployment Checklist

## ✅ Code Quality
- [x] No linter errors
- [x] Build completes successfully
- [x] TypeScript compiles without errors
- [x] All imports resolved

## ✅ Configuration Files
- [x] `.gitignore` configured
- [x] `next.config.ts` configured with image domains
- [x] `package.json` has all dependencies

## ⚠️ Before Deploying

### 1. Supabase Setup (CRITICAL)
- [ ] Run `supabase-seller-setup.sql` in Supabase SQL Editor
- [ ] Run `supabase-products-setup.sql` in Supabase SQL Editor  
- [ ] Run `supabase-storage-policies.sql` in Supabase SQL Editor
- [ ] Create `seller-documents` storage bucket (private)
- [ ] Create `product-images` storage bucket (public)

### 2. Environment Variables

**Required:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=your_deployment_url
```

**Optional (for Cryptomus):**
```
CRYPTOMUS_MERCHANT_ID=your_merchant_id
CRYPTOMUS_API_KEY=your_api_key
CRYPTOMUS_API_URL=https://api.cryptomus.com/v1
```

### 3. Supabase Redirect URLs
After deployment, add these to Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-deployment-url.com`
- Redirect URLs:
  - `https://your-deployment-url.com/auth/callback`
  - `https://your-deployment-url.com/**`

## 🚀 Quick Deploy Steps

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to your hosting provider:**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy the application

3. **Update Supabase:**
   - Add deployment URL to redirect URLs
   - Test authentication flow

4. **Test Everything:**
   - User sign-up/sign-in
   - Seller registration
   - Product viewing
   - Seller approval
   - Product adding

## 📝 Notes

- Build completed successfully ✅
- All routes are properly configured ✅
- Middleware warning is just a deprecation notice (not breaking) ⚠️
- Image domains configured for Supabase and Unsplash ✅

