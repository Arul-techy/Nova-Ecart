"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "@/app/(auth)/actions";
import { useSupabase } from "@/components/supabase-provider";
import UserProfile from "@/components/user-profile";
import { fetchActiveProducts, type Product } from "@/lib/supabase/products";

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700 disabled:cursor-not-allowed disabled:border-indigo-100 disabled:text-indigo-300"
      disabled={pending}
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

function UnauthenticatedStore() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in to shop NovaEcart</h1>
          <p className="text-sm text-slate-600">
            Create an account or sign in to access your personalized store experience, saved carts, and
            exclusive member pricing.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sign-in?next=/store"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inboundQuery = searchParams.get("query") ?? "";

  const { session } = useSupabase();
  const [searchTerm, setSearchTerm] = useState(inboundQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [notification, setNotification] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Supabase
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchActiveProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadProducts();
    }
  }, [session]);

  useEffect(() => {
    setSearchTerm(inboundQuery);
  }, [inboundQuery]);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout = window.setTimeout(() => setNotification(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    );
    return ["All", ...uniqueCategories] as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = searchTerm
        ? product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTerm = searchTerm.trim();
    router.replace(trimmedTerm ? `/store?query=${encodeURIComponent(trimmedTerm)}` : "/store");
    setNotification(
      trimmedTerm
        ? `Showing results for “${trimmedTerm}”.`
        : "Showing the latest products across NovaEcart.",
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setNotification(category === "All" ? "Showing all categories." : `Filtering by ${category}.`);
  };

  const handleAddToCart = (product: Product) => {
    setCartCount((count) => count + 1);
    setNotification(`${product.title} added to your cart.`);
  };

  const handleBuyNow = async (product: Product) => {
    try {
      setNotification("Processing payment...");
      
      const response = await fetch("/api/cryptomus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          amount: product.price,
          currency: "USDT",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // Redirect to Cryptomus payment page
      if (data.result?.url) {
        window.location.href = data.result.url;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setNotification(
        err instanceof Error ? err.message : "Failed to process payment. Please try again."
      );
    }
  };

  if (!session) {
    return <UnauthenticatedStore />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-2xl font-bold text-indigo-600">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
              NE
            </div>
            NovaEcart Store
          </div>
          <div className="flex flex-col items-start gap-3 text-sm font-semibold text-slate-600 sm:flex-row sm:items-center sm:gap-6">
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-full px-4 py-2 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                href="/store"
                className="rounded-full bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500"
              >
                Store
              </Link>
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-indigo-600">
                Cart {cartCount}
              </span>
            </nav>
            <div className="flex w-full items-center justify-between gap-3 text-xs font-medium text-slate-600 sm:w-auto">
              <UserProfile />
              <form action={signOut}>
                <SignOutButton />
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-24 pt-12">
        <section className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-100 p-10 shadow-lg">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                NovaEcart Marketplace
              </p>
              <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                Discover essentials, exclusives, and everyday wins.
              </h1>
              <p className="text-lg text-slate-600">
                Browse curated collections, unlock member savings, and bring home the products that fit
                your life. Filter by category, search for anything, and add favorites to your cart in one
                place.
              </p>
            </div>
            <div className="rounded-3xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
              <p className="text-sm font-semibold text-indigo-600">Need help?</p>
              <p className="mt-2">
                Chat with NovaEcart specialists or schedule a virtual appointment to find the perfect
                product for you.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
              >
                Visit support →
              </Link>
            </div>
          </div>
        </section>

        {notification && (
          <div
            aria-live="polite"
            className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 shadow-sm"
          >
            {notification}
          </div>
        )}

        <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex w-full flex-1 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                type="search"
                placeholder="Search by product, brand, or descriptor"
                className="w-full border-0 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Search store
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-600">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full border px-4 py-2 transition ${
                    selectedCategory === category
                      ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">All products</h2>
              <p className="text-sm text-slate-500">
                {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"} ready to ship.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
            >
              Back to homepage →
            </Link>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <p className="text-lg font-semibold text-slate-700">Loading products...</p>
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
              <p className="text-lg font-semibold text-red-700">{error}</p>
              <p className="mt-2 text-sm text-red-600">
                Please refresh the page or contact support if the issue persists.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <p className="text-lg font-semibold text-slate-700">
                {products.length === 0 ? "No products available." : "No matching products found."}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {products.length === 0
                  ? "Check back later for new products."
                  : "Try adjusting your search or exploring a different category."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  {product.image && (
                    <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Hide image on error
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs font-semibold">
                    {product.category && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                        {product.category}
                      </span>
                    )}
                    {product.badge && (
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{product.description}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-2xl font-bold text-slate-900">
                      {product.price} USDT
                    </span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                    Available
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
                    >
                      Add to cart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                      Buy now
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-900 py-10 text-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xl font-semibold text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm">
                NE
              </div>
              NovaEcart
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Thanks for shopping NovaEcart—your trusted destination for inspired living.
            </p>
          </div>
          <div className="grid gap-6 text-sm text-slate-400 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Company</p>
              <ul className="mt-3 space-y-2">
                <li>About</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Support</p>
              <ul className="mt-3 space-y-2">
                <li>Help Center</li>
                <li>Shipping</li>
                <li>Returns</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-200">Legal</p>
              <ul className="mt-3 space-y-2">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Accessibility</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} NovaEcart. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
