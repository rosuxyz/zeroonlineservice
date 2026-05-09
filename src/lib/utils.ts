import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getURL() {
  // 1. If we are in the browser, window.location.origin is the most reliable
  if (typeof window !== "undefined") {
    return window.location.origin.endsWith("/")
      ? window.location.origin
      : `${window.location.origin}/`;
  }

  // 2. Fallback for server-side / build-time
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? 
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 
    "http://localhost:3000/";
    
  url = url.includes("http") ? url : `https://${url}`;
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
}
