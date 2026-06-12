export const amazonTokens = {
  colors: {
    navy: "#131921",
    blue: "#232f3e",
    lightBlue: "#37475a",
    gold: "#febd69",
    orange: "#ff9900",
    teal: "#007185",
    green: "#067d62",
    red: "#b12704",
    pageBg: "#eaeded",
    cardBg: "#ffffff",
    textPrimary: "#0f1111",
    textSecondary: "#565959",
    border: "#d5d9d9"
  },
  spacing: {
    navHeight: "60px",
    subNavHeight: "39px",
    pagePadding: "1rem",
    cardPadding: "0.75rem",
    sectionGap: "1.25rem"
  },
  typography: {
    fontFamily: '"Amazon Ember", Arial, sans-serif',
    productTitle: "text-sm leading-snug",
    price: "text-xl font-normal",
    mrp: "text-xs text-slate-500 line-through"
  },
  shadows: {
    card: "0 2px 5px rgba(15,17,17,0.15)",
    cardHover: "0 4px 12px rgba(15,17,17,0.2)",
    dropdown: "0 4px 14px rgba(15,17,17,0.25)",
    sticky: "0 2px 4px rgba(0,0,0,0.25)"
  }
} as const;

export const trendingSearches = [
  "iphone 16",
  "laptop deals",
  "air fryer",
  "running shoes",
  "kindle",
  "wireless earbuds",
  "smart watch",
  "gaming chair"
];

export const deliveryLocations = [
  { pincode: "110001", city: "New Delhi" },
  { pincode: "400001", city: "Mumbai" },
  { pincode: "560001", city: "Bengaluru" },
  { pincode: "600001", city: "Chennai" }
];
