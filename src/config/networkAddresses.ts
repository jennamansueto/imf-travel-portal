// Configurable IP addresses for audit trail entries.
// Values are read from NEXT_PUBLIC_IP_* environment variables
// and can be overridden per deployment via .env.local.
//
// Required env vars (set in .env or .env.local):
//   NEXT_PUBLIC_IP_VASQUEZ, NEXT_PUBLIC_IP_ASANTE, NEXT_PUBLIC_IP_LAURENT,
//   NEXT_PUBLIC_IP_CHEN, NEXT_PUBLIC_IP_WILLIAMS, NEXT_PUBLIC_IP_SYSTEM,
//   NEXT_PUBLIC_IP_UNDSS

export const IP_VASQUEZ = process.env.NEXT_PUBLIC_IP_VASQUEZ ?? "";
export const IP_ASANTE = process.env.NEXT_PUBLIC_IP_ASANTE ?? "";
export const IP_LAURENT = process.env.NEXT_PUBLIC_IP_LAURENT ?? "";
export const IP_CHEN = process.env.NEXT_PUBLIC_IP_CHEN ?? "";
export const IP_WILLIAMS = process.env.NEXT_PUBLIC_IP_WILLIAMS ?? "";
export const IP_SYSTEM = process.env.NEXT_PUBLIC_IP_SYSTEM ?? "";
export const IP_UNDSS = process.env.NEXT_PUBLIC_IP_UNDSS ?? "";
