// ============================================
// Cart Badge — React component for live cart count
// Used in both sidebar and mobile nav
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { getCartCount } from '@/lib/cart-store';

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial count
    setCount(getCartCount());

    // Listen for cart updates
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCount(detail?.count ?? getCartCount());
    };
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <a
      href="/cart"
      className="nav-item relative flex items-center gap-3"
      style={{ textDecoration: 'none' }}
    >
      <div className="relative">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-adsun-orange text-adsun-black text-[10px] font-bold flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span>Košík</span>
    </a>
  );
}

// Standalone badge for mobile nav
export function CartBadgeMobile() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setCount(detail?.count ?? getCartCount());
    };
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  return (
    <a href="/cart" className="flex flex-col items-center gap-0.5 text-[10px] font-medium" style={{ color: '#666', textDecoration: 'none', padding: '4px 8px', transition: 'color 0.2s' }}>
      <div className="relative">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-adsun-orange text-adsun-black text-[9px] font-bold flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </div>
      <span>Košík</span>
    </a>
  );
}
