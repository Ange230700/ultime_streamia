// src/utils/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        // exponential back-off
        await new Promise((res) =>
          setTimeout(res, delayMs * Math.pow(2, attempt)),
        );
      }
    }
  }
  throw lastError;
}
