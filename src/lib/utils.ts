import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToYYYYMMDD(date: Date): string {
  return format(date, "yyyyMMdd");
}

export function formatYYYYMMDDToDate(date: string | Date): Date {
  if (date instanceof Date) {
    return date;
  }
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

// validate UUID v4
export function isValidUUIDv4(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    uuid
  );
}
