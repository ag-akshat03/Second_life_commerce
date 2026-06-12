import { AdminShell } from "@/components/admin/admin-shell";
import { UserManager } from "@/components/admin/user-manager";

export const metadata = {
  title: "Manage Users"
};

export default function AdminUsersPage() {
  return (
    <AdminShell title="Users">
      <UserManager />
    </AdminShell>
  );
}
