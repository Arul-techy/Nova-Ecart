import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SellerDashboard from "@/components/seller-dashboard";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/seller/dashboard");
  }

  // Get seller data
  const { data: seller, error: sellerError } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (sellerError || !seller) {
    redirect("/seller/register");
  }

  // Get seller products
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("seller_id", seller.id)
    .order("created_at", { ascending: false });
  // If price is stored as integer cents, convert to float for UI
  const normalizedProducts = (products || []).map((p: any) => {
    try {
      if (p && typeof p.price === 'number') {
        return { ...p, price: Number((p.price as number) / 100) };
      }
    } catch {
      // ignore
    }
    return p;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
              NE
            </div>
            <h1 className="text-xl font-bold text-indigo-600">Seller Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/store"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Store
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <SellerDashboard seller={seller} products={normalizedProducts || []} />
      </main>
    </div>
  );
}

