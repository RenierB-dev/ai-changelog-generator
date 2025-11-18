/**
 * Main changelog generator orchestrator
 */

import { GitParser } from './git-parser';
import { CommitCategorizer } from './categorizer';
import { MarkdownFormatter } from './formatter';
import { ChangelogOptions, GeneratedChangelog } from './types';

export class ChangelogGenerator {
  private gitParser: GitParser;

  constructor(repoPath: string = process.cwd()) {
    this.gitParser = new GitParser(repoPath);
  }

  /**
   * Generate changelog with rule-based approach
   */
  async generate(options: ChangelogOptions = {}): Promise<string> {
    // Verify we're in a git repository
    const isRepo = await this.gitParser.isGitRepo();
    if (!isRepo) {
      throw new Error('Not a git repository. Please run this command in a git repository.');
    }

    // Determine the range
    const from = options.from;
    const to = options.to || 'HEAD';

    // Get commits
    const commits = await this.gitParser.getCommitsBetween(from, to);

    if (commits.length === 0) {
      return this.generateEmptyChangelog(from, to);
    }

    // Categorize commits using conventional commit patterns
    const categories = CommitCategorizer.categorizeCommits(commits);

    // Create sections
    const sections = MarkdownFormatter.createSections(categories);

    // Build changelog object
    const changelog: GeneratedChangelog = {
      version: options.to || 'Unreleased',
      date: new Date(),
      sections,
    };

    // Format as markdown
    return MarkdownFormatter.formatChangelog(changelog);
  }

  /**
   * Generate changelog since last tag
   */
  async generateSinceLastTag(): Promise<string> {
    const latestTag = await this.gitParser.getLatestTag();

    if (!latestTag) {
      console.log('No tags found. Generating changelog for all commits...');
      return this.generate({ from: undefined, to: 'HEAD' });
    }

    console.log(`Generating changelog since tag: ${latestTag}`);
    return this.generate({ from: latestTag, to: 'HEAD' });
  }

  /**
   * Generate empty changelog message
   */
  private generateEmptyChangelog(from?: string, to?: string): string {
    const range = from ? `${from}..${to}` : to || 'HEAD';
    return [
      '# Changelog',
      '',
      `## No Changes Found`,
      '',
      `No commits found in range: ${range}`,
      '',
      'This could mean:',
      '- The range is empty',
      '- All commits were filtered as noise (wip, temp, merge, etc.)',
      '- You need to make some commits first!',
      '',
    ].join('\n');
  }

  /**
   * Get available tags
   */
  async getTags(): Promise<string[]> {
    return this.gitParser.getTags();
  }

  /**
   * Get latest tag
   */
  async getLatestTag(): Promise<string | null> {
    return this.gitParser.getLatestTag();
  }
}
