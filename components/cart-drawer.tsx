'use client';

import React from 'react';
import { useCart } from './cart-context';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cart = useCart();

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-96 max-w-full bg-white/6 backdrop-blur-lg border-l border-white/10 text-white p-6 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-sm text-gray-300 hover:text-white">Close</button>
        </div>

        {cart.items.length === 0 ? (
          <div className="py-12 text-center text-gray-300">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {cart.items.map((it) => (
              <div key={it.id} className="flex gap-3 items-center">
                <div className="w-16 h-16 bg-white/10 rounded overflow-hidden flex items-center justify-center">
                  {it.product?.image ? (
                    <img src={it.product.image} alt={it.product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300">No Image</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{it.product?.title ?? it.id}</div>
                  <div className="text-sm text-gray-300">Qty: {it.quantity}</div>
                  <div className="text-sm text-gray-300">Price: {it.product?.price != null ? `${formatPriceDisplay(it.product.price)} INR` : '—'}</div>
                </div>
                <div>
                  <button
                    onClick={() => cart.removeFromCart(it.id)}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Total</div>
                <div className="font-semibold">{formatPriceDisplay(cart.items.reduce((s, it) => s + (Number(it.product?.price ?? 0) * it.quantity), 0))} INR</div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => { cart.clearCart(); onClose(); }}
                  className="flex-1 rounded-full border border-white/10 px-4 py-2 text-sm text-white"
                >
                  Clear
                </button>
                <button
                  onClick={() => { alert('Checkout coming soon'); }}
                  className="flex-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
