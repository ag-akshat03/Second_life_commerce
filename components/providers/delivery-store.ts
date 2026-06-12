"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type DeliveryState = {
  pincode: string;
  city: string;
  setLocation: (pincode: string, city: string) => void;
};

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      pincode: "110001",
      city: "New Delhi",
      setLocation: (pincode, city) => set({ pincode, city })
    }),
    { name: "amazon-india-delivery" }
  )
);
