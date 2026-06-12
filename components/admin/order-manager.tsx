"use client";

import { PackageCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  items: number;
};

const initialOrders: AdminOrder[] = [
  {
    id: "ord_1001",
    customer: "Aditi Sharma",
    email: "aditi@example.com",
    total: products[0].price + products[2].price,
    status: "PROCESSING",
    createdAt: "2026-05-09",
    items: 2
  },
  {
    id: "ord_1002",
    customer: "Rahul Menon",
    email: "rahul@example.com",
    total: products[6].price,
    status: "SHIPPED",
    createdAt: "2026-05-08",
    items: 1
  },
  {
    id: "ord_1003",
    customer: "Nisha Kapoor",
    email: "nisha@example.com",
    total: products[8].price,
    status: "PAID",
    createdAt: "2026-05-07",
    items: 1
  }
];

const statuses: AdminOrder["status"][] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderManager() {
  const [orders, setOrders] = useState(initialOrders);

  async function updateStatus(orderId: string, status: AdminOrder["status"]) {
    setOrders((items) => items.map((item) => (item.id === orderId ? { ...item, status } : item)));
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }).catch(() => null);
    toast.success("Order status updated", { description: "Demo table updated immediately." });
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <PackageCheck className="h-6 w-6 text-amazon-teal" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Open orders</p>
          <p className="mt-1 text-3xl font-black tracking-normal">{orders.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <Truck className="h-6 w-6 text-amazon-orange" />
          <p className="mt-3 text-xs font-black uppercase text-slate-500">Shipping queue</p>
          <p className="mt-1 text-3xl font-black tracking-normal">{orders.filter((order) => order.status === "PROCESSING" || order.status === "PAID").length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-xs font-black uppercase text-slate-500">Revenue preview</p>
          <p className="mt-3 text-3xl font-black tracking-normal">{formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-500 dark:bg-white/10">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4">
                    <p className="font-black text-slate-950 dark:text-white">{order.id}</p>
                    <p className="text-xs text-slate-500">{order.createdAt}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold">{order.customer}</p>
                    <p className="text-xs text-slate-500">{order.email}</p>
                  </td>
                  <td className="px-4 py-4">{order.items}</td>
                  <td className="px-4 py-4 font-bold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-4">
                    <Badge tone={order.status === "DELIVERED" ? "success" : order.status === "CANCELLED" ? "deal" : "prime"}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order.id, event.target.value as AdminOrder["status"])}
                      className="h-10 rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10"
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
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
