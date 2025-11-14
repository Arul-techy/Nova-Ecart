-- Note: Run supabase-seller-setup.sql FIRST before running this script
-- The sellers table must exist before creating the products table

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  price INTEGER NOT NULL CHECK (price IN (1, 2, 3)), -- Price in USDT (1, 2, or 3)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out')),
  category TEXT,
  badge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint if sellers table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sellers') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'products_seller_id_fkey'
    ) THEN
      ALTER TABLE products 
      ADD CONSTRAINT products_seller_id_fkey 
      FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for active products
DROP POLICY IF EXISTS "Allow public read access for active products" ON products;
CREATE POLICY "Allow public read access for active products"
  ON products
  FOR SELECT
  USING (status = 'active');

-- Note: Products can only be added by sellers through the seller dashboard
-- No sample products will be inserted here

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

