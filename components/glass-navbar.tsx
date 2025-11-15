'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart-context';
import CartDrawer from '@/components/cart-drawer';

export default function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const cart = useCart();

  useEffect(() => {
    const handler = () => {
      setPulse(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setPulse(false), 700) as unknown as number;
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('novaecart:item-added', handler as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('novaecart:item-added', handler as EventListener);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/store' },
    { label: 'Sellers', href: '/seller/register' },
    { label: 'About', href: '#about' },
  ];

  return (
    <nav className="fixed w-full top-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 to-slate-800/30 backdrop-blur-xl border-b border-white/10 shadow-2xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              NovaEcart
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-200 hover:text-white transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>


          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen((s) => !s)}
              className={`relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group ${pulse ? 'animate-pulse' : ''}`}
              aria-label="Open cart"
            >
              <span className="text-gray-200 group-hover:text-white">🛒</span>
              {mounted && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{cart?.count ?? 0}</span>
              )}
            </button>

            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300">
              <span className="text-gray-200 hover:text-white">👤</span>
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <span className="text-gray-200">{isOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
            <div className="flex flex-col py-4 px-4 gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-200 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Cart drawer rendered at top level of navbar so it overlays content */}
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
