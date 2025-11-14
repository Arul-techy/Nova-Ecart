-- Create sellers table
CREATE TABLE IF NOT EXISTS sellers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Basic Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  photo_url TEXT,
  
  -- Addresses
  home_address TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  
  -- Business Identification
  gstin TEXT,
  pan_card TEXT NOT NULL,
  business_name TEXT NOT NULL,
  
  -- Banking Details
  bank_account_number TEXT NOT NULL,
  ifsc_code TEXT NOT NULL,
  bank_statement_url TEXT,
  
  -- Address Proof
  address_proof_url TEXT,
  
  -- Additional Documents (Optional)
  trademark_certificate_url TEXT,
  authorization_letter_url TEXT,
  
  -- Status
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_verification_status ON sellers(verification_status);
CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Create policy: Sellers can view and update their own profile
CREATE POLICY "Sellers can view own profile"
  ON sellers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can update own profile"
  ON sellers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Sellers can insert own profile"
  ON sellers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Public can view approved sellers (for product listings)
CREATE POLICY "Public can view approved sellers"
  ON sellers
  FOR SELECT
  USING (verification_status = 'approved');

-- Update products table to add seller_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE products ADD COLUMN seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
  END IF;
END $$;

-- Update RLS policies for products
DROP POLICY IF EXISTS "Allow public read access for active products" ON products;
CREATE POLICY "Allow public read access for active products"
  ON products
  FOR SELECT
  USING (status = 'active');

-- Sellers can insert their own products
CREATE POLICY "Sellers can insert own products"
  ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
      AND sellers.verification_status = 'approved'
    )
  );

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
  ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
  ON products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sellers 
      WHERE sellers.id = products.seller_id 
      AND sellers.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp for sellers
CREATE OR REPLACE FUNCTION update_sellers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at for sellers
DROP TRIGGER IF EXISTS update_sellers_updated_at ON sellers;
CREATE TRIGGER update_sellers_updated_at
  BEFORE UPDATE ON sellers
  FOR EACH ROW
  EXECUTE FUNCTION update_sellers_updated_at();

