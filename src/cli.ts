#!/usr/bin/env node

/**
 * CLI interface for the changelog generator
 */

import { Command } from 'commander';
import { ChangelogGenerator } from './generator';
import * as fs from 'fs/promises';
import * as path from 'path';

const program = new Command();

async function main() {
  program
    .name('changelog')
    .description('Smart changelog generator with rule-based core and optional AI enhancements')
    .version('1.0.0');

  program
    .command('generate')
    .description('Generate changelog from git commits')
    .option('-f, --from <ref>', 'Starting git reference (tag, commit, branch)')
    .option('-t, --to <ref>', 'Ending git reference (default: HEAD)', 'HEAD')
    .option('-o, --output <file>', 'Output file path (default: stdout)')
    .option('--ai', 'Use AI to enhance changelog (requires ANTHROPIC_API_KEY)', false)
    .option('--since-last-tag', 'Generate changelog since the last tag', false)
    .action(async (options) => {
      try {
        const generator = new ChangelogGenerator();

        console.log('🚀 Generating changelog...\n');

        let changelog: string;

        if (options.sinceLastTag) {
          changelog = await generator.generateSinceLastTag();
        } else {
          changelog = await generator.generate({
            from: options.from,
            to: options.to,
            useAI: options.ai,
          });
        }

        // Output
        if (options.output) {
          const outputPath = path.resolve(options.output);
          await fs.writeFile(outputPath, changelog, 'utf-8');
          console.log(`✅ Changelog written to: ${outputPath}`);
        } else {
          console.log(changelog);
        }

        if (options.ai) {
          console.log('\n💡 AI enhancement requested but not yet implemented (Phase 2 feature)');
          console.log('   For now, showing rule-based changelog.');
        }
      } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  program
    .command('tags')
    .description('List all available tags in the repository')
    .action(async () => {
      try {
        const generator = new ChangelogGenerator();
        const tags = await generator.getTags();

        if (tags.length === 0) {
          console.log('No tags found in this repository.');
          return;
        }

        console.log('Available tags:');
        tags.forEach(tag => console.log(`  - ${tag}`));

        const latest = await generator.getLatestTag();
        if (latest) {
          console.log(`\nLatest tag: ${latest}`);
        }
      } catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      }
    });

  program
    .command('init')
    .description('Initialize changelog configuration (coming soon)')
    .action(() => {
      console.log('⚠️  Configuration feature coming soon!');
      console.log('For now, the tool works out of the box with sensible defaults.');
    });

  // Default command
  if (process.argv.length === 2) {
    // No arguments provided, generate changelog since last tag
    try {
      const generator = new ChangelogGenerator();
      console.log('🚀 Generating changelog since last tag...\n');
      const changelog = await generator.generateSinceLastTag();
      console.log(changelog);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  } else {
    await program.parseAsync(process.argv);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
