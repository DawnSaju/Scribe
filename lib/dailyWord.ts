export interface DailyWord {
  word: string;
  phonetic?: string;
  phonetics: Array<{ text: string; audio: string }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
    synonyms: string[];
    antonyms: string[];
  }>;
}
