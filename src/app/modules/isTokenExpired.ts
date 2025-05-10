// src/app/modules/isTokenExpired.ts

export default function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    if (typeof decoded.exp === "number") {
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    }
    return true;
  } catch (e) {
    console.error("Failed to parse token", e);
    return true;
  }
}
