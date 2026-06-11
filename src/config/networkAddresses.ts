/**
 * Network addresses used throughout the application.
 * Centralised here so they can be changed without modifying business logic.
 *
 * In production, these would typically come from a runtime configuration
 * service or environment variables; the constants below serve as
 * development / seed-data defaults.
 */

export const SEED_IP_ADDRESSES = {
  vasquez: process.env.NEXT_PUBLIC_IP_VASQUEZ ?? "10.0.42.118",
  asante: process.env.NEXT_PUBLIC_IP_ASANTE ?? "10.0.42.205",
  laurent: process.env.NEXT_PUBLIC_IP_LAURENT ?? "10.0.55.42",
  patel: process.env.NEXT_PUBLIC_IP_PATEL ?? "10.0.42.301",
  chen: process.env.NEXT_PUBLIC_IP_CHEN ?? "10.0.42.88",
  williams: process.env.NEXT_PUBLIC_IP_WILLIAMS ?? "10.0.42.150",
  system: process.env.NEXT_PUBLIC_IP_SYSTEM ?? "10.0.0.1",
  undss: process.env.NEXT_PUBLIC_IP_UNDSS ?? "192.168.1.1",
} as const;
