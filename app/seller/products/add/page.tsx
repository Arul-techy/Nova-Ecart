import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AddProductForm from "@/components/add-product-form";

export default async function AddProductPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/seller/products/add");
  }

  // Get seller data
  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .select("id, verification_status")
    .eq("user_id", user.id)
    .single();

  if (sellerError || !seller) {
    redirect("/seller/register");
  }

  if (seller.verification_status !== "approved") {
    redirect("/seller/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Add New Product</h1>
          <p className="mt-2 text-slate-600">Create a new product listing for your store</p>
        </div>
        <AddProductForm />
      </div>
    </div>
  );
}

