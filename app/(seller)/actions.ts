"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function registerSeller(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to register as a seller" };
  }

  // Check if seller already exists
  const { data: existingSeller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existingSeller) {
    return { error: "You are already registered as a seller" };
  }

  // Upload files to Supabase Storage
  const photoFile = formData.get("photo") as File | null;
  const bankStatementFile = formData.get("bank_statement") as File | null;
  const addressProofFile = formData.get("address_proof") as File | null;
  const trademarkFile = formData.get("trademark_certificate") as File | null;
  const authorizationFile = formData.get("authorization_letter") as File | null;

  let photoUrl: string | null = null;
  let bankStatementUrl: string | null = null;
  let addressProofUrl: string | null = null;
  let trademarkUrl: string | null = null;
  let authorizationUrl: string | null = null;

  // Upload photo
  if (photoFile && photoFile.size > 0) {
    const photoPath = `sellers/${user.id}/photo/${Date.now()}_${photoFile.name}`;
    const { data: photoData, error: photoError } = await supabase.storage
      .from("seller-documents")
      .upload(photoPath, photoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!photoError && photoData) {
      const { data: urlData } = supabase.storage
        .from("seller-documents")
        .getPublicUrl(photoData.path);
      photoUrl = urlData.publicUrl;
    }
  }

  // Upload bank statement
  if (bankStatementFile && bankStatementFile.size > 0) {
    const bankPath = `sellers/${user.id}/bank/${Date.now()}_${bankStatementFile.name}`;
    const { data: bankData, error: bankError } = await supabase.storage
      .from("seller-documents")
      .upload(bankPath, bankStatementFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!bankError && bankData) {
      const { data: urlData } = supabase.storage
        .from("seller-documents")
        .getPublicUrl(bankData.path);
      bankStatementUrl = urlData.publicUrl;
    }
  }

  // Upload address proof
  if (addressProofFile && addressProofFile.size > 0) {
    const addressPath = `sellers/${user.id}/address/${Date.now()}_${addressProofFile.name}`;
    const { data: addressData, error: addressError } = await supabase.storage
      .from("seller-documents")
      .upload(addressPath, addressProofFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!addressError && addressData) {
      const { data: urlData } = supabase.storage
        .from("seller-documents")
        .getPublicUrl(addressData.path);
      addressProofUrl = urlData.publicUrl;
    }
  }

  // Upload trademark certificate (optional)
  if (trademarkFile && trademarkFile.size > 0) {
    const trademarkPath = `sellers/${user.id}/trademark/${Date.now()}_${trademarkFile.name}`;
    const { data: trademarkData, error: trademarkError } = await supabase.storage
      .from("seller-documents")
      .upload(trademarkPath, trademarkFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!trademarkError && trademarkData) {
      const { data: urlData } = supabase.storage
        .from("seller-documents")
        .getPublicUrl(trademarkData.path);
      trademarkUrl = urlData.publicUrl;
    }
  }

  // Upload authorization letter (optional)
  if (authorizationFile && authorizationFile.size > 0) {
    const authPath = `sellers/${user.id}/authorization/${Date.now()}_${authorizationFile.name}`;
    const { data: authData, error: authError } = await supabase.storage
      .from("seller-documents")
      .upload(authPath, authorizationFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!authError && authData) {
      const { data: urlData } = supabase.storage
        .from("seller-documents")
        .getPublicUrl(authData.path);
      authorizationUrl = urlData.publicUrl;
    }
  }

  // Insert seller record
  const { data, error } = await supabase
    .from("sellers")
    .insert({
      user_id: user.id,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      mobile: formData.get("mobile") as string,
      photo_url: photoUrl,
      home_address: formData.get("home_address") as string,
      pickup_address: formData.get("pickup_address") as string,
      gstin: formData.get("gstin") as string || null,
      pan_card: formData.get("pan_card") as string,
      business_name: formData.get("business_name") as string,
      bank_account_number: formData.get("bank_account_number") as string,
      ifsc_code: formData.get("ifsc_code") as string,
      bank_statement_url: bankStatementUrl,
      address_proof_url: addressProofUrl,
      trademark_certificate_url: trademarkUrl,
      authorization_letter_url: authorizationUrl,
      verification_status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error registering seller:", error);
    return { error: error.message };
  }

  revalidatePath("/seller/dashboard");
  redirect("/seller/dashboard");
}

export async function addProduct(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to add products" };
  }

  // Get seller record
  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .select("id, verification_status")
    .eq("user_id", user.id)
    .single();

  if (sellerError || !seller) {
    return { error: "You must be registered as a seller to add products" };
  }

  if (seller.verification_status !== "approved") {
    return { error: "Your seller account must be approved before adding products" };
  }

  // Upload product image
  const imageFile = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const imagePath = `products/${seller.id}/${Date.now()}_${imageFile.name}`;
    const { data: imageData, error: imageError } = await supabase.storage
      .from("product-images")
      .upload(imagePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!imageError && imageData) {
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(imageData.path);
      imageUrl = urlData.publicUrl;
    }
  }

  // Insert product
  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: seller.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: imageUrl,
      price: parseInt(formData.get("price") as string),
      category: formData.get("category") as string || null,
      badge: formData.get("badge") as string || null,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding product:", error);
    return { error: error.message };
  }

  revalidatePath("/seller/dashboard");
  redirect("/seller/dashboard");
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Get seller record
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!seller) {
    return { error: "Seller not found" };
  }

  // Verify product belongs to seller
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("seller_id")
    .eq("id", productId)
    .eq("seller_id", seller.id)
    .single();

  if (productError || !product) {
    return { error: "Product not found or you don't have permission to delete it" };
  }

  // Delete product
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    console.error("Error deleting product:", error);
    return { error: error.message };
  }

  revalidatePath("/seller/dashboard");
  return { success: true };
}

export async function approveSeller(sellerId: string, notes: string = "") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("sellers")
    .update({
      verification_status: "approved",
      verification_notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sellerId);

  if (error) {
    console.error("Error approving seller:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/sellers");
  revalidatePath("/seller/dashboard");
  return { success: true };
}

export async function rejectSeller(sellerId: string, notes: string = "") {
  const supabase = await createClient();

  const { error } = await supabase
    .from("sellers")
    .update({
      verification_status: "rejected",
      verification_notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sellerId);

  if (error) {
    console.error("Error rejecting seller:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/sellers");
  revalidatePath("/seller/dashboard");
  return { success: true };
}

