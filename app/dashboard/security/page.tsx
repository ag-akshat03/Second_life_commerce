"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SecurityPage() {
  return (
    <DashboardShell title="Login & Security">
      <div className="space-y-4">
        <div className="amazon-card">
          <h2 className="font-bold">Change password</h2>
          <form
            className="mt-4 grid max-w-md gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Password updated (demo)");
            }}
          >
            <input type="password" placeholder="Current password" className="h-10 rounded border px-3 dark:border-white/10 dark:bg-slate-950" required />
            <input type="password" placeholder="New password" minLength={6} className="h-10 rounded border px-3 dark:border-white/10 dark:bg-slate-950" required />
            <Button type="submit">Update password</Button>
          </form>
        </div>
        <div className="amazon-card">
          <h2 className="font-bold">Two-step verification</h2>
          <p className="mt-2 text-sm text-slate-600">Add an extra layer of security with OTP verification at sign-in.</p>
          <Button variant="outline" className="mt-4" onClick={() => toast.info("OTP verification coming soon")}>
            Enable OTP
          </Button>
        </div>
      </div>
    </DashboardShell>
  );
}
