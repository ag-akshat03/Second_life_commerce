"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types";

const MAX_COMPARE = 4;

type CompareState = {
  items: Product[];
  add: (product: Product) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
};

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        if (get().items.some((item) => item.id === product.id)) return true;
        if (get().items.length >= MAX_COMPARE) return false;
        set({ items: [...get().items, product] });
        return true;
      },
      remove: (productId) => set({ items: get().items.filter((item) => item.id !== productId) }),
      clear: () => set({ items: [] }),
      has: (productId) => get().items.some((item) => item.id === productId)
    }),
    { name: "amazon-india-compare" }
  )
);
