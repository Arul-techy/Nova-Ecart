import { createClient } from "@/lib/supabase/client";

export type Product = {
  id: string;
  seller_id: string | null;
  title: string;
  description: string;
  image: string | null;
  price: number; // 1, 2, or 3 USDT
  status: "active" | "inactive" | "sold_out";
  category: string | null;
  badge: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchActiveProducts(): Promise<Product[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .not("seller_id", "is", null) // Only show products from sellers
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data || [];
}

