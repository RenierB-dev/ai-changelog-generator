/**
 * Git operations and commit parsing
 */

import simpleGit, { SimpleGit, DefaultLogFields } from 'simple-git';
import { Commit } from './types';

export class GitParser {
  private git: SimpleGit;

  constructor(repoPath: string = process.cwd()) {
    this.git = simpleGit(repoPath);
  }

  /**
   * Check if current directory is a git repository
   */
  async isGitRepo(): Promise<boolean> {
    try {
      await this.git.status();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all tags sorted by version
   */
  async getTags(): Promise<string[]> {
    const tags = await this.git.tags();
    return tags.all;
  }

  /**
   * Get the latest tag
   */
  async getLatestTag(): Promise<string | null> {
    const tags = await this.getTags();
    return tags.length > 0 ? tags[tags.length - 1] : null;
  }

  /**
   * Get commits between two references (tags, commits, or HEAD)
   */
  async getCommitsBetween(from?: string, to: string = 'HEAD'): Promise<Commit[]> {
    try {
      // If no 'from' is specified, get all commits up to 'to'
      const range = from ? `${from}..${to}` : to;

      const log = await this.git.log({
        from: from || undefined,
        to: to,
      });

      return log.all.map((commit: DefaultLogFields) => ({
        hash: commit.hash,
        message: commit.message,
        author: commit.author_name,
        date: new Date(commit.date),
        body: commit.body,
      }));
    } catch (error) {
      throw new Error(`Failed to get commits: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all commits since the last tag
   */
  async getCommitsSinceLastTag(): Promise<Commit[]> {
    const latestTag = await this.getLatestTag();
    return this.getCommitsBetween(latestTag || undefined, 'HEAD');
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    const status = await this.git.status();
    return status.current || 'unknown';
  }
}
