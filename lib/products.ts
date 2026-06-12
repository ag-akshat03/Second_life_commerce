import { products } from "@/lib/data";
import type { Product, SearchParams } from "@/types";

export function getFeaturedProducts() {
  return products.filter((product) => product.isFeatured);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function searchProducts(params: SearchParams = {}) {
  const query = params.q?.trim().toLowerCase() ?? "";
  const category = params.category?.trim();
  const rating = Number(params.rating ?? 0);

  let filtered = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesCategory = !category || category === "All" || product.category === category;
    const matchesRating = !rating || product.rating >= rating;

    return matchesQuery && matchesCategory && matchesRating;
  });

  switch (params.sort) {
    case "price-asc":
      filtered = filtered.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered = filtered.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      filtered = filtered.sort((a, b) => b.rating - a.rating);
      break;
    case "discount":
      filtered = filtered.sort((a, b) => b.discount - a.discount);
      break;
    default:
      filtered = filtered.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return filtered;
}

export function paginateProducts(items: Product[], page = 1, perPage = 8) {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total: items.length,
    page,
    perPage,
    totalPages: Math.ceil(items.length / perPage)
  };
}
