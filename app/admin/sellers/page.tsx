import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import SellerApprovalList from "@/components/seller-approval-list";

export default async function AdminSellersPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/admin/sellers");
  }

  // Get all pending sellers
  const { data: pendingSellers, error: pendingError } = await supabase
    .from("sellers")
    .select("*")
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false });

  // Get all sellers for overview
  const { data: allSellers, error: allError } = await supabase
    .from("sellers")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
              NE
            </div>
            <h1 className="text-xl font-bold text-indigo-600">Seller Approval</h1>
          </div>
          <div className="flex items-center gap-4">
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
        <SellerApprovalList 
          pendingSellers={pendingSellers || []} 
          allSellers={allSellers || []}
        />
      </main>
    </div>
  );
}

