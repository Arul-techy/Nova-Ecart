import { createClient } from "@/lib/supabase/client";

export type Seller = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  mobile: string;
  photo_url: string | null;
  home_address: string;
  pickup_address: string;
  gstin: string | null;
  pan_card: string;
  business_name: string;
  bank_account_number: string;
  ifsc_code: string;
  bank_statement_url: string | null;
  address_proof_url: string | null;
  trademark_certificate_url: string | null;
  authorization_letter_url: string | null;
  verification_status: "pending" | "approved" | "rejected";
  verification_notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getSellerByUserId(userId: string): Promise<Seller | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getSellerProducts(sellerId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seller products:", error);
    throw error;
  }

  return data || [];
}

