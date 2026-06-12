import { AdminShell } from "@/components/admin/admin-shell";
import { OrderManager } from "@/components/admin/order-manager";

export const metadata = {
  title: "Manage Orders"
};

export default function AdminOrdersPage() {
  return (
    <AdminShell title="Orders">
      <OrderManager />
    </AdminShell>
  );
}
