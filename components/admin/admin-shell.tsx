import { Boxes, LayoutDashboard, PackageCheck, UsersRound } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: PackageCheck },
  { href: "/admin/users", label: "Users", icon: UsersRound }
];

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-5 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit rounded-lg border border-slate-200 bg-amazon-navy p-3 text-white shadow-soft dark:border-white/10">
        <div className="px-3 py-3">
          <p className="text-xs font-black uppercase text-amazon-gold">Seller Central</p>
          <h1 className="mt-1 text-2xl font-black tracking-normal">{title}</h1>
        </div>
        <nav className="mt-2 flex flex-row overflow-x-auto gap-1 lg:flex-col lg:space-y-1 lg:gap-0 no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link key={link.href} href={link.href} className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold hover:bg-white/10 lg:gap-3 lg:py-3">
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
