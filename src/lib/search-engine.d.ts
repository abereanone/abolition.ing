export interface SearchDocument {
  id?: number | string | null;
  slug: string;
  title: string;
  categories?: string[];
  relatedAnswers?: number[];
  excerpt?: string;
  content?: string;
  [key: string]: unknown;
}

export interface SearchEngine {
  documents: Map<string, SearchDocumentRecord>;
  invertedIndex: Map<string, Array<{ docId: string; weight: number }>>;
}

export interface SearchDocumentRecord extends SearchDocument {
  docId: string;
  normalizedTitle: string;
  normalizedContent: string;
  normalizedCategories: string[];
  tokenCount: number;
}

export interface SearchOptions {
  limit?: number;
  categories?: string[];
}

export interface SearchResult {
  id?: number | string | null;
  slug: string;
  title: string;
  highlightedTitle?: string;
  categories?: string[];
  excerpt?: string;
  snippet?: string;
  relatedAnswers?: number[];
  score: number;
  url: string;
}

export interface SearchResponse {
  total: number;
  items: SearchResult[];
}

export function createSearchEngine(dataset?: SearchDocument[]): SearchEngine;
export function searchIndex(engine: SearchEngine, query: string, options?: SearchOptions): SearchResponse;
export function clampNumber(value: number, min: number, max: number): number;
export const STOP_WORDS: Set<string>;
