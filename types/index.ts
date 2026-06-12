export type Product = {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  specifications?: Record<string, string>;
  images: string[];
  price: number;
  mrp: number;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isPrime: boolean;
  isFeatured: boolean;
  isSponsored?: boolean;
  isFlashDeal?: boolean;
  flashEndsAt?: string;
  seller?: string;
  warranty?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  savedForLater?: boolean;
};

export type AddressFormValues = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  rating?: string;
  page?: string;
  prime?: string;
  deal?: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpfulVotes?: number;
  verifiedPurchase?: boolean;
  reply?: string;
  createdAt?: string;
};

export type OrderTimelineStep = {
  status: string;
  message: string;
  createdAt: string;
  completed: boolean;
};

export type Coupon = {
  code: string;
  description: string;
  discountPct?: number;
  discountAmt?: number;
  minOrder: number;
};

export type NotificationItem = {
  id: string;
  type: "ORDER" | "PROMO" | "SECURITY" | "SYSTEM";
  title: string;
  body: string;
  read: boolean;
  link?: string;
  createdAt: string;
};

export type CheckoutStep = "address" | "delivery" | "payment" | "review" | "confirmation";

export type CompareItem = Product;
