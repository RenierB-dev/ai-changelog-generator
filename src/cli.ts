#!/usr/bin/env node

import { Command } from 'commander';
import { config } from 'dotenv';
import { writeFile } from 'fs/promises';
import { GitService } from './git.js';
import { AIService } from './ai.js';

config();

const program = new Command();

program
  .name('changelog-gen')
  .description('AI-powered changelog generator using Claude')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate a changelog between two git references')
  .requiredOption('--from <ref>', 'Starting git reference (tag, commit, branch)')
  .requiredOption('--to <ref>', 'Ending git reference (tag, commit, branch)')
  .option('-o, --output <file>', 'Output file path', 'CHANGELOG.md')
  .option('--repo <path>', 'Path to git repository', process.cwd())
  .action(async (options) => {
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        console.error('Error: ANTHROPIC_API_KEY environment variable is not set');
        console.error('Please create a .env file with your API key or set it in your environment');
        process.exit(1);
      }

      console.log('🔍 Fetching git commits...');
      const gitService = new GitService(options.repo);

      // Validate references
      const fromValid = await gitService.isValidRef(options.from);
      const toValid = await gitService.isValidRef(options.to);

      if (!fromValid) {
        console.error(`Error: Invalid 'from' reference: ${options.from}`);
        process.exit(1);
      }

      if (!toValid) {
        console.error(`Error: Invalid 'to' reference: ${options.to}`);
        process.exit(1);
      }

      const commits = await gitService.getCommitsBetween(options.from, options.to);

      if (commits.length === 0) {
        console.log('No commits found between the specified references.');
        process.exit(0);
      }

      console.log(`✅ Found ${commits.length} commits`);
      console.log('🤖 Generating changelog with Claude AI...');

      const aiService = new AIService(apiKey);
      const changelog = await aiService.generateChangelog(
        commits,
        options.from,
        options.to
      );

      console.log('💾 Writing changelog to file...');
      await writeFile(options.output, changelog, 'utf-8');

      console.log(`✨ Changelog generated successfully: ${options.output}`);
      console.log('\nPreview:');
      console.log('─'.repeat(80));
      console.log(changelog.split('\n').slice(0, 20).join('\n'));
      if (changelog.split('\n').length > 20) {
        console.log('...');
      }
      console.log('─'.repeat(80));
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('An unexpected error occurred');
      }
      process.exit(1);
    }
  });

// Shorthand command (default)
program
  .option('--from <ref>', 'Starting git reference (tag, commit, branch)')
  .option('--to <ref>', 'Ending git reference (tag, commit, branch)')
  .option('-o, --output <file>', 'Output file path', 'CHANGELOG.md')
  .option('--repo <path>', 'Path to git repository', process.cwd())
  .action(async (options) => {
    if (options.from && options.to) {
      // Run generate command with these options
      const generateCmd = program.commands.find(cmd => cmd.name() === 'generate');
      if (generateCmd) {
        await generateCmd.parseAsync(['node', 'cli', '--from', options.from, '--to', options.to, '--output', options.output, '--repo', options.repo]);
      }
    } else {
      program.help();
    }
  });

program.parse();
