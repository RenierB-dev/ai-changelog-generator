/**
 * Main changelog generation logic
 */

import { GitRepository } from './git';
import { AIAnalyzer } from './ai';
import { ChangelogFormatter } from './formatter';
import { ChangelogOptions, Changelog } from './types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class ChangelogGenerator {
  private git: GitRepository;
  private ai: AIAnalyzer;

  constructor(repoPath: string, apiKey: string, model: string) {
    this.git = new GitRepository(repoPath);
    this.ai = new AIAnalyzer(apiKey, model);
  }

  /**
   * Generate a changelog
   */
  async generate(options: ChangelogOptions = {}): Promise<string> {
    try {
      // Get commits
      console.log('📦 Fetching git commits...');
      const commits = await this.git.getCommits(options.from, options.to);
      console.log(`Found ${commits.length} commits`);

      if (commits.length === 0) {
        return 'No commits found in the specified range.';
      }

      // Get repository URL if needed
      if (options.includeCommitLinks && !options.repoUrl) {
        options.repoUrl = (await this.git.getRepositoryUrl()) || undefined;
      }

      // Generate changelog with AI
      console.log('🤖 Generating changelog with AI...');
      const { changelog } = await this.ai.generateChangelog(commits);

      // Attach commits to entries for formatting
      for (const entry of changelog.entries) {
        entry.commits = commits;
      }

      // Format changelog
      console.log('📝 Formatting changelog...');
      const formatted = this.formatChangelog(changelog, options);

      // Save to file if specified
      if (options.outputFile) {
        await this.saveToFile(formatted, options.outputFile);
        console.log(`✅ Changelog saved to ${options.outputFile}`);
      }

      return formatted;
    } catch (error) {
      throw new Error(`Failed to generate changelog: ${error}`);
    }
  }

  /**
   * Format the changelog according to options
   */
  private formatChangelog(changelog: Changelog, options: ChangelogOptions): string {
    const format = options.format || 'markdown';

    switch (format) {
      case 'markdown':
        return ChangelogFormatter.toMarkdown(changelog, options);
      case 'json':
        return ChangelogFormatter.toJSON(changelog, options);
      case 'html':
        return ChangelogFormatter.toHTML(changelog, options);
      default:
        return ChangelogFormatter.toMarkdown(changelog, options);
    }
  }

  /**
   * Save changelog to file
   */
  private async saveToFile(content: string, filePath: string): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save changelog: ${error}`);
    }
  }

  /**
   * Get the latest tag
   */
  async getLatestTag(): Promise<string | null> {
    return this.git.getLatestTag();
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    return this.git.getTags();
  }
}
