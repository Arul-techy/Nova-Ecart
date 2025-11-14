"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { useFormStatus } from "react-dom";
import { signOut } from "@/app/(auth)/actions";
import { useSupabase } from "@/components/supabase-provider";
import UserProfile from "@/components/user-profile";

const featuredCategories = [
  {
    name: "Electronics",
    items: ["Smartphones", "Laptops", "Smart Home", "Audio"],
  },
  {
    name: "Home & Kitchen",
    items: ["Appliances", "Cookware", "Furniture", "Décor"],
  },
  {
    name: "Fashion",
    items: ["Women", "Men", "Footwear", "Accessories"],
  },
  {
    name: "Beauty & Health",
    items: ["Skincare", "Wellness", "Grooming", "Personal Care"],
  },
];

const heroHighlights = [
  {
    title: "Prime Delivery",
    description: "Free same-day delivery on thousands of essentials.",
  },
  {
    title: "Secure Checkout",
    description: "Protected payments with trusted NovaEcart partners.",
  },
  {
    title: "24/7 Support",
    description: "Real people ready to help any time you need it.",
  },
];

const curatedCollections = [
  {
    title: "Work From Anywhere",
    summary: "Laptops, monitors, and ergonomic accessories to keep you productive.",
    cta: "Upgrade your setup",
    searchQuery: "home office essentials",
  },
  {
    title: "Spring Refresh",
    summary: "New season picks to brighten every room in your home.",
    cta: "Shop home décor",
    searchQuery: "spring home décor",
  },
  {
    title: "Everyday Essentials",
    summary: "Stock up on household must-haves with subscribe & save.",
    cta: "Explore auto-delivery",
    searchQuery: "household essentials",
  },
];

const supportTopics = [
  {
    title: "Track Orders",
    summary: "Get real-time updates on the status and delivery of your packages.",
    actionLabel: "Track now",
  },
  {
    title: "Customer Service",
    summary: "Chat with an expert or browse FAQs to quickly solve your issue.",
    actionLabel: "Contact support",
  },
  {
    title: "Returns & Orders",
    summary: "Start a return, print shipping labels, or review your past orders.",
    actionLabel: "Manage orders",
  },
  {
    title: "Prime Membership",
    summary: "Update your plan, gift Prime to a friend, or review benefits.",
    actionLabel: "Manage Prime",
  },
];

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

