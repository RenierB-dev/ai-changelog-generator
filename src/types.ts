/**
 * Core types for changelog generation
 */

export interface Commit {
  hash: string;
  message: string;
  author: string;
  date: Date;
  body?: string;
}

export interface ParsedCommit extends Commit {
  type: CommitType;
  scope?: string;
  subject: string;
  breaking: boolean;
  isNoise: boolean;
}

export enum CommitType {
  FEATURE = 'feat',
  FIX = 'fix',
  BREAKING = 'breaking',
  CHORE = 'chore',
  DOCS = 'docs',
  STYLE = 'style',
  REFACTOR = 'refactor',
  PERF = 'perf',
  TEST = 'test',
  BUILD = 'build',
  CI = 'ci',
  REVERT = 'revert',
  OTHER = 'other',
}

export interface ChangelogSection {
  title: string;
  commits: ParsedCommit[];
}

export interface ChangelogOptions {
  from?: string;
  to?: string;
  useAI?: boolean;
  output?: string;
}

export interface GeneratedChangelog {
  version?: string;
  date: Date;
  sections: ChangelogSection[];
}
