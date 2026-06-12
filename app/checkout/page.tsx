import { CheckoutForm } from "@/components/cart/checkout-form";

export const metadata = {
  title: "Checkout",
  description: "Enter shipping information and pay securely through Stripe."
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
