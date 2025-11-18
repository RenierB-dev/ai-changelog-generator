/**
 * Configuration management for the AI Changelog Generator
 */

import * as dotenv from 'dotenv';
import { Config } from './types';
import * as path from 'path';

// Load environment variables
dotenv.config();

export function loadConfig(): Config {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY is required. Please set it in your .env file or environment variables.'
    );
  }

  return {
    apiKey,
    model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
    repoPath: process.env.GIT_REPO_PATH || process.cwd(),
    defaultFormat: 'markdown',
  };
}

export function validateConfig(config: Config): void {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  if (!config.model) {
    throw new Error('Model is required');
  }

  if (!config.repoPath) {
    throw new Error('Repository path is required');
  }
}
