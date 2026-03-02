// ============================================
// Cart Store — localStorage persistence
// Manages product items before bulk order submission
// ============================================

export interface CartItem {
  id: string; // unique cart item id
  productId: string;
  productName: string;
  productType: 'template' | 'product';
  variantId?: string | null;
  variantName?: string | null;
  quantity: number;
  parameters?: Record<string, string>; // template params
  notes?: string;
  fileNames?: string[];
  categoryId?: string | null;
  categoryName?: string | null;
  addedAt: string; // ISO date
}

const CART_KEY = 'adsun_portal_cart';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  // Dispatch custom event so other components can react
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { count: items.length } }));
}

export function getCartItems(): CartItem[] {
  return readCart();
}

export function getCartCount(): number {
  return readCart().length;
}

export function addToCart(item: Omit<CartItem, 'id' | 'addedAt'>): CartItem {
  const items = readCart();
  const newItem: CartItem = {
    ...item,
    id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    addedAt: new Date().toISOString(),
  };
  items.push(newItem);
  writeCart(items);
  return newItem;
}

export function removeFromCart(itemId: string): void {
  const items = readCart().filter((i) => i.id !== itemId);
  writeCart(items);
  // Cleanup files from IndexedDB (fire-and-forget)
  if (typeof window !== 'undefined') {
    import('./cart-files').then((m) => m.removeCartItemFiles(itemId)).catch(() => {});
  }
}

export function updateCartItemQuantity(itemId: string, quantity: number): void {
  const items = readCart();
  const item = items.find((i) => i.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    writeCart(items);
  }
}

export function clearCart(): void {
  writeCart([]);
  // Cleanup all files from IndexedDB (fire-and-forget)
  if (typeof window !== 'undefined') {
    import('./cart-files').then((m) => m.clearAllCartFiles()).catch(() => {});
  }
}
