// Shared types for code registry
export interface RegisteredCodeSnippet {
  id: string;
  code: string;
  language: string;
  title?: string;
  description?: string;
  highlightLines?: number[];
}

export interface GeneratedRegistry {
  files: Record<string, { raw: string; highlighted: string; metadata?: any }>;
  lastGenerated: string;
}
