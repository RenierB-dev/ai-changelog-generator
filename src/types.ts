/**
 * Type definitions for the AI Changelog Generator
 */

export interface GitCommit {
  hash: string;
  author: string;
  email: string;
  date: Date;
  message: string;
  body?: string;
}

export interface ChangelogOptions {
  from?: string;
  to?: string;
  format?: 'markdown' | 'json' | 'html';
  outputFile?: string;
  groupBy?: 'type' | 'author' | 'date' | 'none';
  includeAuthors?: boolean;
  includeCommitLinks?: boolean;
  repoUrl?: string;
  template?: string;
}

export interface ChangelogEntry {
  type: string;
  description: string;
  commits: GitCommit[];
  scope?: string;
  breaking?: boolean;
}

export interface Changelog {
  version?: string;
  date: Date;
  entries: ChangelogEntry[];
  summary?: string;
}

export interface AIAnalysisResult {
  changelog: Changelog;
  rawResponse: string;
}

export interface Config {
  apiKey: string;
  model: string;
  repoPath: string;
  defaultFormat: 'markdown' | 'json' | 'html';
}
