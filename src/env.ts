const ip = process.env.NEXT_PUBLIC_LOCALHOST_IP;
export const PARTYKIT_HOST =
  process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? `${ip}:1999`;
export const PROTOCOL = PARTYKIT_HOST.startsWith(ip || "127.0.0.1")
  ? "http"
  : "https";
export const PARTYKIT_URL = `${PROTOCOL}://${PARTYKIT_HOST}`;
export const SERVER_URL = `${PROTOCOL}://${ip}:3000`;
