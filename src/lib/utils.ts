import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getURL() {
  // 1. If we are in the browser, window.location.origin is the most reliable
  if (typeof window !== "undefined") {
    return window.location.origin.endsWith("/")
      ? window.location.origin.slice(0, -1)
      : window.location.origin;
  }

  // 2. Fallback for server-side / build-time
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? 
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
    "https://zeroonlineservice.vercel.app"; // Hardcoded fallback for production
    
  url = url.includes("http") ? url : `https://${url}`;
  // Remove trailing slash if present
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
