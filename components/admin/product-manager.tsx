"use client";

import { Edit3, Loader2, Plus, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const stats = useMemo(
    () => ({
      inventory: products.reduce((sum, product) => sum + product.stock, 0),
      averageDiscount: Math.round(products.reduce((sum, product) => sum + product.discount, 0) / products.length)
    }),
    [products]
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title"));
    const payload: Product = {
      id: editing?.id ?? crypto.randomUUID(),
      title,
      slug: String(form.get("slug")) || slugify(title),
      brand: String(form.get("brand")),
      category: String(form.get("category")),
      description: String(form.get("description")),
      images: [String(form.get("image"))],
      price: Number(form.get("price")),
      mrp: Number(form.get("mrp")),
      discount: Number(form.get("discount")),
      stock: Number(form.get("stock")),
      rating: editing?.rating ?? 4.2,
      reviewCount: editing?.reviewCount ?? 0,
      tags: String(form.get("tags"))
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isPrime: true,
      isFeatured: form.get("isFeatured") === "on"
    };

    try {
      const response = await fetch(editing ? `/api/admin/products/${editing.id}` : "/api/admin/products", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok && response.status !== 403) {
        throw new Error("API save failed.");
      }

      setProducts((items) => (editing ? items.map((item) => (item.id === editing.id ? payload : item)) : [payload, ...items]));
      setEditing(null);
      event.currentTarget.reset();
      toast.success(editing ? "Product updated" : "Product added", {
        description: response.status === 403 ? "Updated locally in demo mode. Sign in as admin to persist." : "MongoDB product collection updated."
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save product.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(product: Product) {
    setProducts((items) => items.filter((item) => item.id !== product.id));
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" }).catch(() => null);
    toast.success("Product removed", { description: "Removed from this admin view." });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Products", products.length],
          ["Inventory", stats.inventory],
          ["Avg discount", `${stats.averageDiscount}%`]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <p className="text-xs font-black uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black tracking-normal text-slate-950 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <form key={editing?.id ?? "new-product"} onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-normal text-slate-950 dark:text-white">{editing ? "Edit product" : "Add product"}</h2>
          {editing && (
            <button type="button" onClick={() => setEditing(null)} className="text-sm font-bold text-amazon-teal">
              Cancel edit
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" defaultValue={editing?.title} required placeholder="Title" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="slug" defaultValue={editing?.slug} placeholder="Slug" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="brand" defaultValue={editing?.brand} required placeholder="Brand" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <select name="category" defaultValue={editing?.category ?? categories[0]} className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10">
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <input name="price" type="number" defaultValue={editing?.price} required placeholder="Price" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="mrp" type="number" defaultValue={editing?.mrp} required placeholder="MRP" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="discount" type="number" defaultValue={editing?.discount ?? 10} required placeholder="Discount %" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="stock" type="number" defaultValue={editing?.stock ?? 20} required placeholder="Stock" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
          <input name="image" type="url" defaultValue={editing?.images[0]} required placeholder="Image URL" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10 md:col-span-2" />
          <input name="tags" defaultValue={editing?.tags.join(", ")} placeholder="Tags, comma separated" className="h-11 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10 md:col-span-2" />
          <textarea name="description" defaultValue={editing?.description} required placeholder="Description" className="min-h-24 rounded-md border border-slate-200 bg-transparent p-3 outline-none focus:border-amazon-orange dark:border-white/10 md:col-span-2" />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input name="isFeatured" type="checkbox" defaultChecked={editing?.isFeatured} className="h-4 w-4 accent-amazon-orange" />
          Feature on homepage
        </label>
        <Button type="submit" className="mt-5" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {editing ? "Update product" : "Add product"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 font-bold text-slate-950 dark:text-white">{product.title}</td>
                  <td className="px-4 py-4">{product.category}</td>
                  <td className="px-4 py-4">{formatPrice(product.price)}</td>
                  <td className="px-4 py-4">{product.stock}</td>
                  <td className="px-4 py-4">{product.isFeatured ? <Badge tone="success">Featured</Badge> : <Badge>Live</Badge>}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setEditing(product)} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Edit product">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => deleteProduct(product)} className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" aria-label="Delete product">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
