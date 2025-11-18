/**
 * Markdown formatter for changelog output
 */

import { GeneratedChangelog, ChangelogSection, ParsedCommit, CommitType } from './types';

export class MarkdownFormatter {
  /**
   * Get section title for a commit type
   */
  private static getSectionTitle(type: CommitType): string {
    switch (type) {
      case CommitType.BREAKING:
        return '⚠️ BREAKING CHANGES';
      case CommitType.FEATURE:
        return '✨ Features';
      case CommitType.FIX:
        return '🐛 Bug Fixes';
      case CommitType.PERF:
        return '⚡ Performance Improvements';
      case CommitType.REFACTOR:
        return '♻️ Code Refactoring';
      case CommitType.DOCS:
        return '📝 Documentation';
      case CommitType.STYLE:
        return '💄 Styling';
      case CommitType.TEST:
        return '✅ Tests';
      case CommitType.BUILD:
        return '🔧 Build System';
      case CommitType.CI:
        return '👷 CI/CD';
      case CommitType.CHORE:
        return '🔨 Chores';
      case CommitType.REVERT:
        return '⏪ Reverts';
      default:
        return '📦 Other Changes';
    }
  }

  /**
   * Get section order priority
   */
  private static getSectionPriority(type: CommitType): number {
    const order = [
      CommitType.BREAKING,
      CommitType.FEATURE,
      CommitType.FIX,
      CommitType.PERF,
      CommitType.REFACTOR,
      CommitType.DOCS,
      CommitType.STYLE,
      CommitType.TEST,
      CommitType.BUILD,
      CommitType.CI,
      CommitType.CHORE,
      CommitType.REVERT,
      CommitType.OTHER,
    ];

    const index = order.indexOf(type);
    return index === -1 ? 999 : index;
  }

  /**
   * Format a single commit as markdown
   */
  private static formatCommit(commit: ParsedCommit): string {
    const scope = commit.scope ? `**${commit.scope}:** ` : '';
    const subject = commit.subject || commit.message;
    const hash = commit.hash.substring(0, 7);

    return `- ${scope}${subject} ([${hash}](../../commit/${commit.hash}))`;
  }

  /**
   * Format a changelog section
   */
  private static formatSection(section: ChangelogSection): string {
    if (section.commits.length === 0) {
      return '';
    }

    const lines = [
      `### ${section.title}`,
      '',
      ...section.commits.map(commit => this.formatCommit(commit)),
      '',
    ];

    return lines.join('\n');
  }

  /**
   * Format the complete changelog
   */
  static formatChangelog(changelog: GeneratedChangelog): string {
    const { version, date, sections } = changelog;

    const header = [
      `# Changelog`,
      '',
      `## ${version || 'Unreleased'} - ${date.toISOString().split('T')[0]}`,
      '',
    ];

    // Sort sections by priority
    const sortedSections = sections.sort((a, b) => {
      // Extract type from section title by comparing with known titles
      const typeA = this.getTypeFromTitle(a.title);
      const typeB = this.getTypeFromTitle(b.title);
      return this.getSectionPriority(typeA) - this.getSectionPriority(typeB);
    });

    const body = sortedSections
      .map(section => this.formatSection(section))
      .filter(section => section.length > 0)
      .join('\n');

    return header.join('\n') + body;
  }

  /**
   * Get commit type from section title
   */
  private static getTypeFromTitle(title: string): CommitType {
    if (title.includes('BREAKING')) return CommitType.BREAKING;
    if (title.includes('Features')) return CommitType.FEATURE;
    if (title.includes('Bug Fixes')) return CommitType.FIX;
    if (title.includes('Performance')) return CommitType.PERF;
    if (title.includes('Refactoring')) return CommitType.REFACTOR;
    if (title.includes('Documentation')) return CommitType.DOCS;
    if (title.includes('Styling')) return CommitType.STYLE;
    if (title.includes('Tests')) return CommitType.TEST;
    if (title.includes('Build')) return CommitType.BUILD;
    if (title.includes('CI')) return CommitType.CI;
    if (title.includes('Chores')) return CommitType.CHORE;
    if (title.includes('Reverts')) return CommitType.REVERT;
    return CommitType.OTHER;
  }

  /**
   * Create sections from categorized commits
   */
  static createSections(categories: Map<CommitType, ParsedCommit[]>): ChangelogSection[] {
    const sections: ChangelogSection[] = [];

    for (const [type, commits] of categories.entries()) {
      if (commits.length > 0) {
        sections.push({
          title: this.getSectionTitle(type),
          commits,
        });
      }
    }

    return sections;
  }
}
