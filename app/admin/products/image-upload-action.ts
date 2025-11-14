"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function uploadProductImage(productId: string, formData: FormData) {
  // Use service role key to bypass RLS policies
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return { error: "Server configuration missing" };
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Get product details
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, seller_id, title")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Product not found" };
  }

  // Get image file
  const imageFile = formData.get("image") as File | null;
  if (!imageFile || imageFile.size === 0) {
    return { error: "No image file provided" };
  }

  try {
    // Upload to storage using service role key
    const fileName = `${Date.now()}_${imageFile.name}`;
    const filePath = `products/${product.seller_id}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(uploadData.path);

    const imageUrl = urlData.publicUrl;

    // Update product with image URL using service role (bypasses RLS)
    const { error: updateError } = await supabase
      .from("products")
      .update({ image: imageUrl, updated_at: new Date().toISOString() })
      .eq("id", productId);

    if (updateError) {
      console.error("Update error:", updateError);
      return { error: `Failed to update product: ${updateError.message}` };
    }

    revalidatePath("/admin/products");
    revalidatePath("/store");

    return { success: true, message: `Image uploaded for "${product.title}"` };
  } catch (err) {
    console.error("Error:", err);
    return { error: err instanceof Error ? err.message : "Unknown error occurred" };
  }
}
