"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { addProduct } from "@/app/(seller)/actions";
import Link from "next/link";

const initialState: { error?: string } | undefined = undefined;

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
      {pending ? "Adding Product..." : "Add Product"}
    </button>
  );
}

export default function AddProductForm() {
  const router = useRouter();
  const [errorMessage, formAction] = useActionState(addProduct, initialState);

  // Redirect on success
  useEffect(() => {
    if (errorMessage && !errorMessage.error) {
      router.push("/seller/dashboard");
    }
  }, [errorMessage, router]);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Product Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Describe your product"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-slate-700">
            Product Image *
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">
              Price (USDT) *
            </label>
            <select
              id="price"
              name="price"
              required
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select price</option>
              <option value="1">1 USDT</option>
              <option value="2">2 USDT</option>
              <option value="3">3 USDT</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="badge" className="block text-sm font-medium text-slate-700">
            Badge (Optional)
          </label>
          <input
            type="text"
            id="badge"
            name="badge"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="e.g., Deal of the Day, Top Seller"
          />
        </div>
      </div>

      {errorMessage?.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage.error}
        </div>
      )}

      <div className="flex gap-4">
        <Link
          href="/seller/dashboard"
          className="flex-1 rounded-full border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>
        <div className="flex-1">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

