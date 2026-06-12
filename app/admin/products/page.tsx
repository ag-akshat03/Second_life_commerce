import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";
import { products } from "@/lib/data";

export const metadata = {
  title: "Manage Products"
};

export default function AdminProductsPage() {
  return (
    <AdminShell title="Products">
      <ProductManager initialProducts={products} />
    </AdminShell>
  );
}
