import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMNT(amount: number): string {
  return new Intl.NumberFormat("mn-MN", {
    style: "currency",
    currency: "MNT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(ts));
}

export function maskCard(num: string): string {
  const digits = num.replace(/\s+/g, "");
  return "•••• •••• •••• " + digits.slice(-4);
}
