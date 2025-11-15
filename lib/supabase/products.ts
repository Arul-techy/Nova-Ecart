import { createClient } from "@/lib/supabase/client";

export type Product = {
  id: string;
  seller_id: string | null;
  title: string;
  description: string;
  image: string | null;
  price: number; // Price in INR
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
    .not("seller_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  const products = (data || []) as Product[];
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Resolve image URLs
  const resolved = products.map((p) => {
    if (p.image) {
      // If image starts with http, it's already a full URL
      if (p.image.startsWith("http")) {
        return p;
      }
      // If it's a storage path, convert to public URL
      if (baseUrl) {
        const encodedPath = p.image.split("/").map(encodeURIComponent).join("/");
        p.image = `${baseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${encodedPath}`;
      }
    }
    // If price was stored as integer cents in DB, convert back to float INR for UI
    try {
      if (typeof p.price === 'number') {
        // convert cents -> float
        p.price = Number((p.price as any) / 100);
      }
    } catch {
      // ignore
    }

    return p;
  });

  console.log("✅ Fetched products with images:", resolved.map(p => ({ 
    id: p.id,
    title: p.title, 
    image: p.image ? p.image.substring(0, 80) + "..." : "null"
  })));

  return resolved;
}

