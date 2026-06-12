import type { Product } from "@/types";

export const categories = [
  "Mobiles",
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty",
  "Books",
  "Grocery",
  "Appliances",
  "Toys",
  "Sports"
];

export const heroSlides = [
  {
    eyebrow: "Amazon Great Indian Sale",
    title: "Premium picks for every room, screen, and commute",
    description: "Curated deals on electronics, appliances, fashion, and everyday essentials with fast Prime delivery.",
    image:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1800&q=80",
    cta: "Shop today's deals"
  },
  {
    eyebrow: "Fresh launches",
    title: "Upgrade your tech stack with launch-week offers",
    description: "Phones, laptops, wearables, and audio gear from loved brands, sorted for Indian shoppers.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80",
    cta: "Explore electronics"
  },
  {
    eyebrow: "Home refresh",
    title: "Make your home feel festival-ready",
    description: "Smart lighting, kitchen heroes, decor, and cleaning essentials with no-cost EMI options.",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1800&q=80",
    cta: "Refresh home"
  }
];

export const products: Product[] = [
  {
    id: "6659f8a4e0f1a001b1110001",
    title: "OnePlus Nord CE 4 5G, 8GB RAM, 256GB Storage",
    slug: "oneplus-nord-ce-4-5g",
    brand: "OnePlus",
    category: "Mobiles",
    description:
      "A refined everyday 5G phone with a bright AMOLED display, rapid charging, long battery life, and a clean Android experience built for multitasking.",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 24999,
    mrp: 28999,
    discount: 14,
    stock: 42,
    rating: 4.4,
    reviewCount: 2843,
    tags: ["5G", "AMOLED", "Fast charging"],
    isPrime: true,
    isFeatured: true
  },
  {
    id: "6659f8a4e0f1a001b1110002",
    title: "Samsung Crystal 4K Vivid Pro Smart TV 55-inch",
    slug: "samsung-crystal-4k-vivid-pro-smart-tv",
    brand: "Samsung",
    category: "Electronics",
    description:
      "A cinematic 4K panel with smart apps, voice controls, adaptive sound, and a slim profile that fits modern Indian living rooms.",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 46990,
    mrp: 72900,
    discount: 36,
    stock: 17,
    rating: 4.2,
    reviewCount: 5178,
    tags: ["4K UHD", "HDR", "Smart TV"],
    isPrime: true,
    isFeatured: true
  },
  {
    id: "6659f8a4e0f1a001b1110003",
    title: "boAt Nirvana Ion ANC Wireless Earbuds",
    slug: "boat-nirvana-ion-anc-wireless-earbuds",
    brand: "boAt",
    category: "Electronics",
    description:
      "Compact true wireless earbuds with active noise cancellation, punchy bass, low-latency gaming mode, and a marathon battery case.",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 2499,
    mrp: 7990,
    discount: 69,
    stock: 130,
    rating: 4.1,
    reviewCount: 18204,
    tags: ["ANC", "TWS", "Low latency"],
    isPrime: true,
    isFeatured: false
  },
  {
    id: "6659f8a4e0f1a001b1110004",
    title: "Amazon Basics Ergonomic Mesh Office Chair",
    slug: "amazon-basics-ergonomic-mesh-office-chair",
    brand: "Amazon Basics",
    category: "Home & Kitchen",
    description:
      "A breathable mesh work chair with adjustable height, lumbar support, tilt lock, and smooth casters for long work-from-home days.",
    images: [
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 6999,
    mrp: 11999,
    discount: 42,
    stock: 56,
    rating: 4.3,
    reviewCount: 912,
    tags: ["Ergonomic", "Mesh", "Work from home"],
    isPrime: true,
    isFeatured: true
  },
  {
    id: "6659f8a4e0f1a001b1110005",
    title: "Lakme Absolute Skin Dew Serum Foundation",
    slug: "lakme-absolute-skin-dew-serum-foundation",
    brand: "Lakme",
    category: "Beauty",
    description:
      "A lightweight serum foundation with a natural finish, hydrating feel, and buildable coverage for everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 719,
    mrp: 899,
    discount: 20,
    stock: 210,
    rating: 4.0,
    reviewCount: 4621,
    tags: ["Serum", "Hydrating", "Daily wear"],
    isPrime: true,
    isFeatured: false
  },
  {
    id: "6659f8a4e0f1a001b1110006",
    title: "Levi's 511 Slim Fit Stretch Jeans",
    slug: "levis-511-slim-fit-stretch-jeans",
    brand: "Levi's",
    category: "Fashion",
    description:
      "Slim fit denim with everyday stretch, clean wash, and a versatile silhouette for office Fridays and weekend plans.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 2299,
    mrp: 3999,
    discount: 43,
    stock: 74,
    rating: 4.2,
    reviewCount: 3350,
    tags: ["Denim", "Slim fit", "Stretch"],
    isPrime: true,
    isFeatured: false
  },
  {
    id: "6659f8a4e0f1a001b1110007",
    title: "Prestige Svachh Stainless Steel Pressure Cooker 5L",
    slug: "prestige-svachh-pressure-cooker-5l",
    brand: "Prestige",
    category: "Home & Kitchen",
    description:
      "A sturdy 5-litre cooker for Indian kitchens with anti-bulge base, spill-control lid, and induction compatibility.",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e8d?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 2599,
    mrp: 3895,
    discount: 33,
    stock: 92,
    rating: 4.5,
    reviewCount: 7819,
    tags: ["Induction", "5 litre", "Steel"],
    isPrime: true,
    isFeatured: true
  },
  {
    id: "6659f8a4e0f1a001b1110008",
    title: "Atomic Habits by James Clear, Paperback",
    slug: "atomic-habits-paperback",
    brand: "Random House",
    category: "Books",
    description:
      "A practical guide to building better habits, breaking unhelpful patterns, and designing systems that compound over time.",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 399,
    mrp: 799,
    discount: 50,
    stock: 300,
    rating: 4.7,
    reviewCount: 62014,
    tags: ["Self help", "Bestseller", "Paperback"],
    isPrime: true,
    isFeatured: false
  },
  {
    id: "6659f8a4e0f1a001b1110009",
    title: "Sony WH-1000XM5 Noise Cancelling Headphones",
    slug: "sony-wh-1000xm5-noise-cancelling-headphones",
    brand: "Sony",
    category: "Electronics",
    description:
      "Flagship over-ear headphones with class-leading noise cancellation, rich audio, multipoint connectivity, and plush comfort.",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 29990,
    mrp: 34990,
    discount: 14,
    stock: 21,
    rating: 4.6,
    reviewCount: 12344,
    tags: ["Noise cancelling", "Bluetooth", "Premium audio"],
    isPrime: true,
    isFeatured: true
  },
  {
    id: "6659f8a4e0f1a001b1110010",
    title: "Philips Air Fryer HD9252/90 with Rapid Air Technology",
    slug: "philips-air-fryer-hd9252",
    brand: "Philips",
    category: "Appliances",
    description:
      "A family-friendly air fryer with rapid hot air circulation, digital presets, and easy-clean parts for crisp snacks with less oil.",
    images: [
      "https://images.unsplash.com/photo-1626082929543-5bab4b1b1f39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 7499,
    mrp: 12995,
    discount: 42,
    stock: 64,
    rating: 4.4,
    reviewCount: 9401,
    tags: ["Air fryer", "Digital", "Low oil"],
    isPrime: true,
    isFeatured: false
  },
  {
    id: "6659f8a4e0f1a001b1110011",
    title: "Nescafe Gold Blend Rich and Smooth Coffee 200g",
    slug: "nescafe-gold-blend-coffee-200g",
    brand: "Nescafe",
    category: "Grocery",
    description:
      "A smooth instant coffee blend with rich aroma, convenient jar packaging, and consistent cafe-style flavour at home.",
    images: [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 749,
    mrp: 950,
    discount: 21,
    stock: 480,
    rating: 4.5,
    reviewCount: 15121,
    tags: ["Coffee", "Instant", "Pantry"],
    isPrime: true,
    isFeatured: false
  },
  {
    id: "6659f8a4e0f1a001b1110012",
    title: "Yonex Nanoray Light 18i Badminton Racquet",
    slug: "yonex-nanoray-light-18i-badminton-racquet",
    brand: "Yonex",
    category: "Sports",
    description:
      "A lightweight graphite racquet with quick handling, balanced power, and a full cover for regular badminton players.",
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613918431703-aa50889e3be7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=1200&q=80"
    ],
    price: 1799,
    mrp: 2990,
    discount: 40,
    stock: 38,
    rating: 4.3,
    reviewCount: 2694,
    tags: ["Badminton", "Graphite", "Lightweight"],
    isPrime: true,
    isFeatured: false
  }
];

export const reviews = [
  {
    name: "Aditi Sharma",
    rating: 5,
    title: "Exactly what I needed",
    comment: "Delivered quickly, packed well, and the quality feels better than expected for this price."
  },
  {
    name: "Rahul Menon",
    rating: 4,
    title: "Solid value",
    comment: "The product performs well day to day. I would only improve the included documentation."
  },
  {
    name: "Nisha Kapoor",
    rating: 5,
    title: "Premium feel",
    comment: "Looks great, works smoothly, and the deal price made it an easy recommendation."
  }
];
