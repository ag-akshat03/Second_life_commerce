"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SearchHistoryState = {
  queries: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
};

const MAX_HISTORY = 10;

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      queries: [],
      add: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const next = [trimmed, ...get().queries.filter((q) => q !== trimmed)].slice(0, MAX_HISTORY);
        set({ queries: next });
      },
      remove: (query) => set({ queries: get().queries.filter((q) => q !== query) }),
      clear: () => set({ queries: [] })
    }),
    { name: "amazon-india-search-history" }
  )
);
