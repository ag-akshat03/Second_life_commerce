import { Boxes, IndianRupee, PackageCheck, UsersRound } from "lucide-react";

import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { AdminShell } from "@/components/admin/admin-shell";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Admin Overview"
};

export default function AdminPage() {
  const revenue = products.slice(0, 6).reduce((sum, product) => sum + product.price * 3, 0);

  return (
    <AdminShell title="Overview">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Products", value: products.length, icon: Boxes },
            { label: "Orders", value: 128, icon: PackageCheck },
            { label: "Users", value: "2.4k", icon: UsersRound },
            { label: "Revenue", value: formatPrice(revenue), icon: IndianRupee }
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
                <Icon className="h-6 w-6 text-amazon-orange" />
                <p className="mt-3 text-xs font-black uppercase text-slate-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-black tracking-normal text-slate-950 dark:text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>
        <AnalyticsDashboard />
      </div>
    </AdminShell>
  );
}
