/**
 * Tests for Git operations
 */

import { GitRepository } from '../src/git';

describe('GitRepository', () => {
  it('should create a GitRepository instance', () => {
    const repo = new GitRepository(process.cwd());
    expect(repo).toBeInstanceOf(GitRepository);
  });

  // Add more tests here
});
