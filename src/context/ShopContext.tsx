import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '../types/product';
import { products } from '../lib/products';
type Shop = {
  favorites: string[];
  cart: CartItem[];
  toggleFavorite: (id: string) => void;
  addToCart: (p: Product, size?: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  toast: string;
  dismissToast: () => void;
  storageError: boolean;
};
const ShopContext = createContext<Shop | null>(null);
export const cartKey = (item: CartItem) => `${item.id}:${item.size || ''}`;
const validIds = new Set(products.map((p) => p.id));
function readStored<T>(key: string, validate: (value: unknown) => T, fallback: T): T {
  try {
    return validate(JSON.parse(localStorage.getItem(key) || 'null'));
  } catch {
    return fallback;
  }
}
export function ShopProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStored(
      'revy:favorites:v1',
      (v) =>
        Array.isArray(v)
          ? [...new Set(v.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
          : [],
      [],
    ),
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    readStored(
      'revy:cart:v1',
      (v) =>
        Array.isArray(v)
          ? v.filter(
              (i): i is CartItem =>
                !!i &&
                typeof i === 'object' &&
                validIds.has(i.id) &&
                Number.isInteger(i.quantity) &&
                i.quantity > 0 &&
                i.quantity <= 99 &&
                (i.size === undefined || typeof i.size === 'string'),
            )
          : [],
      [],
    ),
  );
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem('revy:favorites:v1', JSON.stringify(favorites));
      localStorage.setItem('revy:cart:v1', JSON.stringify(cart));
    } catch {
      setStorageError(true);
    }
  }, [favorites, cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 4200);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const addToCart = (p: Product, size?: string) => {
    setCart((prev) => {
      const key = cartKey({ id: p.id, quantity: 1, size });
      const existing = prev.find((i) => cartKey(i) === key);
      return existing
        ? prev.map((i) =>
            cartKey(i) === key ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i,
          )
        : [...prev, { id: p.id, quantity: 1, ...(size ? { size } : {}) }];
    });
    setToast(`${p.name} se ha añadido a tu bolsa.`);
  };
  const updateQuantity = (key: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => cartKey(i) !== key)
        : prev.map((i) => (cartKey(i) === key ? { ...i, quantity: Math.min(99, quantity) } : i)),
    );
  };
  const removeFromCart = (key: string) => setCart((prev) => prev.filter((i) => cartKey(i) !== key));
  return (
    <ShopContext.Provider
      value={{
        favorites,
        cart,
        toggleFavorite,
        addToCart,
        updateQuantity,
        removeFromCart,
        toast,
        dismissToast: () => setToast(''),
        storageError,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('ShopProvider missing');
  return ctx;
}
