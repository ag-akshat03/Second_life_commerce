export const getRecentlyViewed = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
};

export const addRecentlyViewed = (product: any) => {
  if (typeof window === "undefined") return;

  let items = getRecentlyViewed();

  items = items.filter((item: any) => item.id !== product.id);

  items.unshift({
  id: product.id,
  slug: product.slug,   // 👈 ADD THIS
  title: product.title,
  image: product.images?.[0],
  price: product.price,
});

  items = items.slice(0, 5);

  localStorage.setItem("recentlyViewed", JSON.stringify(items));
};