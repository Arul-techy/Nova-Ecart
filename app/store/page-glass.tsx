"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "@/app/(auth)/actions";
import { useSupabase } from "@/components/supabase-provider";
import UserProfile from "@/components/user-profile";
import { useCart } from "@/components/cart-context";
import { fetchActiveProducts, type Product } from "@/lib/supabase/products";
import GlassNavbar from "@/components/glass-navbar";
import GlassCard from "@/components/glass-card";

function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:border-blue-200 hover:text-white disabled:cursor-not-allowed disabled:border-blue-100 disabled:text-blue-200"
      disabled={pending}
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}

function UnauthenticatedStoreGlass() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 text-center shadow-2xl">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">Sign in to shop</h1>
          <p className="text-sm text-gray-200">
            Create an account or sign in to access your personalized store experience.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/sign-in?next=/store"
            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:shadow-lg"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full border border-blue-300 px-5 py-2 text-sm font-semibold text-blue-300 transition hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function StorePageGlass() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inboundQuery = searchParams.get("query") ?? "";

  const { session } = useSupabase();
  const [searchTerm, setSearchTerm] = useState(inboundQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [notification, setNotification] = useState<string | null>(null);
  const cart = useCart();
  const cartCount = cart?.count ?? 0;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setNotification("Enter a search term to explore products.");
      return;
    }
    const trimmedTerm = searchTerm.trim();
    setNotification(`Searching for "${trimmedTerm}".`);
    router.push(`/store?query=${encodeURIComponent(trimmedTerm)}`);
  };

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || "Uncategorized"));
    return ["All", ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let results = products;

    if (selectedCategory !== "All") {
      results = results.filter((p) => (p.category || "Uncategorized") === selectedCategory);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.title?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query),
      );
    }

    return results;
  }, [products, selectedCategory, searchTerm]);

  const handleAddToCart = (product: Product) => {
    if (cart) {
      cart.addToCart(product);
    }
    setNotification(`Added "${product.title}" to your cart.`);
  };

  const handleBuyNow = (product: Product) => {
    if (cart) {
      cart.addToCart(product);
    }
    setNotification(`Proceeding to checkout for "${product.title}".`);
    router.push("/checkout");
  };

  if (!session) {
    return <UnauthenticatedStoreGlass />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Glass Navbar */}
      <GlassNavbar />

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 pt-24">
        {/* Notification */}
        {notification && (
          <div
            aria-live="polite"
            className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-sm font-medium text-white shadow-xl"
          >
            {notification}
          </div>
        )}

        {/* Glass Header Section */}
        <section className="relative group">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl group-hover:border-white/30 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl pointer-events-none" />

          <div className="relative p-10 md:p-12">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                NovaEcart Marketplace
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Discover essentials, exclusives, and everyday wins.
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl">
                Browse curated collections from verified sellers with secure cryptocurrency payments, fast delivery, and 24/7 support.
              </p>
            </div>
          </div>
        </section>

        {/* Glass Search Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" />
          <form
            onSubmit={handleSearchSubmit}
            className="relative p-8 flex flex-col sm:flex-row gap-4 items-center"
          >
            <input
              type="text"
              placeholder="Search by product, brand, or descriptor"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Search
            </button>
          </form>
        </section>

        {/* Glass Category Filter */}
        <section className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" />
          <div className="relative p-8 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-white/10 backdrop-blur-md border border-white/20 text-gray-200 hover:bg-white/20 hover:border-white/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" />
            <div className="relative p-12 text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin" />
              <p className="mt-4 text-gray-300">Loading products...</p>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <section className="relative">
            <div className="absolute inset-0 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-3xl" />
            <div className="relative p-8 text-center">
              <p className="text-red-200">{error}</p>
            </div>
          </section>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
              </h2>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105"
                  >
                    {/* Glass Background */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:border-white/40 transition-all duration-300 rounded-2xl" />

                    {/* Content */}
                    <div className="relative p-4 h-full flex flex-col justify-between">
                      {/* Product Image */}
                      {product.image && (
                        <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-white/10 flex items-center justify-center">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-200 text-sm line-clamp-2">{product.description}</p>

                        {/* Price */}
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text">
                            ${product.price}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-sm font-semibold text-blue-300 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                        >
                          Add to cart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBuyNow(product)}
                          className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white hover:shadow-lg transition-all duration-300"
                        >
                          Buy now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <section className="relative">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" />
                <div className="relative p-12 text-center">
                  <p className="text-gray-300 text-lg">No products found. Try a different search!</p>
                </div>
              </section>
            )}
          </section>
        )}
      </main>

      {/* Glass Footer */}
      <footer className="relative border-t border-white/10 bg-gradient-to-b from-slate-900 to-black py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold text-white">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-sm">
                  N
                </div>
                NovaEcart
              </div>
              <p className="mt-3 text-sm text-gray-400">
                Your marketplace for everything you love.
              </p>
            </div>
            {[
              { title: 'Company', links: ['About', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Shipping', 'Returns'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Accessibility'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold uppercase tracking-wide text-white">
                  {col.title}
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-400">
                  {col.links.map((link) => (
                    <li key={link} className="hover:text-white transition-colors cursor-pointer">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-gray-500 border-t border-white/10 pt-8">
            © {new Date().getFullYear()} NovaEcart. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
