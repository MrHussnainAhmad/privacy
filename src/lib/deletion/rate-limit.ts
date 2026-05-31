type Bucket = { count: number; firstAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, windowMs: number, max: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now - current.firstAt > windowMs) {
    buckets.set(key, { count: 1, firstAt: now });
    return { ok: true, remaining: max - 1 };
  }

  if (current.count >= max) {
    return { ok: false, remaining: 0 };
  }

  current.count += 1;
  buckets.set(key, current);
  return { ok: true, remaining: Math.max(max - current.count, 0) };
}