export default function Home() {
  const router = useRouter();
  const { session } = useSupabase();
  const curatedRef = useRef<HTMLElement | null>(null);
  const supportRef = useRef<HTMLElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const cartCount: number = 2;
  const [activeSupportTopic, setActiveSupportTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout = window.setTimeout(() => setNotification(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  const smoothScrollTo = (ref: RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSupportNavigation = (topicTitle: string) => {
    smoothScrollTo(supportRef);
    setActiveSupportTopic(topicTitle);

    const topic = supportTopics.find((item) => item.title === topicTitle);
    setNotification(
      topic
        ? `${topic.title}: ${topic.summary}`
        : "Opening NovaEcart support center.",
    );
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setNotification("Add a search term to explore NovaEcart.");
      return;
    }

    const trimmedTerm = searchTerm.trim();
    setNotification(`Searching the NovaEcart Store for “${trimmedTerm}”.`);
    router.push(`/store?query=${encodeURIComponent(trimmedTerm)}`);
  };

  const handleStartShopping = () => {
    router.push("/store");
    setNotification("Opening the NovaEcart Store.");
  };

  const handleExplorePrime = () => {
    smoothScrollTo(curatedRef);
    setNotification("Discovering NovaEcart Prime benefits.");
  };

  const handleCartClick = () => {
    setNotification(
      `You have ${cartCount} item${cartCount === 1 ? "" : "s"} in your cart.`,
    );
  };

  const handleCollectionCTA = (
    collection: (typeof curatedCollections)[number],
  ) => {
    setSearchTerm(collection.searchQuery);
    setNotification(`We’ve lined up ${collection.title} in the Store.`);
    router.push(`/store?query=${encodeURIComponent(collection.searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium text-slate-700">
            You are shopping on <span className="text-indigo-600">NovaEcart.com</span>{" "}
            · Fast delivery to your doorstep.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <button
              type="button"
              onClick={() => handleSupportNavigation("Track Orders")}
              className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-indigo-500 hover:text-indigo-600"
            >
              Track Orders
            </button>
            <button
              type="button"
              onClick={() => handleSupportNavigation("Customer Service")}
              className="rounded-full border border-slate-200 px-3 py-1 transition hover:border-indigo-500 hover:text-indigo-600"
            >
              Customer Service
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex flex-col gap-3 sm:w-72">
            <div className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white">
                NE
              </div>
              NovaEcart
            </div>
            <nav className="flex items-center gap-2 text-sm font-semibold text-slate-600">
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
            </nav>
          </div>
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-1 items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition focus-within:border-indigo-500"
            >
              <span className="hidden shrink-0 items-center px-4 text-sm font-medium text-slate-500 sm:flex">
                All
              </span>
              <input
                type="text"
                placeholder="Search for products, brands, and categories"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
                className="w-full border-0 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="hidden shrink-0 bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 md:flex"
              >
                Search
              </button>
            </form>
            <div className="flex items-center justify-between gap-4 text-sm font-medium text-slate-600 sm:w-auto">
              {session ? (
                <>
                  <div className="md:hidden">
                    <UserProfile />
                  </div>
                  <div className="hidden items-center gap-3 md:flex">
                    <UserProfile />
                    <form action={signOut}>
                      <SignOutButton />
                    </form>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="rounded-full border border-transparent px-4 py-2 transition hover:border-indigo-500 hover:text-indigo-600 md:hidden"
                  >
                    Sign in
                  </Link>
                  <div className="hidden items-center gap-3 md:flex">
                    <Link
                      href="/sign-in"
                      className="rounded-full border border-transparent px-4 py-2 transition hover:border-indigo-500 hover:text-indigo-600"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="rounded-full border border-indigo-200 px-4 py-2 text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
                    >
                      Create account
                    </Link>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => handleSupportNavigation("Returns & Orders")}
                className="rounded-full border border-transparent px-4 py-2 transition hover:border-indigo-500 hover:text-indigo-600"
              >
                Returns & Orders
              </button>
              <button
                type="button"
                onClick={handleCartClick}
                className="relative flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs text-indigo-600">
                  {cartCount}
                </span>
                Cart
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-12">
        {notification && (
          <div
            aria-live="polite"
            className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 shadow-sm"
          >
            {notification}
          </div>
        )}
        <section className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Shop by category</h2>
            <div className="space-y-6 text-sm">
              {featuredCategories.map((category) => (
                <div key={category.name}>
                  <p className="mb-1 font-semibold text-slate-700">{category.name}</p>
                  <ul className="space-y-1 text-slate-500">
                    {category.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <span>{item}</span>
                        <span aria-hidden="true">›</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6 rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-100 p-10 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  NovaEcart Prime
                </p>
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
                  Your everyday marketplace for everything you love.
                </h1>
                <p className="text-lg text-slate-600">
                  Discover millions of products with fast delivery, curated collections, and exclusive
                  member savings designed to fit your life.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleStartShopping}
                    className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    Start shopping
                  </button>
                  <button
                    type="button"
                    onClick={handleExplorePrime}
                    className="rounded-full border border-indigo-200 px-8 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
                  >
                    Explore Prime benefits
                  </button>
                  <Link
                    href="/seller/register"
                    className="rounded-full border border-indigo-200 bg-indigo-50 px-8 py-3 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-100"
                  >
                    Become a Seller
                  </Link>
                  <Link
                    href="/admin/sellers"
                    className="rounded-full border border-slate-300 bg-slate-100 px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                  >
                    Approve Sellers
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 text-sm font-medium text-slate-600 md:w-64">
                {heroHighlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <p className="text-sm font-semibold text-indigo-600">{highlight.title}</p>
                    <p className="mt-1 text-slate-500">{highlight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section ref={curatedRef} id="curated" className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Curated for you</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {curatedCollections.map((collection) => (
              <article
                key={collection.title}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                  Trending now
                </p>
                <h3 className="text-xl font-semibold text-slate-900">{collection.title}</h3>
                <p className="flex-1 text-sm text-slate-500">{collection.summary}</p>
                <button
                  type="button"
                  onClick={() => handleCollectionCTA(collection)}
                  className="self-start text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                >
                  {collection.cta} →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                Why NovaEcart
              </p>
              <h2 className="text-3xl font-bold text-slate-900">The smarter way to shop online</h2>
              <p className="text-base text-slate-600">
                Our marketplace is built to delight customers—from curated collections and member-only
                benefits to rapid checkout that fits your schedule. Join millions of shoppers who trust
                NovaEcart every day.
              </p>
            </div>
            <dl className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-indigo-50 p-6">
                <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  50M+ Products
                </dt>
                <dd className="mt-3 text-sm text-slate-600">
                  A vast catalog across electronics, fashion, home, and exclusive NovaEcart brands.
                </dd>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-6">
                <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  30 Countries
                </dt>
                <dd className="mt-3 text-sm text-slate-600">
                  Shop globally with localized support, currency, and shipping options.
                </dd>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-6">
                <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  4.8/5 Rating
                </dt>
                <dd className="mt-3 text-sm text-slate-600">
                  Customers love our fast delivery, curated picks, and responsive service.
                </dd>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-6">
                <dt className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  Climate First
                </dt>
                <dd className="mt-3 text-sm text-slate-600">
                  Carbon-neutral packaging and optimized logistics for a greener future.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          ref={supportRef}
          id="support"
          className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500">
                Need assistance?
              </p>
              <h2 className="text-3xl font-bold text-slate-900">Support that follows through</h2>
              <p className="mt-2 text-sm text-slate-500">
                Select a topic to get quick answers, live chat, or step-by-step guidance from our team.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setNotification("Support team is available 24/7 at support@novaecart.com.")
              }
              className="self-start rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              Email support@novaecart.com
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {supportTopics.map((topic) => {
              const isActive = topic.title === activeSupportTopic;
              return (
                <article
                  key={topic.title}
                  className={`rounded-3xl border p-6 transition ${
                    isActive
                      ? "border-indigo-400 bg-indigo-50 shadow-md"
                      : "border-slate-200 bg-slate-50 hover:border-indigo-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{topic.title}</h3>
                    {isActive && (
                      <span className="rounded-full border border-indigo-300 bg-white px-3 py-1 text-xs font-semibold text-indigo-600">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{topic.summary}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSupportTopic(topic.title);
                      setNotification(`${topic.title} assistance is on the way.`);
                    }}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500"
                  >
                    {topic.actionLabel} →
                  </button>
                </article>
              );
            })}
          </div>
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
              Shop smarter with NovaEcart—your trusted destination for inspired living.
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
