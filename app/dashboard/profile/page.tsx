import { getServerSession } from "next-auth";
import Link from "next/link";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

export const metadata = {
  title: "Profile"
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <DashboardShell title="Profile">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        {!session?.user ? (
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-normal">Sign in to manage profile</h2>
            <Link href="/login?callbackUrl=/dashboard/profile" className="mt-5 inline-flex h-11 items-center rounded-md bg-amazon-gold px-5 text-sm font-bold text-slate-950">
              Sign in
            </Link>
          </div>
        ) : (
          <form className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Name</span>
              <input defaultValue={session.user.name ?? ""} className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
            </label>
            <label>
              <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
              <input defaultValue={session.user.email ?? ""} disabled className="h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-3 outline-none dark:border-white/10 dark:bg-white/10" />
            </label>
            <label>
              <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Phone</span>
              <input placeholder="+91 98765 43210" className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
            </label>
            <label>
              <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">Role</span>
              <input defaultValue={session.user.role} disabled className="h-11 w-full rounded-md border border-slate-200 bg-slate-100 px-3 outline-none dark:border-white/10 dark:bg-white/10" />
            </label>
            <div className="sm:col-span-2">
              <Button type="button">Save profile</Button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
