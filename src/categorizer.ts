/**
 * Conventional commit parser and categorizer
 */

import { Commit, ParsedCommit, CommitType } from './types';

export class CommitCategorizer {
  private static CONVENTIONAL_COMMIT_REGEX = /^(\w+)(?:\(([^)]+)\))?(!?):\s*(.+)$/;
  private static BREAKING_CHANGE_REGEX = /BREAKING[- ]CHANGE:\s*(.+)/i;

  /**
   * Parse a commit message using conventional commit format
   */
  static parseCommit(commit: Commit): ParsedCommit {
    const match = commit.message.match(this.CONVENTIONAL_COMMIT_REGEX);

    let type: CommitType = CommitType.OTHER;
    let scope: string | undefined;
    let subject: string = commit.message;
    let breaking = false;

    if (match) {
      const [, typeStr, scopeStr, breakingMarker, subjectStr] = match;
      type = this.normalizeType(typeStr);
      scope = scopeStr;
      subject = subjectStr.trim();
      breaking = breakingMarker === '!';
    }

    // Check for BREAKING CHANGE in commit body
    if (commit.body && this.BREAKING_CHANGE_REGEX.test(commit.body)) {
      breaking = true;
    }

    // If breaking change, override type
    if (breaking) {
      type = CommitType.BREAKING;
    }

    return {
      ...commit,
      type,
      scope,
      subject,
      breaking,
      isNoise: this.isNoiseCommit(commit.message),
    };
  }

  /**
   * Normalize commit type to known types
   */
  private static normalizeType(type: string): CommitType {
    const normalized = type.toLowerCase();

    switch (normalized) {
      case 'feat':
      case 'feature':
        return CommitType.FEATURE;
      case 'fix':
      case 'bugfix':
        return CommitType.FIX;
      case 'docs':
      case 'doc':
        return CommitType.DOCS;
      case 'style':
        return CommitType.STYLE;
      case 'refactor':
        return CommitType.REFACTOR;
      case 'perf':
      case 'performance':
        return CommitType.PERF;
      case 'test':
      case 'tests':
        return CommitType.TEST;
      case 'build':
        return CommitType.BUILD;
      case 'ci':
        return CommitType.CI;
      case 'chore':
        return CommitType.CHORE;
      case 'revert':
        return CommitType.REVERT;
      default:
        return CommitType.OTHER;
    }
  }

  /**
   * Check if a commit is noise (wip, temp, test, typo, merge, etc.)
   */
  private static isNoiseCommit(message: string): boolean {
    const lowerMessage = message.toLowerCase();

    const noisePatterns = [
      /^wip/i,
      /^temp/i,
      /^tmp/i,
      /^debug/i,
      /^typo/i,
      /^merge/i,
      /^merge branch/i,
      /^merge pull request/i,
      /^revert/i,
      /^fixup/i,
      /^squash/i,
      /^amend/i,
      /^test commit/i,
      /^testing/i,
      /^update readme/i,
      /^update \.gitignore/i,
      /^initial commit/i,
    ];

    return noisePatterns.some(pattern => pattern.test(lowerMessage));
  }

  /**
   * Categorize commits into sections
   */
  static categorizeCommits(commits: Commit[]): Map<CommitType, ParsedCommit[]> {
    const categories = new Map<CommitType, ParsedCommit[]>();

    for (const commit of commits) {
      const parsed = this.parseCommit(commit);

      // Skip noise commits
      if (parsed.isNoise) {
        continue;
      }

      if (!categories.has(parsed.type)) {
        categories.set(parsed.type, []);
      }

      categories.get(parsed.type)!.push(parsed);
    }

    return categories;
  }
}
