// ============================================
// Cart Files — IndexedDB persistence for File objects
// localStorage cannot store binary data, IndexedDB can
// Files persist across page refreshes until cart is cleared
// ============================================

const DB_NAME = 'adsun_portal_cart_files';
const DB_VERSION = 1;
const STORE_NAME = 'files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB not available'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'cartItemId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Save files for a specific cart item */
export async function saveCartItemFiles(cartItemId: string, files: File[]): Promise<void> {
  if (files.length === 0) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ cartItemId, files });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Get files for a specific cart item */
export async function getCartItemFiles(cartItemId: string): Promise<File[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(cartItemId);
      request.onsuccess = () => resolve(request.result?.files || []);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

/** Remove files for a specific cart item */
export async function removeCartItemFiles(cartItemId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(cartItemId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // silently ignore
  }
}

/** Clear all stored files (when cart is emptied) */
export async function clearAllCartFiles(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // silently ignore
  }
}

/** Get all files grouped by cart item ID */
export async function getAllCartFiles(): Promise<Map<string, File[]>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => {
        const map = new Map<string, File[]>();
        for (const item of request.result || []) {
          map.set(item.cartItemId, item.files);
        }
        resolve(map);
      };
      request.onerror = () => reject(request.error);
    });
  } catch {
    return new Map();
  }
}
