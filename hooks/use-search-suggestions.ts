"use client";

import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/use-debounce";
import type { Product } from "@/types";

type SuggestionResult = {
  products: Product[];
  queries: string[];
};

export function useSearchSuggestions(query: string) {
  const debounced = useDebounce(query, 250);
  const [data, setData] = useState<SuggestionResult>({ products: [], queries: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debounced.trim()) {
      setData({ products: [], queries: [] });
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search/suggestions?q=${encodeURIComponent(debounced)}`, {
      signal: controller.signal
    })
      .then((res) => res.json())
      .then((json: SuggestionResult) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debounced]);

  return { ...data, loading, debounced };
}
