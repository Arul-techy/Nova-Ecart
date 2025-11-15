"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadProductImage } from "./image-upload-action";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string | null;
  price: number;
  category: string | null;
  seller_id: string | null;
}

export default function AdminProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (err) {
      console.error("Error loading products:", err);
      setMessage({ type: "error", text: "Failed to load products" });
    } finally {
      setLoading(false);
    }
  };

  function formatPriceDisplay(value: any) {
    if (value == null || value === '') return '';
    const num = Number(value);
    if (Number.isNaN(num)) return String(value);
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(num);
    const integer = Math.trunc(abs);
    const fraction = Math.round((abs - integer) * 100);
    const intStr = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (fraction > 0) {
      return `${sign}${intStr},${String(fraction).padStart(2, '0')}`;
    }
    return `${sign}${intStr}`;
  }

  const handleImageUpload = async (productId: string, file: File) => {
    if (!file) return;

    try {
      setUploading(productId);
      setMessage(null);

      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadProductImage(productId, formData);

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        const product = products.find((p) => p.id === productId);
        setMessage({ type: "success", text: result.message || "Image uploaded successfully" });
        
        // Reload products to show updated image
        setTimeout(() => loadProducts(), 500);
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload image",
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
              NE
            </div>
            <h1 className="text-xl font-bold text-indigo-600">Product Image Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/sellers"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sellers
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
        {message && (
          <div
            className={`mb-6 rounded-lg px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">No products found</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{product.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                    <span>{product.category || "Uncategorized"}</span>
                    <span>{product.price != null ? `${formatPriceDisplay(product.price)} INR` : '—'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-center text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50">
                    {uploading === product.id ? "Uploading..." : "Choose Image"}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploading === product.id}
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          handleImageUpload(product.id, file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {product.image && (
                    <p className="text-center text-xs text-green-600">✓ Image set</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
