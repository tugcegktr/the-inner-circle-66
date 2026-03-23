import { Capacitor } from "@capacitor/core";

// Base URL for native (iOS/Android) API calls.
// In the browser, relative paths work via the Vite proxy — no base needed.
// Override at build time by setting the VITE_API_URL environment variable,
// e.g. to your production domain when releasing to the App Store.
const NATIVE_BASE =
  (import.meta.env.VITE_API_URL as string) ||
  "https://e6dd15f2-bfc0-44b4-9154-f4e4c7ded82f-00-3qgtnpgiz3amh.worf.replit.dev";

export function apiUrl(path: string): string {
  if (Capacitor.isNativePlatform()) {
    return `${NATIVE_BASE}${path}`;
  }
  return path;
}
