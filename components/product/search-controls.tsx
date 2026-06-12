"use client";

import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { categories } from "@/lib/data";

export function SearchControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "");
  const [rating, setRating] = useState(searchParams.get("rating") ?? "");
  const [isOpen, setIsOpen] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (category !== "All") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (rating) params.set("rating", rating);

    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between font-black text-slate-950 dark:text-white sm:pointer-events-none sm:cursor-default"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-amazon-orange" />
          <span>Filters</span>
        </div>
        <div className="text-amazon-teal sm:hidden">
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      <form onSubmit={onSubmit} className={`${isOpen ? "block" : "hidden"} mt-4 sm:mt-0 sm:block`}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase text-slate-500">Search</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Phones, chair, coffee"
            className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase text-slate-500">Category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
          >
            <option>All</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase text-slate-500">Sort</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
          >
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="rating">Customer rating</option>
            <option value="discount">Discount</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase text-slate-500">Rating</span>
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
          >
            <option value="">All ratings</option>
            <option value="4">4 stars and up</option>
            <option value="4.5">4.5 stars and up</option>
          </select>
        </label>
        <button type="submit" className="mt-5 h-11 rounded-md bg-amazon-gold px-4 text-sm font-black text-slate-950 hover:bg-[#f5a742] lg:mt-5">
          Apply
        </button>
      </div>
    </form>
  </div>
  );
}
