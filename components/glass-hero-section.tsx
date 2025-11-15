'use client';

import React from 'react';

export default function GlassHeroSection() {
  return (
    <section className="relative w-full min-h-screen pt-20 overflow-hidden flex items-center justify-center">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        {/* Top Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              ✨ Welcome to NovaEcart
            </span>
          </div>
        </div>

        {/* Hero Glass Card */}
        <div className="relative group">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl group-hover:border-white/30 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-3xl pointer-events-none" />

          {/* Content */}
          <div className="relative p-12 md:p-16 text-center space-y-8">
            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Shop Tomorrow,
                <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Today's Prices
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
                Discover a curated marketplace of premium products from verified sellers. Secure cryptocurrency payments, instant checkout, and exceptional customer service.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                Start Shopping
              </button>
              <button className="px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:border-white/40">
                Become a Seller
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-white">10K+</p>
                <p className="text-sm text-gray-300">Products</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-white">500+</p>
                <p className="text-sm text-gray-300">Sellers</p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-white">50K+</p>
                <p className="text-sm text-gray-300">Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 backdrop-blur rounded-2xl border border-blue-500/20 animate-float" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 backdrop-blur rounded-full border border-purple-500/20 animate-float-slow" />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: floatSlow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
