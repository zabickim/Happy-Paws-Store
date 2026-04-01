import type { ICartItem, IProduct } from "$lib/types/index.js";

const STORAGE_KEY = "happy-paws-cart";

function loadFromStorage(): ICartItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ICartItem[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: ICartItem[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

let items = $state<ICartItem[]>(loadFromStorage());

const _cartCount = $derived(items.reduce((sum, i) => sum + i.quantity, 0));
const _cartTotal = $derived(
  items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
);

export function cartCount() {
  return _cartCount;
}

export function cartTotal() {
  return _cartTotal;
}

export const cartItems = {
  get value() {
    return items;
  },
};

export function addToCart(product: IProduct, quantity = 1): void {
  const existing = items.find((i) => i.product.id === product.id);

  if (existing) {
    const maxQty = product.stock;
    existing.quantity = Math.min(existing.quantity + quantity, maxQty);
  } else {
    items.push({ product, quantity });
  }

  saveToStorage(items);
}

export function removeFromCart(productId: string): void {
  const idx = items.findIndex((i) => i.product.id === productId);
  if (idx !== -1) {
    items.splice(idx, 1);
    saveToStorage(items);
  }
}

export function updateQuantity(productId: string, quantity: number): void {
  const item = items.find((i) => i.product.id === productId);
  if (!item) return;

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.quantity = Math.min(quantity, item.product.stock);
  saveToStorage(items);
}

export function clearCart(): void {
  items.splice(0, items.length);
  saveToStorage(items);
}
