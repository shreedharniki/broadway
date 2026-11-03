// Asset manager supporting dynamic card image and background overrides
// Uses memory cache + IndexedDB to avoid localStorage QuotaExceededError for high-res images

export const ASSET_KEYS = [
  'Broadway-home',
  'broadway-city',
  'service-ftth',
  'service-voice',
  'service-business',
  'service-security',
] as const;

export type CustomImageKey = typeof ASSET_KEYS[number];

const STORAGE_PREFIX = 'broadway_asset_';
const DB_NAME = 'broadway_assets_store_v2';
const STORE_NAME = 'images';

// In-memory cache for instant synchronous retrieval
const memoryCache = new Map<string, string>();

// IndexedDB Helper Functions
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// Client-side image optimization to prevent huge payload overhead
function optimizeImageDataUrl(dataUrl: string, maxDimension = 2560): Promise<string> {
  if (typeof window === 'undefined' || !dataUrl.startsWith('data:image')) {
    return Promise.resolve(dataUrl);
  }
  // If already under 700KB, keep as is
  if (dataUrl.length < 700_000) {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use JPEG 0.92 for photo background/card fidelity with small size
        const optimized = canvas.toDataURL('image/jpeg', 0.92);
        resolve(optimized.length < dataUrl.length ? optimized : dataUrl);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// Synchronously initialize memory cache from localStorage where available
if (typeof window !== 'undefined') {
  try {
    ASSET_KEYS.forEach((key) => {
      const val = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (val && val.startsWith('data:image')) {
        memoryCache.set(key, val);
      }
    });
  } catch {
    // Ignore initial localStorage read errors
  }

  // Hydrate from IndexedDB in the background
  (async () => {
    try {
      let updated = false;
      for (const key of ASSET_KEYS) {
        const val = await idbGet(key);
        if (val && val.startsWith('data:image')) {
          memoryCache.set(key, val);
          updated = true;
        }
      }
      if (updated) {
        window.dispatchEvent(new Event('broadway-assets-updated'));
      }
    } catch {
      // Ignore background hydration errors
    }
  })();
}

export function getAssetUrl(key: CustomImageKey, fallbackPath: string): string {
  // 1. Check memory cache first
  const memoryVal = memoryCache.get(key);
  if (memoryVal && memoryVal.startsWith('data:image')) {
    return memoryVal;
  }

  // 2. Safe check in localStorage
  try {
    const customData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (customData && customData.startsWith('data:image')) {
      memoryCache.set(key, customData);
      return customData;
    }
  } catch {
    // Handled safely
  }

  return fallbackPath;
}

export async function saveCustomAsset(key: CustomImageKey, rawDataUrl: string): Promise<string> {
  try {
    const maxDim = (key === 'Broadway-home' || key === 'broadway-city') ? 2560 : 1600;
    const dataUrl = await optimizeImageDataUrl(rawDataUrl, maxDim);

    // 1. Update memory cache immediately
    memoryCache.set(key, dataUrl);
    if (key === 'Broadway-home' || key === 'broadway-city') {
      memoryCache.set('Broadway-home', dataUrl);
      memoryCache.set('broadway-city', dataUrl);
    }

    // 2. Persist to IndexedDB (unlimited quota for high-resolution images)
    await idbSet(key, dataUrl);
    if (key === 'Broadway-home' || key === 'broadway-city') {
      await idbSet('Broadway-home', dataUrl);
      await idbSet('broadway-city', dataUrl);
    }

    // 3. Safe localStorage attempt:
    // Only store in localStorage if small (< 200KB) to completely prevent QuotaExceededError
    try {
      if (dataUrl.length < 200_000) {
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, dataUrl);
        if (key === 'Broadway-home' || key === 'broadway-city') {
          localStorage.setItem(`${STORAGE_PREFIX}Broadway-home`, dataUrl);
          localStorage.setItem(`${STORAGE_PREFIX}broadway-city`, dataUrl);
        }
      } else {
        // Clean up any old large keys in localStorage to prevent quota exhaustion
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
        if (key === 'Broadway-home' || key === 'broadway-city') {
          localStorage.removeItem(`${STORAGE_PREFIX}Broadway-home`);
          localStorage.removeItem(`${STORAGE_PREFIX}broadway-city`);
        }
      }
    } catch {
      // QuotaExceededError is caught and handled safely
    }

    // 4. Persist to disk via Vite middleware
    if (key === 'Broadway-home' || key === 'broadway-city') {
      fetch('/api/upload-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl }),
      }).catch(() => {});
    } else {
      fetch('/api/upload-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, dataUrl }),
      }).catch(() => {});
    }

    // 5. Trigger update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('broadway-assets-updated'));
    }

    return dataUrl;
  } catch {
    // If any step fails, guarantee memory cache is updated so the UI always works
    memoryCache.set(key, rawDataUrl);
    return rawDataUrl;
  }
}

export async function resetCustomAssets(): Promise<void> {
  try {
    memoryCache.clear();
    for (const key of ASSET_KEYS) {
      try {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      } catch {
        // ignore
      }
      await idbDelete(key);
    }
    window.dispatchEvent(new Event('broadway-assets-updated'));
  } catch {
    // ignore
  }
}
