import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SellerRegistrationForm from "@/components/seller-registration-form";

export default async function SellerRegisterPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/seller/register");
  }

  // Check if seller already exists
  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (seller) {
    redirect("/seller/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Become a Seller</h1>
          <p className="mt-2 text-slate-600">
            Register your business and start selling on NovaEcart
          </p>
        </div>
        <SellerRegistrationForm />
      </div>
    </div>
  );
}

