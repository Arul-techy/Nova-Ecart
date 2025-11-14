# Supabase Storage Setup Guide

This guide explains how to set up Supabase Storage buckets required for the seller system.

## Required Storage Buckets

The seller system requires two storage buckets:

1. **seller-documents** - For storing seller registration documents
2. **product-images** - For storing product images

## Setup Instructions

### 1. Create Storage Buckets

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**

#### Create `seller-documents` bucket:
- **Name**: `seller-documents`
- **Public bucket**: ❌ (Keep it private for security)
- **File size limit**: 10 MB (or as needed)
- **Allowed MIME types**: `image/*, application/pdf`

#### Create `product-images` bucket:
- **Name**: `product-images`
- **Public bucket**: ✅ (Enable public access for product images)
- **File size limit**: 5 MB (or as needed)
- **Allowed MIME types**: `image/*`

### 2. Set Up Storage Policies

#### For `seller-documents` bucket:

**Policy 1: Sellers can upload their own documents**
```sql
CREATE POLICY "Sellers can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'seller-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

**Policy 2: Sellers can view their own documents**
```sql
CREATE POLICY "Sellers can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'seller-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### For `product-images` bucket:

**Policy 1: Approved sellers can upload product images**
```sql
CREATE POLICY "Approved sellers can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM sellers
    WHERE sellers.user_id = auth.uid()
    AND sellers.verification_status = 'approved'
    AND (storage.foldername(name))[1] = sellers.id::text
  )
);
```

**Policy 2: Public can view product images**
```sql
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');
```

**Policy 3: Sellers can delete their own product images**
```sql
CREATE POLICY "Sellers can delete own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM sellers
    WHERE sellers.user_id = auth.uid()
    AND (storage.foldername(name))[1] = sellers.id::text
  )
);
```

### 3. Run SQL Scripts

1. Go to **SQL Editor** in Supabase Dashboard
2. Run `supabase-seller-setup.sql` first (creates sellers table and updates products table)
3. Run the storage policies above in the SQL Editor

## File Structure

Files are organized in the following structure:

### seller-documents:
```
sellers/
  {user_id}/
    photo/
      {timestamp}_{filename}
    bank/
      {timestamp}_{filename}
    address/
      {timestamp}_{filename}
    trademark/
      {timestamp}_{filename}
    authorization/
      {timestamp}_{filename}
```

### product-images:
```
products/
  {seller_id}/
    {timestamp}_{filename}
```

## Notes

- All file uploads are validated on the client and server side
- File sizes are limited by bucket settings
- Only approved sellers can upload product images
- Sellers can only access their own documents
- Product images are publicly accessible for display on the store

