'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

export type CartItem = {
  variantId: string;
  slug: string;
  name: string;
  variantName?: string | null;
  sku: string;
  unitPrice: number;
  imageUrl: string;
  /** Available stock at the time of adding; caps the quantity stepper. */
  maxQty: number;
  quantity: number;
};

type CartContextValue = {
  /** True once localStorage has been read; until then counts/totals are 0. */
  hydrated: boolean;
  items: CartItem[];
  count: number;
  subtotal: number;
  /** Adds (or tops up) a line, returning the resulting quantity. */
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => number;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

const STORAGE_KEY = 'texnocam.cart.v1';

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(quantity: number, maxQty: number) {
  const ceiling = maxQty > 0 ? maxQty : 1;
  return Math.max(1, Math.min(Math.round(quantity), ceiling));
}

function readStored(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is CartItem =>
        !!entry &&
        typeof entry === 'object' &&
        typeof (entry as CartItem).variantId === 'string' &&
        typeof (entry as CartItem).quantity === 'number'
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Load once on mount, then keep localStorage in sync on every change.
  useEffect(() => {
    setItems(readStored());
    setHydrated(true);
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — cart stays in-memory for this session.
    }
  }, [items]);

  // Mirror cart changes made in another tab.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setItems(readStored());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      let resulting = quantity;
      setItems((prev) => {
        const existing = prev.find((line) => line.variantId === item.variantId);
        if (existing) {
          resulting = clampQty(existing.quantity + quantity, item.maxQty);
          return prev.map((line) =>
            line.variantId === item.variantId
              ? { ...line, ...item, quantity: resulting }
              : line
          );
        }
        resulting = clampQty(quantity, item.maxQty);
        return [...prev, { ...item, quantity: resulting }];
      });
      return resulting;
    },
    []
  );

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((line) =>
        line.variantId === variantId
          ? { ...line, quantity: clampQty(quantity, line.maxQty) }
          : line
      )
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((line) => line.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = items.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0
    );
    return {
      hydrated,
      items,
      count,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      clear
    };
  }, [items, hydrated, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
