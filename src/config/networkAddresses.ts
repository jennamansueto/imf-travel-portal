/**
 * Centralized network address configuration.
 *
 * IP addresses are read from environment variables (NEXT_PUBLIC_* for client
 * availability) with development defaults. In production, set these via your
 * deployment environment to match real infrastructure.
 */

export const ACTOR_IPS = {
  vasquez: process.env.NEXT_PUBLIC_IP_VASQUEZ || "10.0.42.118",
  asante: process.env.NEXT_PUBLIC_IP_ASANTE || "10.0.42.205",
  laurent: process.env.NEXT_PUBLIC_IP_LAURENT || "10.0.55.42",
  patel: process.env.NEXT_PUBLIC_IP_PATEL || "10.0.42.301",
  chen: process.env.NEXT_PUBLIC_IP_CHEN || "10.0.42.88",
  williams: process.env.NEXT_PUBLIC_IP_WILLIAMS || "10.0.42.150",
  system: process.env.NEXT_PUBLIC_IP_SYSTEM || "10.0.0.1",
  undss: process.env.NEXT_PUBLIC_IP_UNDSS || "192.168.1.1",
} as const;
