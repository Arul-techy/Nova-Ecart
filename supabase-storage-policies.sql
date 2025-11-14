-- Supabase Storage Policies Setup
-- Run this script AFTER creating the storage buckets in the Supabase Dashboard
-- 
-- First, create these buckets in Storage:
-- 1. seller-documents (Private bucket)
-- 2. product-images (Public bucket)

-- ============================================
-- Policies for seller-documents bucket
-- ============================================

-- Policy 1: Sellers can upload their own documents
CREATE POLICY "Sellers can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'seller-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Sellers can view their own documents
CREATE POLICY "Sellers can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'seller-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Sellers can delete their own documents
CREATE POLICY "Sellers can delete own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'seller-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- Policies for product-images bucket
-- ============================================

-- Policy 1: Approved sellers can upload product images
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

-- Policy 2: Public can view product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Policy 3: Sellers can delete their own product images
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

-- Policy 4: Sellers can update their own product images
CREATE POLICY "Sellers can update own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  EXISTS (
    SELECT 1 FROM sellers
    WHERE sellers.user_id = auth.uid()
    AND (storage.foldername(name))[1] = sellers.id::text
  )
);

