#!/usr/bin/env node

import { Command } from 'commander';
import { ChangelogGenerator } from './changelog';

const program = new Command();

program
  .name('changelog-gen')
  .description('Generate changelogs from git commits with optional AI categorization')
  .version('1.0.0')
  .option('--ai', 'Use AI for categorization (requires ANTHROPIC_API_KEY)', false)
  .option('--from <tag>', 'Starting git tag/commit')
  .option('--to <tag>', 'Ending git tag/commit (defaults to HEAD)')
  .option('--format <type>', 'Output format: markdown or json', 'markdown')
  .option('-o, --output <file>', 'Output file (if not specified, prints to stdout)')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    console.log('='.repeat(60));
    console.log('AI Changelog Generator');
    console.log('='.repeat(60));

    // Show mode
    if (options.ai) {
      console.log('Mode: AI-powered categorization');
      if (!process.env.ANTHROPIC_API_KEY) {
        console.log('\nWarning: --ai flag provided but ANTHROPIC_API_KEY not found!');
        console.log('Falling back to rule-based categorization...\n');
      }
    } else {
      console.log('Mode: Rule-based categorization (default)');
      console.log('Tip: Use --ai flag to enable AI-powered categorization\n');
    }

    const generator = new ChangelogGenerator();

    const changelog = await generator.generate({
      useAI: options.ai,
      fromTag: options.from,
      toTag: options.to,
      format: options.format,
    });

    if (options.output) {
      const fs = await import('fs/promises');
      await fs.writeFile(options.output, changelog, 'utf-8');
      console.log(`\nChangelog written to: ${options.output}`);
    } else {
      console.log('\n' + '='.repeat(60));
      console.log(changelog);
    }
  } catch (error) {
    console.error('Error generating changelog:', error);
    process.exit(1);
  }
}

main();
