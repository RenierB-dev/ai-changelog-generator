#!/usr/bin/env node

/**
 * AI Changelog Generator - CLI Entry Point
 */

import { Command } from 'commander';
import { ChangelogGenerator } from './changelog';
import { loadConfig, validateConfig } from './config';
import { ChangelogOptions } from './types';

const program = new Command();

program
  .name('ai-changelog')
  .description('AI-powered changelog generator using Git commits and Claude AI')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate a changelog from git commits')
  .option('-f, --from <ref>', 'Starting git reference (tag, branch, or commit hash)')
  .option('-t, --to <ref>', 'Ending git reference (default: HEAD)', 'HEAD')
  .option('--format <format>', 'Output format: markdown, json, or html', 'markdown')
  .option('-o, --output <file>', 'Output file path')
  .option('--group-by <type>', 'Group by: type, author, date, or none', 'type')
  .option('--include-authors', 'Include commit authors in the changelog')
  .option('--include-commit-links', 'Include links to commits')
  .option('--repo-url <url>', 'Repository URL for commit links')
  .action(async (options) => {
    try {
      // Load configuration
      const config = loadConfig();
      validateConfig(config);

      // Create changelog generator
      const generator = new ChangelogGenerator(config.repoPath, config.apiKey, config.model);

      // If no 'from' specified, try to use the latest tag
      if (!options.from) {
        console.log('No starting reference specified, looking for latest tag...');
        const latestTag = await generator.getLatestTag();
        if (latestTag) {
          console.log(`Using latest tag: ${latestTag}`);
          options.from = latestTag;
        } else {
          console.log('No tags found, generating changelog from all commits');
        }
      }

      // Build options
      const changelogOptions: ChangelogOptions = {
        from: options.from,
        to: options.to,
        format: options.format,
        outputFile: options.output,
        groupBy: options.groupBy,
        includeAuthors: options.includeAuthors,
        includeCommitLinks: options.includeCommitLinks,
        repoUrl: options.repoUrl,
      };

      // Generate changelog
      const changelog = await generator.generate(changelogOptions);

      // Print to console if no output file specified
      if (!options.output) {
        console.log('\n' + changelog);
      }

      console.log('\n✨ Done!');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('tags')
  .description('List all git tags in the repository')
  .action(async () => {
    try {
      const config = loadConfig();
      const generator = new ChangelogGenerator(config.repoPath, config.apiKey, config.model);
      const tags = await generator.getTags();

      if (tags.length === 0) {
        console.log('No tags found in the repository');
      } else {
        console.log('Available tags:');
        tags.forEach((tag) => console.log(`  - ${tag}`));
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize configuration with .env file')
  .action(async () => {
    const fs = require('fs');
    const path = require('path');

    const envPath = path.join(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
      console.log('.env file already exists');
      return;
    }

    const envContent = `# Anthropic API Key
ANTHROPIC_API_KEY=your_api_key_here

# Optional: Custom model (default: claude-3-5-sonnet-20241022)
# CLAUDE_MODEL=claude-3-5-sonnet-20241022

# Optional: Git repository path (default: current directory)
# GIT_REPO_PATH=/path/to/repo
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file. Please add your ANTHROPIC_API_KEY.');
  });

// Parse arguments
program.parse();
