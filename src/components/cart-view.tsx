// ============================================
// Cart View — Shows all items + bulk submit
// Files from IndexedDB are uploaded via FormData
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { getCartItems, removeFromCart, updateCartItemQuantity, clearCart, type CartItem } from '@/lib/cart-store';
import { getCartItemFiles, getAllCartFiles } from '@/lib/cart-files';

export default function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fileCounts, setFileCounts] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setItems(getCartItems());
    loadFileCounts();
  }, []);

  async function loadFileCounts() {
    try {
      const allFiles = await getAllCartFiles();
      const counts: Record<string, number> = {};
      allFiles.forEach((files, cartItemId) => {
        if (files.length > 0) counts[cartItemId] = files.length;
      });
      setFileCounts(counts);
    } catch {
      // silently ignore
    }
  }

  function refreshItems() {
    setItems(getCartItems());
    loadFileCounts();
  }

  function handleRemove(itemId: string) {
    removeFromCart(itemId);
    refreshItems();
  }

  function handleQuantityChange(itemId: string, newQty: number) {
    updateCartItemQuantity(itemId, newQty);
    refreshItems();
  }

  async function handleSubmitAll() {
    if (items.length === 0) return;
    setSubmitting(true);
    setResult(null);
    setUploadProgress('');

    try {
      // Collect all files from IndexedDB
      const allFiles: File[] = [];
      for (const item of items) {
        const itemFiles = await getCartItemFiles(item.id);
        allFiles.push(...itemFiles);
      }

      const orderPayload = {
        isMultiProduct: true,
        products: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productType: item.productType,
          variantId: item.variantId || null,
          variantName: item.variantName || null,
          quantity: item.quantity,
          parameters: item.parameters || {},
          notes: item.notes || '',
          fileNames: item.fileNames || [],
          categoryId: item.categoryId || null,
          categoryName: item.categoryName || null,
        })),
        notes: '',
      };

      let res: Response;

      if (allFiles.length > 0) {
        // Upload files + order data via FormData
        setUploadProgress(`Nahrávam ${allFiles.length} súborov...`);
        const formData = new FormData();
        formData.append('orderData', JSON.stringify(orderPayload));
        for (const file of allFiles) {
          formData.append('files', file);
        }
        res = await fetch('/api/proxy/products/order', {
          method: 'POST',
          // Don't set Content-Type — browser auto-sets it with boundary
          body: formData,
        });
      } else {
        // No files — send JSON (backward compatible)
        res = await fetch('/api/proxy/products/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
      }

      setUploadProgress('');
      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        refreshItems();
        setResult({
          success: true,
          message: `Projekt ${data.projectNumber} s ${data.calculationCount || items.length} kalkuláciami bol vytvorený.${data.filesCount ? ` ${data.filesCount} súborov bolo nahraných.` : ''} Budete notifikovaný keď budú cenové ponuky pripravené.`,
        });
      } else {
        setResult({ success: false, message: data.error || 'Chyba pri odosielaní objednávky' });
      }
    } catch {
      setResult({ success: false, message: 'Chyba pripojenia k serveru' });
    } finally {
      setSubmitting(false);
      setUploadProgress('');
    }
  }

  if (result?.success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-green-400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-white text-xl font-semibold mb-2">Objednávka odoslaná!</h2>
          <p className="text-green-400 text-sm mb-6">{result.message}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="/quotes" className="btn-primary text-sm px-5 py-2">
              Zobraziť cenové ponuky →
            </a>
            <a href="/products" className="btn-secondary text-sm px-5 py-2">
              Pokračovať v nákupe
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-adsun-muted mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <h2 className="text-white text-xl font-semibold mb-2">Košík je prázdny</h2>
          <p className="text-adsun-muted text-sm mb-6">Pridajte produkty z katalógu.</p>
          <a href="/products" className="btn-primary text-sm px-5 py-2">
            Zobraziť produkty →
          </a>
        </div>
      </div>
    );
  }

  // Total file count across all items
  const totalFileCount = Object.values(fileCounts).reduce((sum, c) => sum + c, 0);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Error message */}
      {result && !result.success && (
        <div className="rounded-lg p-4 text-sm bg-red-500/10 border border-red-500/30 text-red-400">
          {result.message}
        </div>
      )}

      {/* Cart items */}
      {items.map((item, idx) => {
        const itemFileCount = fileCounts[item.id] || (item.fileNames?.length || 0);
        return (
          <div key={item.id} className="glass-card p-5 animate-in" style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}>
            <div className="flex items-start justify-between gap-4">
              {/* Product info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-medium truncate">{item.productName}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide ${
                    item.productType === 'product'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'bg-adsun-orange/15 text-adsun-orange border border-adsun-orange/30'
                  }`}>
                    {item.productType === 'product' ? 'Produkt' : 'Šablóna'}
                  </span>
                </div>

                {/* Variant name */}
                {item.variantName && (
                  <p className="text-adsun-muted text-xs mb-2">Variant: {item.variantName}</p>
                )}

                {/* Parameters summary */}
                {item.parameters && Object.keys(item.parameters).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {Object.entries(item.parameters)
                      .filter(([, v]) => v)
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <span key={key} className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-adsun-muted border border-white/5">
                          {key}: {value}
                        </span>
                      ))}
                    {Object.keys(item.parameters).length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-adsun-muted">
                        +{Object.keys(item.parameters).length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <p className="text-adsun-muted text-xs italic">📝 {item.notes}</p>
                )}

                {/* Files */}
                {itemFileCount > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5 text-adsun-orange" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                    </svg>
                    <span className="text-adsun-muted text-xs">
                      {itemFileCount} {itemFileCount === 1 ? 'súbor' : itemFileCount < 5 ? 'súbory' : 'súborov'}
                    </span>
                    {item.fileNames && item.fileNames.length > 0 && (
                      <span className="text-adsun-muted text-[10px]">
                        ({item.fileNames.slice(0, 2).join(', ')}{item.fileNames.length > 2 ? '...' : ''})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity + Remove */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center text-sm"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value) || 1)}
                    className="w-14 text-center text-sm !py-1 !px-1"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                  title="Odstrániť"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer: Clear + Submit */}
      <div className="glass-card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">
            {items.length} {items.length === 1 ? 'položka' : items.length < 5 ? 'položky' : 'položiek'}
            {totalFileCount > 0 && (
              <span className="text-adsun-muted text-sm ml-2">· {totalFileCount} súborov</span>
            )}
          </span>
          <button
            onClick={() => { clearCart(); refreshItems(); }}
            className="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Vyprázdniť košík
          </button>
        </div>

        <button
          onClick={handleSubmitAll}
          disabled={submitting}
          className="btn-primary flex items-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {uploadProgress || 'Odosielam...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
              Odoslať objednávku
            </>
          )}
        </button>
      </div>
    </div>
  );
}
