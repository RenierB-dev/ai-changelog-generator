import simpleGit, { SimpleGit, DefaultLogFields } from 'simple-git';
import { Commit, CategorizedCommit, ChangelogOptions } from './types';
import { RuleBasedCategorizer } from './categorizer';
import { AICategorizer } from './ai';

export class ChangelogGenerator {
  private git: SimpleGit;
  private ruleBasedCategorizer: RuleBasedCategorizer;
  private aiCategorizer: AICategorizer | null = null;

  constructor() {
    this.git = simpleGit();
    this.ruleBasedCategorizer = new RuleBasedCategorizer();
  }

  /**
   * Fetch commits from git history
   */
  async getCommits(fromTag?: string, toTag?: string): Promise<Commit[]> {
    let range = '';

    if (fromTag && toTag) {
      range = `${fromTag}..${toTag}`;
    } else if (fromTag) {
      range = `${fromTag}..HEAD`;
    } else if (toTag) {
      range = toTag;
    }

    const log = await this.git.log(range ? [range] : undefined);

    return log.all.map((commit: DefaultLogFields) => ({
      hash: commit.hash,
      message: commit.message,
      author: commit.author_name,
      date: commit.date,
      body: commit.body,
    }));
  }

  /**
   * Categorize commits using either rule-based or AI method
   */
  async categorizeCommits(commits: Commit[], useAI: boolean): Promise<CategorizedCommit[]> {
    // If AI is NOT requested, use rule-based categorization (default)
    if (!useAI) {
      console.log('Using rule-based categorization (no API key required)');
      return this.ruleBasedCategorizer.categorizeCommits(commits);
    }

    // AI is requested - check if it's available
    if (!this.aiCategorizer) {
      this.aiCategorizer = new AICategorizer();
    }

    if (!this.aiCategorizer.isAIAvailable()) {
      console.warn('Warning: AI categorization requested but not available.');
      console.warn('Reason:', this.aiCategorizer.getAvailabilityMessage());
      console.log('Falling back to rule-based categorization...\n');
      return this.ruleBasedCategorizer.categorizeCommits(commits);
    }

    // Use AI categorization
    console.log('Using AI-powered categorization');
    try {
      return await this.aiCategorizer.categorizeCommits(commits);
    } catch (error) {
      console.error('AI categorization failed:', error);
      console.log('Falling back to rule-based categorization...\n');
      return this.ruleBasedCategorizer.categorizeCommits(commits);
    }
  }

  /**
   * Group categorized commits by category
   */
  private groupByCategory(commits: CategorizedCommit[]): Map<string, CategorizedCommit[]> {
    const grouped = new Map<string, CategorizedCommit[]>();

    for (const commit of commits) {
      const category = commit.category;
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(commit);
    }

    // Sort categories in a meaningful order
    const categoryOrder = [
      'Features',
      'Bug Fixes',
      'Performance',
      'Documentation',
      'Refactoring',
      'Testing',
      'Build',
      'CI/CD',
      'Dependencies',
      'Other',
    ];

    const sorted = new Map<string, CategorizedCommit[]>();
    for (const category of categoryOrder) {
      if (grouped.has(category)) {
        sorted.set(category, grouped.get(category)!);
      }
    }

    return sorted;
  }

  /**
   * Format changelog as markdown
   */
  private formatAsMarkdown(groupedCommits: Map<string, CategorizedCommit[]>): string {
    let markdown = '# Changelog\n\n';

    for (const [category, commits] of groupedCommits) {
      markdown += `## ${category}\n\n`;

      for (const commit of commits) {
        const shortHash = commit.hash.substring(0, 7);
        markdown += `- ${commit.message} (${shortHash})\n`;
      }

      markdown += '\n';
    }

    return markdown;
  }

  /**
   * Format changelog as JSON
   */
  private formatAsJSON(groupedCommits: Map<string, CategorizedCommit[]>): string {
    const changelog: Record<string, any[]> = {};

    for (const [category, commits] of groupedCommits) {
      changelog[category] = commits.map(commit => ({
        hash: commit.hash,
        message: commit.message,
        author: commit.author,
        date: commit.date,
      }));
    }

    return JSON.stringify(changelog, null, 2);
  }

  /**
   * Generate changelog
   */
  async generate(options: ChangelogOptions): Promise<string> {
    console.log('Fetching commits...');
    const commits = await this.getCommits(options.fromTag, options.toTag);

    if (commits.length === 0) {
      return 'No commits found.';
    }

    console.log(`Found ${commits.length} commits\n`);

    // Categorize commits - uses rule-based by default unless AI is explicitly requested
    const categorized = await this.categorizeCommits(commits, options.useAI);

    const grouped = this.groupByCategory(categorized);

    const format = options.format || 'markdown';

    if (format === 'json') {
      return this.formatAsJSON(grouped);
    } else {
      return this.formatAsMarkdown(grouped);
    }
  }
}
