import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToYYYYMMDD(date: Date) {
  return format(date, "yyyyMMdd");
}

export function formatYYYYMMDDToDate(date: string) {
  return new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
}
