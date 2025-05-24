// src\utils\seedUtils.ts

import fetch from "node-fetch";

/**
 * Fetches a URL and returns its raw bytes.
 */
export async function urlToBytes(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Converts a data URI (base64) into a Uint8Array.
 */
export function dataUriToBytes(uri: string): Uint8Array {
  const parts = uri.split(",");
  if (parts.length < 2) {
    throw new Error(`Invalid data URI: ${uri}`);
  }
  return Buffer.from(parts[1], "base64");
}
