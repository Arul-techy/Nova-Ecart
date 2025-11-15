'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from 'react';
import { useFormStatus } from 'react-dom';
import { signOut } from '@/app/(auth)/actions';
import { useSupabase } from '@/components/supabase-provider';
import UserProfile from '@/components/user-profile';
import { useCart } from '@/components/cart-context';
import GlassNavbar from '@/components/glass-navbar';
import GlassCard from '@/components/glass-card';

const featuredCategories = [
  {
    name: 'Electronics',
    items: ['Smartphones', 'Laptops', 'Smart Home', 'Audio'],
  },
  {
    name: 'Home & Kitchen',
    items: ['Appliances', 'Cookware', 'Furniture', 'Décor'],
  },
  {
    name: 'Fashion',
    items: ['Women', 'Men', 'Footwear', 'Accessories'],
  },
  {
    name: 'Beauty & Health',
    items: ['Skincare', 'Wellness', 'Grooming', 'Personal Care'],
  },
];

const heroHighlights = [
  {
    title: 'Prime Delivery',
    description: 'Free same-day delivery on thousands of essentials.',
  },
  {
    title: 'Secure Checkout',
    description: 'Protected payments with trusted NovaEcart partners.',
  },
  {
    title: '24/7 Support',
    description: 'Real people ready to help any time you need it.',
  },
];

const curatedCollections = [
  {
    title: 'Work From Anywhere',
    summary: 'Laptops, monitors, and ergonomic accessories to keep you productive.',
    cta: 'Upgrade your setup',
    searchQuery: 'home office essentials',
  },
  {
    title: 'Spring Refresh',
    summary: 'New season picks to brighten every room in your home.',
    cta: 'Shop home décor',
    searchQuery: 'spring home décor',
  },
  {
    title: 'Everyday Essentials',
    summary: 'Stock up on household must-haves with subscribe & save.',
    cta: 'Explore auto-delivery',
    searchQuery: 'household essentials',
  },
];

const supportTopics = [
  {
    title: 'Track Orders',
    summary: 'Get real-time updates on the status and delivery of your packages.',
    actionLabel: 'Track now',
  },
  {
    title: 'Customer Service',
    summary: 'Chat with an expert or browse FAQs to quickly solve your issue.',
    actionLabel: 'Contact support',
  },
  {
    title: 'Returns & Orders',
    summary: 'Start a return, print shipping labels, or review your past orders.',
    actionLabel: 'Manage orders',
  },
  {
    title: 'Prime Membership',
    summary: 'Update your plan, gift Prime to a friend, or review benefits.',
    actionLabel: 'Manage Prime',
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
      {pending ? 'Signing out...' : 'Sign out'}
    </button>
  );
}

