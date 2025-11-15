'use client';

import GlassNavbar from '@/components/glass-navbar';
import GlassCard from '@/components/glass-card';
import GlassHeroSection from '@/components/glass-hero-section';
import GlassDashboardPanel from '@/components/glass-dashboard';

export default function GlassComponentsDemo() {
  return (
    <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Navbar */}
      <GlassNavbar />

      {/* Hero Section */}
      <GlassHeroSection />

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-20 z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
          <p className="text-gray-300">Browse our curated selection of premium items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard
            icon="📱"
            title="Latest Phones"
            description="Premium smartphones from verified sellers with warranty"
            price="$299+"
            badge="Popular"
            imageSrc="https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=300&fit=crop"
          />
          <GlassCard
            icon="⌚"
            title="Smart Watches"
            description="Advanced wearables for your active lifestyle"
            price="$199+"
            badge="Trending"
            imageSrc="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
          />
          <GlassCard
            icon="🎧"
            title="Audio Gear"
            description="Crystal clear sound with premium quality headphones"
            price="$149+"
            badge="New"
            imageSrc="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
          />
        </div>
      </section>

      {/* Dashboard Stats Section */}
      <section className="relative max-w-7xl mx-auto px-4 py-20 z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Dashboard Overview</h2>
          <p className="text-gray-300">Real-time marketplace statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassDashboardPanel
            title="Total Sales"
            value="$12,450"
            icon="💰"
            trend="up"
            trendValue="12.5%"
          />
          <GlassDashboardPanel
            title="Orders"
            value="1,234"
            icon="📦"
            trend="up"
            trendValue="8.2%"
          />
          <GlassDashboardPanel
            title="Customers"
            value="5,678"
            icon="👥"
            trend="down"
            trendValue="2.1%"
          />
          <GlassDashboardPanel
            title="Conversion"
            value="3.24%"
            icon="📈"
            trend="up"
            trendValue="1.8%"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto px-4 py-12 z-10 border-t border-white/10 mt-20">
        <div className="text-center text-gray-400">
          <p>© 2025 NovaEcart. All glass components are production-ready with full responsiveness.</p>
        </div>
      </footer>
    </main>
  );
}
