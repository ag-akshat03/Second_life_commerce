import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardPrimePage() {
  return (
    <DashboardShell title="Prime Membership">
      <div className="amazon-card bg-gradient-to-br from-sky-900 to-slate-900 p-6 text-white">
        <p className="text-amazon-gold font-bold">amazon prime</p>
        <h2 className="mt-2 text-2xl font-bold">Fast, FREE delivery & exclusive deals</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>✓ FREE fast delivery on millions of items</li>
          <li>✓ Prime Video & early access to sales</li>
          <li>✓ Exclusive coupons and lightning deals</li>
        </ul>
        <Link href="/prime" className="amazon-btn-primary mt-6 inline-flex">
          Manage Prime
        </Link>
      </div>
    </DashboardShell>
  );
}
