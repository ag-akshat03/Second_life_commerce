import { Home, MapPin } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Saved Addresses"
};

export default function AddressesPage() {
  return (
    <DashboardShell title="Addresses">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-normal">
            <MapPin className="h-5 w-5 text-amazon-orange" />
            Saved addresses
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Home", "221B Indiranagar Main Road, Bengaluru, Karnataka 560038"],
              ["Work", "Cyber City Tower 8, Gurugram, Haryana 122002"]
            ].map(([label, address]) => (
              <article key={label} className="rounded-lg border border-slate-200 p-4 dark:border-white/10">
                <Home className="h-5 w-5 text-amazon-teal" />
                <h3 className="mt-3 font-black">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{address}</p>
                <button type="button" className="mt-3 text-sm font-bold text-amazon-teal">Edit</button>
              </article>
            ))}
          </div>
        </div>

        <form className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-xl font-black tracking-normal">Add address</h2>
          <div className="mt-4 space-y-3">
            {["Full name", "Mobile number", "Address line", "City", "State", "Pincode"].map((label) => (
              <label key={label} className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
                <input className="h-11 w-full rounded-md border border-slate-200 bg-transparent px-3 outline-none focus:border-amazon-orange dark:border-white/10" />
              </label>
            ))}
          </div>
          <Button type="button" className="mt-5 w-full">Save address</Button>
        </form>
      </div>
    </DashboardShell>
  );
}
