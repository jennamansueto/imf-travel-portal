/**
 * Centralized network address configuration.
 *
 * IP addresses are read from environment variables (NEXT_PUBLIC_* for client
 * availability) with development defaults. In production, set these via your
 * deployment environment to match real infrastructure.
 *
 * Note: NEXT_PUBLIC_ prefix is used because this data is consumed by client
 * components (AppContext, seed data rendered in-browser). For a server-only
 * context, drop the prefix to keep values out of the client bundle.
 */

export const ACTOR_IPS = {
  vasquez: process.env.NEXT_PUBLIC_IP_VASQUEZ || "10.0.42.118", // NOSONAR — intentional config default
  asante: process.env.NEXT_PUBLIC_IP_ASANTE || "10.0.42.205", // NOSONAR
  laurent: process.env.NEXT_PUBLIC_IP_LAURENT || "10.0.55.42", // NOSONAR
  patel: process.env.NEXT_PUBLIC_IP_PATEL || "10.0.42.201", // NOSONAR
  chen: process.env.NEXT_PUBLIC_IP_CHEN || "10.0.42.88", // NOSONAR
  williams: process.env.NEXT_PUBLIC_IP_WILLIAMS || "10.0.42.150", // NOSONAR
  system: process.env.NEXT_PUBLIC_IP_SYSTEM || "10.0.0.1", // NOSONAR
  undss: process.env.NEXT_PUBLIC_IP_UNDSS || "192.168.1.1", // NOSONAR
} as const;
