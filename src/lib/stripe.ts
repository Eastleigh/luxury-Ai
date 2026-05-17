import { loadStripe } from "@stripe/stripe-js";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

export const getStripe = () => {
  return loadStripe(stripePublishableKey);
};

export const PRICE_IDS = {
  professional: process.env.STRIPE_PRICE_PROFESSIONAL || "",
  executive: process.env.STRIPE_PRICE_EXECUTIVE || "",
};
