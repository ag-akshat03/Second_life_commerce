import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function PaymentsPage() {
  return (
    <DashboardShell title="Payment Methods">
      <div className="amazon-card">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Saved payment methods will appear here. Stripe is active for checkout; Razorpay and PayPal integrations are
          ready to wire in production.
        </p>
        <div className="mt-4 rounded border border-dashed border-slate-300 p-6 text-center text-sm dark:border-white/20">
          No saved cards yet
        </div>
      </div>
    </DashboardShell>
  );
}
