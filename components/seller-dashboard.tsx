"use client";

import Link from "next/link";
import { deleteProduct } from "@/app/(seller)/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Seller = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  photo_url: string | null;
  business_name: string;
  verification_status: "pending" | "approved" | "rejected";
  verification_notes: string | null;
};

type Product = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  price: number;
  status: string;
  category: string | null;
  badge: string | null;
  created_at: string;
};

export default function SellerDashboard({
  seller,
  products,
}: {
  seller: Seller;
  products: Product[];
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeleting(productId);
    const result = await deleteProduct(productId);
    setDeleting(null);

    if (result?.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-slate-100 text-slate-700";
      case "sold_out":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Seller Profile Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {seller.photo_url ? (
              <img
                src={seller.photo_url}
                alt={seller.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-semibold text-white">
                {seller.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">{seller.name}</h2>
              <p className="text-sm text-slate-600">{seller.business_name}</p>
              <p className="text-sm text-slate-500">{seller.email}</p>
              <p className="text-sm text-slate-500">{seller.mobile}</p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getVerificationColor(
                seller.verification_status
              )}`}
            >
              {seller.verification_status.charAt(0).toUpperCase() +
                seller.verification_status.slice(1)}
            </span>
            {seller.verification_notes && (
              <p className="mt-2 text-xs text-slate-500">{seller.verification_notes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Your Products</h2>
            <p className="mt-1 text-sm text-slate-600">
              {products.length} product{products.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          {seller.verification_status === "approved" ? (
            <Link
              href="/seller/products/add"
              className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Add Product
            </Link>
          ) : (
            <button
              disabled
              className="rounded-full bg-slate-300 px-6 py-2 text-sm font-semibold text-slate-500 cursor-not-allowed"
            >
              Add Product (Approval Required)
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">No products yet</p>
            <p className="mt-2 text-sm text-slate-500">
              {seller.verification_status === "approved"
                ? "Add your first product to start selling"
                : "Your account must be approved before you can add products"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-slate-900">{product.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {product.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">{product.price} USDT</p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                      className="rounded-lg bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-200 disabled:opacity-50"
                    >
                      {deleting === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

