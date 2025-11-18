import { simpleGit } from 'simple-git';
import type { SimpleGit, DefaultLogFields, LogResult } from 'simple-git';
import type { Commit } from './types.js';

export class GitService {
  private git: SimpleGit;

  constructor(repoPath: string = process.cwd()) {
    this.git = simpleGit(repoPath);
  }

  async getCommitsBetween(from: string, to: string): Promise<Commit[]> {
    try {
      const log: LogResult<DefaultLogFields> = await this.git.log({
        from,
        to,
      });

      return log.all.map((commit: DefaultLogFields) => ({
        hash: commit.hash,
        date: commit.date,
        message: commit.message,
        author: commit.author_name,
        body: commit.body,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch git commits: ${error.message}`);
      }
      throw error;
    }
  }

  async getCurrentBranch(): Promise<string> {
    try {
      const status = await this.git.status();
      return status.current || 'unknown';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get current branch: ${error.message}`);
      }
      throw error;
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const tags = await this.git.tags();
      return tags.all;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch tags: ${error.message}`);
      }
      throw error;
    }
  }

  async isValidRef(ref: string): Promise<boolean> {
    try {
      await this.git.revparse([ref]);
      return true;
    } catch {
      return false;
    }
  }
}
