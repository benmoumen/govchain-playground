import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToYYYYMMDD(date: Date) {
  return format(date, "yyyyMMdd");
}

export function formatYYYYMMDDToDate(date: string) {
  return new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
}

export const createLongLivingCookieOptions = (
  name: string,
  value: string
): ResponseCookie => ({
  name,
  value,
  path: "/",
  maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
});
