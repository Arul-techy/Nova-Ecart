"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/(seller)/actions";
import Link from "next/link";

const categories = [
  "Electronics",
  "Home & Kitchen",
  "Fashion",
  "Beauty & Health",
  "Computers",
  "Wellness",
  "Home Office",
  "Grocery & Gourmet",
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
    >
      {pending ? "Updating Product..." : "Update Product"}
    </button>
  );
}

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [result, action] = useActionState(updateProduct, undefined as any);

  useEffect(() => {
    if (result && !result.error) {
      router.push("/seller/dashboard");
    }
  }, [result, router]);

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

  return (
    <form action={action} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" encType="multipart/form-data">
      <input type="hidden" name="product_id" value={product.id} />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">Product Title *</label>
        <input defaultValue={product.title} type="text" id="title" name="title" required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description *</label>
        <textarea defaultValue={product.description} id="description" name="description" required rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-slate-700">Product Image (leave blank to keep current)</label>
        <input type="file" id="image" name="image" accept="image/*" className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
        {product.image && (
          <div className="mt-2">
            <img src={product.image} alt={product.title} className="h-24 w-24 rounded object-cover" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price *</label>
          <input defaultValue={formatPriceDisplay(product.price)} type="text" id="price" name="price" required className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
          <select defaultValue={product.category ?? ""} id="category" name="category" className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none">
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="badge" className="block text-sm font-medium text-slate-700">Badge (Optional)</label>
        <input defaultValue={product.badge ?? ""} type="text" id="badge" name="badge" className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
      </div>

      {result?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{result.error}</div>
      )}

      <div className="flex gap-4">
        <Link href="/seller/dashboard" className="flex-1 rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</Link>
        <div className="flex-1"><SubmitButton /></div>
      </div>
    </form>
  );
}
