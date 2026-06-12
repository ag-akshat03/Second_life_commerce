"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types";

type WishlistState = {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: get().items.filter((item) => item.id !== product.id) });
          return;
        }
        set({ items: [...get().items, product] });
      },
      remove: (productId) => set({ items: get().items.filter((item) => item.id !== productId) }),
      has: (productId) => get().items.some((item) => item.id === productId)
    }),
    { name: "amazon-india-wishlist" }
  )
);
