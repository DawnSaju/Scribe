import type { DailyWord } from "./dailyWord";

export type Fetcher = (url: string, init?: RequestInit) => Promise<Response>;

export interface DailyWordProviderConfig {
  randomWordUrl: string;
  dictionaryOrigin: string;
  audioOrigin: string;
  backupOrigin: string;
}

const REQUEST_TIMEOUT_MS = 3_500;
const MAX_CANDIDATES = 5;

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.flatMap((item) => string(item) ?? []) : [];
}

function audioUrl(value: unknown, base: string): string {
  const raw = string(value);
  if (!raw || !/^(https?:)?\/\//i.test(raw)) return "";

  try {
    const url = new URL(raw, base);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

async function requestJson(url: string, fetcher: Fetcher): Promise<unknown> {
  const response = await fetcher(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`Dictionary request failed: ${response.status}`);
  return response.json();
}

export function normalizeDictionaryEntry(data: unknown, origin: string): DailyWord | null {
  if (!Array.isArray(data)) return null;
  const entry = data.map(record).find((item) => item && string(item.word));
  if (!entry) return null;

  const meanings = (Array.isArray(entry.meanings) ? entry.meanings : []).flatMap((rawMeaning) => {
    const meaning = record(rawMeaning);
    if (!meaning) return [];
    const definitions = (Array.isArray(meaning.definitions) ? meaning.definitions : []).flatMap((rawDefinition) => {
      const definition = record(rawDefinition);
      const text = string(definition?.definition);
      if (!text) return [];
      return [{
        definition: text,
        example: string(definition?.example),
        synonyms: strings(definition?.synonyms),
        antonyms: strings(definition?.antonyms),
      }];
    });
    if (!definitions.length) return [];
    return [{
      partOfSpeech: string(meaning.partOfSpeech) ?? "word",
      definitions,
      synonyms: strings(meaning.synonyms),
      antonyms: strings(meaning.antonyms),
    }];
  });
  if (!meanings.length) return null;

  const phonetics = (Array.isArray(entry.phonetics) ? entry.phonetics : []).flatMap((rawPhonetic) => {
    const phonetic = record(rawPhonetic);
    if (!phonetic) return [];
    const text = string(phonetic.text) ?? "";
    const audio = audioUrl(phonetic.audio, origin);
    return text || audio ? [{ text, audio }] : [];
  });

  return {
    word: string(entry.word)!,
    phonetic: string(entry.phonetic) ?? phonetics.find((item) => item.text)?.text,
    phonetics,
    meanings,
  };
}

export function normalizeBackupEntry(data: unknown): DailyWord | null {
  const result = record(data);
  const word = string(result?.word);
  if (!word) return null;

  const entries = Array.isArray(result?.entries) ? result.entries : [];
  const meanings = entries.flatMap((rawEntry) => {
    const entry = record(rawEntry);
    if (!entry) return [];
    const senses = Array.isArray(entry.senses) ? entry.senses : [];
    const definitions = senses.flatMap((rawSense) => {
      const sense = record(rawSense);
      const definition = string(sense?.definition);
      if (!definition) return [];
      return [{
        definition,
        example: strings(sense?.examples)[0],
        synonyms: strings(sense?.synonyms),
        antonyms: strings(sense?.antonyms),
      }];
    });
    if (!definitions.length) return [];
    return [{
      partOfSpeech: string(entry.partOfSpeech) ?? "word",
      definitions,
      synonyms: strings(entry.synonyms),
      antonyms: strings(entry.antonyms),
    }];
  });
  if (!meanings.length) return null;

  const phonetics = entries.flatMap((rawEntry) => {
    const entry = record(rawEntry);
    const pronunciations = Array.isArray(entry?.pronunciations) ? entry.pronunciations : [];
    return pronunciations.flatMap((rawPronunciation) => {
      const pronunciation = record(rawPronunciation);
      const text = string(pronunciation?.text);
      return text ? [{ text, audio: "" }] : [];
    });
  });
  return {
    word,
    phonetic: phonetics[0]?.text,
    phonetics,
    meanings,
  };
}

export function normalizeAudioBackupEntry(data: unknown, origin: string): DailyWord | null {
  const result = record(data);
  const word = string(result?.word);
  if (!word) return null;

  const meanings = (Array.isArray(result?.meanings) ? result.meanings : []).flatMap((rawMeaning) => {
    const meaning = record(rawMeaning);
    if (!meaning) return [];
    const definitions = (Array.isArray(meaning.senses) ? meaning.senses : []).flatMap((rawSense) => {
      const sense = record(rawSense);
      const definition = strings(sense?.glosses)[0];
      if (!definition) return [];
      return [{
        definition,
        example: strings(sense?.examples)[0],
        synonyms: [],
        antonyms: [],
      }];
    });
    if (!definitions.length) return [];
    return [{
      partOfSpeech: string(meaning.partOfSpeech) ?? "word",
      definitions,
      synonyms: [],
      antonyms: [],
    }];
  });
  if (!meanings.length) return null;

  const phonetic = string(result?.ipa);
  const audio = audioUrl(result?.audioUrl, origin);
  return {
    word,
    phonetic,
    phonetics: audio ? [{ text: phonetic ?? "", audio }] : [],
    meanings,
  };
}

function candidateWords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const words = [...new Set(value
    .map(string)
    .filter((word): word is string => Boolean(word && /^[a-z][a-z'-]{1,29}$/i.test(word))))];
  for (let index = words.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [words[index], words[randomIndex]] = [words[randomIndex], words[index]];
  }
  return words.slice(0, MAX_CANDIDATES);
}

function sameWord(entry: DailyWord | null, requested: string): entry is DailyWord {
  return Boolean(entry && entry.word.toLocaleLowerCase("en") === requested.toLocaleLowerCase("en"));
}

function hasAudio(entry: DailyWord): boolean {
  return entry.phonetics.some((phonetic) => Boolean(phonetic.audio));
}

async function getCandidateWords(config: DailyWordProviderConfig, fetcher: Fetcher): Promise<string[]> {
  try {
    const words = candidateWords(await requestJson(config.randomWordUrl, fetcher));
    if (words.length) return words;
  } catch {
    // Try the secondary provider's word list without selecting its shared daily word.
  }

  const letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  for (const page of [1 + Math.floor(Math.random() * 20), 1]) {
    try {
      const words = candidateWords(await requestJson(
        `${config.audioOrigin}/dictionaryapi/v1/words/en/?filter=${letter}&page=${page}&size=10`,
        fetcher
      ));
      if (words.length) return words;
    } catch {
      // The next page is a bounded retry for an empty or unavailable word list.
    }
  }

  return [];
}

export async function getDailyWordFromApis(
  config: DailyWordProviderConfig,
  fetcher: Fetcher = fetch
): Promise<DailyWord> {
  const words = await getCandidateWords(config, fetcher);

  let withoutAudio: DailyWord | null = null;
  let primaryAvailable = true;
  let audioAvailable = true;
  for (const word of words) {
    if (primaryAvailable) {
      try {
        const data = await requestJson(
          `${config.dictionaryOrigin}/api/v2/entries/en/${encodeURIComponent(word)}`,
          fetcher
        );
        const entry = normalizeDictionaryEntry(data, config.dictionaryOrigin);
        if (sameWord(entry, word)) {
          if (hasAudio(entry)) return entry;
          withoutAudio ??= entry;
        }
      } catch (error) {
        if (!(error instanceof Error) || !error.message.endsWith(": 404")) {
          primaryAvailable = false;
        }
      }
    }

    if (audioAvailable) {
      try {
        const data = await requestJson(
          `${config.audioOrigin}/dictionaryapi/v1/definitions/en/${encodeURIComponent(word)}`,
          fetcher
        );
        const entry = normalizeAudioBackupEntry(data, config.audioOrigin);
        if (sameWord(entry, word)) {
          if (hasAudio(entry)) return entry;
          withoutAudio ??= entry;
        }
      } catch (error) {
        if (!(error instanceof Error) || !error.message.endsWith(": 404")) {
          audioAvailable = false;
        }
      }
    }

    if (!primaryAvailable && !audioAvailable) break;
  }

  if (withoutAudio) return withoutAudio;
  // Keep this provider to one request per lookup to respect its per-IP hourly limit.
  for (const word of words.slice(0, 1)) {
    try {
      const data = await requestJson(
        `${config.backupOrigin}/api/v1/entries/en/${encodeURIComponent(word)}`,
        fetcher
      );
      const entry = normalizeBackupEntry(data);
      if (sameWord(entry, word)) return entry;
    } catch (error) {
      if (!(error instanceof Error) || !error.message.endsWith(": 404")) {
        break;
      }
    }
  }

  throw new Error("No dictionary provider returned an entry for the candidate words");
}
