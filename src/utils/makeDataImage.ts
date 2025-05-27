// src/utils/makeDataImage.ts
export function makeDataImage(base64: string): string {
  // JPEG files always start with 0xFF D8, which in Base64 is “/9j/”
  if (base64.startsWith("/9j/")) {
    return `data:image/jpeg;base64,${base64}`;
  }
  // PNG files always start with “iVBOR”
  if (base64.startsWith("iVBOR")) {
    return `data:image/png;base64,${base64}`;
  }
  // Otherwise fall back to SVG
  return `data:image/svg+xml;base64,${base64}`;
}
