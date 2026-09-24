import "server-only";
import type { DailyWordProviderConfig } from "../dailyWordProviders";

function requiredHttpsUrl(name: string): URL {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);

  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.hash) {
    throw new Error(`${name} must be an HTTPS URL without credentials or a fragment`);
  }
  return url;
}

function requiredHttpsOrigin(name: string): string {
  const url = requiredHttpsUrl(name);
  if (url.pathname !== "/" || url.search) {
    throw new Error(`${name} must contain only an HTTPS origin`);
  }
  return url.origin;
}

export function readDailyWordProviderConfig(): DailyWordProviderConfig {
  return {
    randomWordUrl: requiredHttpsUrl("DAILY_WORD_RANDOM_API_URL").href,
    dictionaryOrigin: requiredHttpsOrigin("DAILY_WORD_DICTIONARY_API_ORIGIN"),
    audioOrigin: requiredHttpsOrigin("DAILY_WORD_AUDIO_API_ORIGIN"),
    backupOrigin: requiredHttpsOrigin("DAILY_WORD_FALLBACK_API_ORIGIN"),
  };
}
