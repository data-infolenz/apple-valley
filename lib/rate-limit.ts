type AttemptState = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  loginAttempts?: Map<string, AttemptState>;
};

const attempts = globalForRateLimit.loginAttempts ?? new Map<string, AttemptState>();

if (process.env.NODE_ENV !== 'production') {
  globalForRateLimit.loginAttempts = attempts;
}

export function getClientIp(headers: Headers) {
  const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwardedFor || headers.get('x-real-ip') || 'unknown';
}

export function isRateLimited(key: string, limit = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  return current.count > limit;
}

export function clearRateLimit(key: string) {
  attempts.delete(key);
}
