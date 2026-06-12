import { CartView } from "@/components/cart/cart-view";

export const metadata = {
  title: "Shopping Cart",
  description: "Review cart items, update quantities, and continue to checkout."
};

export default function CartPage() {
  return <CartView />;
}
