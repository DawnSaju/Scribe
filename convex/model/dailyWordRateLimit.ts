const HOUR_MS = 60 * 60 * 1000;

export interface DailyWordRateLimitState {
  windowStartedAt: number;
  count: number;
  lastRequestAt: number;
}

export function checkDailyWordRateLimit(
  state: DailyWordRateLimitState | null,
  now: number,
  maxRequestsPerHour: number,
  cooldownMs = 0
): { allowed: true; next: DailyWordRateLimitState } | { allowed: false; retryAfterSeconds: number } {
  const windowStartedAt = Math.floor(now / HOUR_MS) * HOUR_MS;
  const count = state?.windowStartedAt === windowStartedAt ? state.count : 0;
  const quotaRetryAt = count >= maxRequestsPerHour ? windowStartedAt + HOUR_MS : 0;
  const cooldownRetryAt = state ? state.lastRequestAt + cooldownMs : 0;
  const retryAt = Math.max(quotaRetryAt, cooldownRetryAt);

  if (retryAt > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((retryAt - now) / 1000) };
  }

  return {
    allowed: true,
    next: { windowStartedAt, count: count + 1, lastRequestAt: now },
  };
}
