/**
 * Git operations for retrieving commit history
 */

import simpleGit, { SimpleGit, LogResult } from 'simple-git';
import { GitCommit } from './types';

export class GitRepository {
  private git: SimpleGit;

  constructor(repoPath: string) {
    this.git = simpleGit(repoPath);
  }

  /**
   * Get commits between two references (tags, branches, commit hashes)
   */
  async getCommits(from?: string, to: string = 'HEAD'): Promise<GitCommit[]> {
    try {
      // Check if it's a git repository
      const isRepo = await this.git.checkIsRepo();
      if (!isRepo) {
        throw new Error('Not a git repository');
      }

      let logOptions: any = {
        format: {
          hash: '%H',
          author: '%an',
          email: '%ae',
          date: '%ai',
          message: '%s',
          body: '%b',
        },
      };

      // If from is specified, get commits between from and to
      if (from) {
        logOptions.from = from;
        logOptions.to = to;
      }

      const log: LogResult = await this.git.log(logOptions);

      return log.all.map((commit: any) => ({
        hash: commit.hash,
        author: commit.author,
        email: commit.email,
        date: new Date(commit.date),
        message: commit.message,
        body: commit.body?.trim() || undefined,
      }));
    } catch (error) {
      throw new Error(`Failed to retrieve git commits: ${error}`);
    }
  }

  /**
   * Get the latest tag
   */
  async getLatestTag(): Promise<string | null> {
    try {
      const tags = await this.git.tags(['--sort=-v:refname']);
      return tags.latest || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<string[]> {
    try {
      const tags = await this.git.tags();
      return tags.all;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get repository URL
   */
  async getRepositoryUrl(): Promise<string | null> {
    try {
      const remotes = await this.git.getRemotes(true);
      const origin = remotes.find(r => r.name === 'origin');

      if (origin?.refs?.fetch) {
        // Convert SSH URL to HTTPS
        let url = origin.refs.fetch;
        url = url.replace(/^git@([^:]+):/, 'https://$1/');
        url = url.replace(/\.git$/, '');
        return url;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    try {
      const branch = await this.git.revparse(['--abbrev-ref', 'HEAD']);
      return branch.trim();
    } catch (error) {
      throw new Error(`Failed to get current branch: ${error}`);
    }
  }
}
