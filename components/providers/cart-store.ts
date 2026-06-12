"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem, Product } from "@/types";

type CartState = {
  items: CartItem[];
  savedItems: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  moveToWishlist: (productId: string) => void;
  applyCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      couponCode: null,
      couponDiscount: 0,
      addItem: (product, quantity = 1) => {
        const saved = get().savedItems.find((item) => item.product.id === product.id);
        if (saved) {
          set({
            savedItems: get().savedItems.filter((item) => item.product.id !== product.id),
            items: [...get().items, { product, quantity }]
          });
          return;
        }

        const items = get().items;
        const current = items.find((item) => item.product.id === product.id);

        if (current) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, 20) }
                : item
            )
          });
          return;
        }

        set({ items: [...items, { product, quantity }] });
      },
      removeItem: (productId) =>
        set({
          items: get().items.filter((item) => item.product.id !== productId)
        }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, 20)) } : item
          )
        }),
      saveForLater: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        if (!item) return;
        set({
          items: get().items.filter((i) => i.product.id !== productId),
          savedItems: [...get().savedItems.filter((i) => i.product.id !== productId), item]
        });
      },
      moveToCart: (productId) => {
        const item = get().savedItems.find((i) => i.product.id === productId);
        if (!item) return;
        get().addItem(item.product, item.quantity);
        set({ savedItems: get().savedItems.filter((i) => i.product.id !== productId) });
      },
      moveToWishlist: (productId) => {
        set({
          items: get().items.filter((i) => i.product.id !== productId),
          savedItems: get().savedItems.filter((i) => i.product.id !== productId)
        });
      },
      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      subtotal: () => get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      count: () => get().items.reduce((total, item) => total + item.quantity, 0)
    }),
    {
      name: "amazon-india-cart"
    }
  )
);
