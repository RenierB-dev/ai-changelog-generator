export interface Commit {
  hash: string;
  message: string;
  author: string;
  date: string;
  body?: string;
}

export interface CategorizedCommit extends Commit {
  category: string;
}

export type ChangelogCategory =
  | 'Features'
  | 'Bug Fixes'
  | 'Performance'
  | 'Documentation'
  | 'Refactoring'
  | 'Testing'
  | 'Build'
  | 'CI/CD'
  | 'Dependencies'
  | 'Other';

export interface ChangelogOptions {
  useAI: boolean;
  fromTag?: string;
  toTag?: string;
  format?: 'markdown' | 'json';
}