export default function HomePageGlass() {
  const router = useRouter();
  const { session } = useSupabase();
  const curatedRef = useRef<HTMLElement | null>(null);
  const supportRef = useRef<HTMLElement | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const cart = useCart();
  const cartCount: number = cart?.count ?? 0;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const [activeSupportTopic, setActiveSupportTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timeout = window.setTimeout(() => setNotification(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [notification]);

  const smoothScrollTo = (ref: RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSupportNavigation = (topicTitle: string) => {
    smoothScrollTo(supportRef);
    setActiveSupportTopic(topicTitle);

    const topic = supportTopics.find((item) => item.title === topicTitle);
    setNotification(
      topic
        ? `${topic.title}: ${topic.summary}`
        : 'Opening NovaEcart support center.',
    );
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setNotification('Add a search term to explore NovaEcart.');
      return;
    }

    const trimmedTerm = searchTerm.trim();
    setNotification(`Searching the NovaEcart Store for "${trimmedTerm}".`);
    router.push(`/store?query=${encodeURIComponent(trimmedTerm)}`);
  };

  const handleStartShopping = () => {
    router.push('/store');
    setNotification('Opening the NovaEcart Store.');
  };

  const handleExplorePrime = () => {
    smoothScrollTo(curatedRef);
    setNotification('Discovering NovaEcart Prime benefits.');
  };

  const handleCartClick = () => {
    setNotification(
      `You have ${isMounted ? cartCount : 0} item${isMounted && cartCount === 1 ? '' : 's'} in your cart.`,
    );
  };

  const handleCollectionCTA = (
    collection: (typeof curatedCollections)[number],
  ) => {
    setSearchTerm(collection.searchQuery);
    setNotification(`We've lined up ${collection.title} in the Store.`);
    router.push(`/store?query=${encodeURIComponent(collection.searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Glass Navbar */}
      <GlassNavbar />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-24">
        {/* Notification */}
        {notification && (
          <div
            aria-live="polite"
            className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 text-sm font-medium text-white shadow-xl animate-in"
          >
            {notification}
          </div>
        )}

        {/* Glass Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl group-hover:border-white/30 transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl pointer-events-none" />

            <div className="relative p-12 md:p-16 space-y-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                    NovaEcart Prime
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Discover essentials,
                    <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                      exclusives, and everyday wins
                    </span>
                  </h1>
                  <p className="text-lg text-gray-200">
                    Millions of products from verified sellers with secure crypto payments, fast delivery, and 24/7 support.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row pt-4">
                    <button
                      type="button"
                      onClick={handleStartShopping}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                    >
                      Start Shopping
                    </button>
                    <button
                      type="button"
                      onClick={handleExplorePrime}
                      className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300"
                    >
                      Explore Benefits
                    </button>
                    <Link
                      href="/seller/register"
                      className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300 text-center"
                    >
                      Become a Seller
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 md:w-80">
                  {heroHighlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <p className="text-sm font-semibold text-blue-300">{highlight.title}</p>
                      <p className="mt-1 text-sm text-gray-200">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Glass Search */}
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
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Search Store
            </button>
          </form>
        </section>

        {/* Curated Collections */}
        <section ref={curatedRef} id="curated" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white">Curated for you</h2>
            <p className="text-gray-300">Personalized collections based on your preferences</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {curatedCollections.map((collection) => (
              <div
                key={collection.title}
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105 h-full"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:border-white/40 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 pointer-events-none" />

                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                      Trending
                    </p>
                    <h3 className="text-xl font-bold text-white mt-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {collection.title}
                    </h3>
                    <p className="text-gray-200 text-sm mt-2">{collection.summary}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCollectionCTA(collection)}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-300 group-hover:text-purple-300 transition-colors duration-300"
                  >
                    {collection.cta} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Glass Stats Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" />
          <div className="relative p-12 md:p-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                  Why NovaEcart
                </p>
                <h2 className="text-3xl font-bold text-white">The smarter way to shop online</h2>
                <p className="text-base text-gray-200">
                  Our marketplace is built to delight customers—from curated collections and member-only benefits to rapid checkout that fits your schedule.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { label: '50M+ Products', desc: 'Across all categories' },
                  { label: '30 Countries', desc: 'Global shipping' },
                  { label: '4.8/5 Rating', desc: 'Customer satisfaction' },
                  { label: 'Crypto Ready', desc: 'Secure payments' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
                  >
                    <dt className="text-sm font-semibold uppercase tracking-wide text-blue-300">
                      {stat.label}
                    </dt>
                    <dd className="mt-3 text-sm text-gray-200">{stat.desc}</dd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Glass Support Section */}
        <section
          ref={supportRef}
          id="support"
          className="relative"
        >
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl" />
          <div className="relative p-12 md:p-16">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Need assistance?
              </p>
              <h2 className="text-3xl font-bold text-white mt-2">Support that follows through</h2>
              <p className="mt-2 text-gray-300">
                Available 24/7 to help with any questions or concerns.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {supportTopics.map((topic) => {
                const isActive = topic.title === activeSupportTopic;
                return (
                  <article
                    key={topic.title}
                    className={`rounded-2xl backdrop-blur-md border p-6 transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 border-white/40 shadow-lg'
                        : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
                      {isActive && (
                        <span className="rounded-full bg-blue-500/20 border border-blue-300 px-3 py-1 text-xs font-semibold text-blue-300">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-200">{topic.summary}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSupportTopic(topic.title);
                        setNotification(`${topic.title} assistance is on the way.`);
                      }}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-300 hover:text-purple-300 transition-colors duration-300"
                    >
                      {topic.actionLabel} →
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Glass Footer */}
      <footer className="relative mt-20 border-t border-white/10 bg-gradient-to-b from-slate-900 to-black py-12">
        <div className="mx-auto max-w-6xl px-4">
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
