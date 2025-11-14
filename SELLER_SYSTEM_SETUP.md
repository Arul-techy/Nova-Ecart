# Seller System Setup Guide

This guide will help you set up the complete seller system for NovaEcart.

## Prerequisites

1. Supabase project created and configured
2. Environment variables set up (`.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Setup Steps

### Step 1: Run SQL Scripts

**Important:** Run scripts in this exact order:

1. **First, run `supabase-seller-setup.sql`**
   - Creates the `sellers` table
   - Updates the `products` table to include `seller_id`
   - Sets up Row Level Security (RLS) policies

2. **Then, run `supabase-products-setup.sql`**
   - Creates/updates the `products` table
   - Sets up RLS policies for products
   - Note: Sample products are removed - only sellers can add products now

### Step 2: Set Up Storage Buckets

Follow the instructions in `SUPABASE_STORAGE_SETUP.md` to:
- Create `seller-documents` bucket (private)
- Create `product-images` bucket (public)
- Set up storage policies

### Step 3: Verify Setup

1. Sign in to your application
2. Click "Become a Seller" on the home page
3. Complete the seller registration form
4. After registration, you'll be redirected to the seller dashboard
5. Once your account is approved (manually in Supabase), you can add products

## Features Implemented

### ✅ Seller Registration
- Multi-step form (6 steps) collecting all required seller information:
  - Basic Information (name, email, mobile, photo)
  - Addresses (home address, pickup address)
  - Business Details (GSTIN, PAN, Business Name)
  - Banking Information (Account, IFSC, Bank Statement)
  - Address Proof
  - Additional Documents (Trademark, Authorization Letter - optional)

### ✅ Seller Dashboard
- View seller profile information
- View verification status
- List all products added by the seller
- Add new products (only for approved sellers)
- Delete products

### ✅ Product Management
- Only approved sellers can add products
- Products are linked to seller_id
- Products require: title, description, image, price (1, 2, or 3 USDT), category, badge (optional)

### ✅ Security
- Row Level Security (RLS) policies ensure:
  - Sellers can only view/edit their own profile
  - Sellers can only add products if approved
  - Sellers can only manage their own products
  - Public can view active products from any seller

### ✅ File Uploads
- Seller documents uploaded to Supabase Storage
- Product images uploaded to Supabase Storage
- Proper file organization and access control

## Manual Seller Approval

To approve a seller account:

1. Go to Supabase Dashboard → Table Editor → `sellers`
2. Find the seller record
3. Update `verification_status` from `pending` to `approved`
4. Optionally add `verification_notes`

## Routes

- `/seller/register` - Seller registration page
- `/seller/dashboard` - Seller dashboard (requires seller account)
- `/seller/products/add` - Add new product (requires approved seller)

## Database Schema

### Sellers Table
- Stores all seller registration information
- Links to `auth.users` via `user_id`
- Verification status: `pending`, `approved`, `rejected`

### Products Table
- Now includes `seller_id` foreign key
- Only products with `seller_id` are shown in the store
- Products can only be added by approved sellers

## Troubleshooting

### "You must be registered as a seller"
- Complete the seller registration at `/seller/register`

### "Your seller account must be approved"
- Your account is pending approval
- Contact admin or manually approve in Supabase

### File upload errors
- Verify storage buckets are created
- Check storage policies are set up correctly
- Ensure file sizes are within limits

### Products not showing in store
- Verify product `status` is `active`
- Verify product has a `seller_id`
- Check seller's `verification_status` is `approved`

