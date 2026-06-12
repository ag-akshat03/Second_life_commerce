/**
 * Second Life Commerce — Business Logic Constants
 * All formulas and thresholds per PRD Sections 14a, 16, 20.
 */

// === Module 4a: Digital Inventory ===
export const UNUSED_VERIFIED_THRESHOLD = 95; // cosmetic_score >= 95 for is_unused_verified
export const PENDING_WINDOW_DAYS = 14;

// === Module 6: Green Credits ===
// ΔCO2e = E_virgin_mfg + E_warehouse_reverse - E_p2p_transport
export const E_WAREHOUSE_REVERSE_KG = 1.0; // kg CO2e for avoided return shipping
export const E_P2P_TRANSPORT_KG = 0.2;     // kg CO2e for local last-mile

// Carbon factors by category (kg CO2e manufacturing emissions)
export const CARBON_FACTORS: Record<string, { min: number; max: number; avg: number }> = {
  laptops: { min: 331, max: 331, avg: 331 },
  smartphones: { min: 55, max: 77, avg: 66 },
  electronics: { min: 40, max: 80, avg: 60 },
  monitors: { min: 200, max: 250, avg: 225 },
  apparel: { min: 5.5, max: 7.0, avg: 6.25 },
  footwear: { min: 10, max: 30, avg: 20 },
};

// Credits conversion: credits per kg CO2e avoided
export const CREDITS_PER_KG_CO2E = 0.05; // 1 credit per 20 kg CO2e
export const TREE_EQUIVALENT_KG = 22; // ~22 kg CO2e per tree per year

// === Module 9: Bonus multiplier for refurbished redemption ===
export const REFURBISHED_BONUS_MULTIPLIER = 1.3; // 30% more value on refurbished

// === Module 8: Resale Pricing ===
export const DEPRECIATION_YEAR_1 = 0.70; // flat 70% retention year 1
export const EXCHANGE_DISCOUNT_FACTOR = 0.70;
export const COMMISSION_RATE = 0.12; // 10-15%, using 12%

export const CONDITION_TIERS = {
  LIKE_NEW: { min: 90, max: 100, multiplier: 0.85 },
  GOOD: { min: 75, max: 89, multiplier: 0.70 },
  ACCEPTABLE: { min: 60, max: 74, multiplier: 0.50 },
  POOR: { min: 0, max: 59, multiplier: 0.0 },
} as const;

// Functional score weights (electronics: functional matters more)
export const COSMETIC_WEIGHT = 0.4;
export const FUNCTIONAL_WEIGHT = 0.6;
