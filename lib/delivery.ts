export function estimateDeliveryDate(pincode?: string, isPrime = true): string {
  const days = isPrime ? (pincode?.startsWith("1") ? 1 : 2) : 5;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function isPincodeServiceable(pincode: string): boolean {
  return /^\d{6}$/.test(pincode);
}

export function calculateTax(subtotal: number): number {
  return Math.round(subtotal * 0.18);
}

export function calculateShipping(subtotal: number, isPrime: boolean): number {
  if (isPrime || subtotal >= 499) return 0;
  return 40;
}

export function applyCoupon(subtotal: number, code: string): { discount: number; message: string } {
  const coupons: Record<string, { pct?: number; amt?: number; min: number }> = {
    SAVE10: { pct: 10, min: 999 },
    FLAT500: { amt: 500, min: 2999 },
    PRIME20: { pct: 20, min: 1499 }
  };

  const coupon = coupons[code.toUpperCase()];
  if (!coupon) return { discount: 0, message: "Invalid coupon code" };
  if (subtotal < coupon.min) return { discount: 0, message: `Minimum order ₹${coupon.min} required` };

  const discount = coupon.pct
    ? Math.round((subtotal * coupon.pct) / 100)
    : Math.min(coupon.amt ?? 0, subtotal);

  return { discount, message: "Coupon applied successfully" };
}
