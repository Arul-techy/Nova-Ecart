"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadProductImage(productId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

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
    // Upload to storage
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

    // Update product with image URL
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
