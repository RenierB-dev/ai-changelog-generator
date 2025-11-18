import Anthropic from '@anthropic-ai/sdk';
import { Commit, CategorizedCommit, ChangelogCategory } from './types';

/**
 * AI-powered categorization using Claude
 * This is OPTIONAL and only used when:
 * 1. The --ai flag is provided
 * 2. ANTHROPIC_API_KEY environment variable exists
 */
export class AICategorizer {
  private client: Anthropic | null = null;
  private isAvailable: boolean = false;

  constructor() {
    // Only initialize if API key exists
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (apiKey) {
      try {
        this.client = new Anthropic({ apiKey });
        this.isAvailable = true;
      } catch (error) {
        console.warn('Warning: Failed to initialize Anthropic client:', error);
        this.isAvailable = false;
      }
    }
  }

  /**
   * Check if AI categorization is available
   */
  isAIAvailable(): boolean {
    return this.isAvailable && this.client !== null;
  }

  /**
   * Get human-readable availability message
   */
  getAvailabilityMessage(): string {
    if (!process.env.ANTHROPIC_API_KEY) {
      return 'ANTHROPIC_API_KEY not found in environment variables';
    }
    if (!this.isAvailable) {
      return 'AI client failed to initialize';
    }
    return 'AI is available';
  }

  /**
   * Categorize a commit using Claude AI
   */
  async categorize(commit: Commit): Promise<CategorizedCommit> {
    if (!this.isAvailable || !this.client) {
      throw new Error('AI categorization is not available. ' + this.getAvailabilityMessage());
    }

    const fullMessage = `${commit.message}\n${commit.body || ''}`;

    const prompt = `You are a changelog categorization assistant. Categorize the following git commit into ONE of these categories:

Categories:
- Features: New features or capabilities
- Bug Fixes: Bug fixes or error corrections
- Performance: Performance improvements or optimizations
- Documentation: Documentation updates
- Refactoring: Code refactoring without changing functionality
- Testing: Test additions or modifications
- Build: Build system or compilation changes
- CI/CD: Continuous integration/deployment changes
- Dependencies: Dependency updates or changes
- Other: Anything that doesn't fit the above categories

Git Commit:
${fullMessage}

Respond with ONLY the category name, nothing else.`;

    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 50,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const category = response.content[0].type === 'text'
        ? response.content[0].text.trim()
        : 'Other';

      // Validate the category
      const validCategories: ChangelogCategory[] = [
        'Features', 'Bug Fixes', 'Performance', 'Documentation',
        'Refactoring', 'Testing', 'Build', 'CI/CD', 'Dependencies', 'Other'
      ];

      const matchedCategory = validCategories.find(
        c => c.toLowerCase() === category.toLowerCase()
      ) || 'Other';

      return {
        ...commit,
        category: matchedCategory,
      };
    } catch (error) {
      console.error('AI categorization failed for commit:', commit.hash, error);
      // Fallback to 'Other' on error
      return {
        ...commit,
        category: 'Other',
      };
    }
  }

  /**
   * Categorize multiple commits using AI
   */
  async categorizeCommits(commits: Commit[]): Promise<CategorizedCommit[]> {
    if (!this.isAvailable || !this.client) {
      throw new Error('AI categorization is not available. ' + this.getAvailabilityMessage());
    }

    console.log(`Categorizing ${commits.length} commits using AI...`);

    const categorized: CategorizedCommit[] = [];

    for (let i = 0; i < commits.length; i++) {
      const commit = commits[i];
      process.stdout.write(`\rProcessing commit ${i + 1}/${commits.length}...`);

      const categorizedCommit = await this.categorize(commit);
      categorized.push(categorizedCommit);

      // Small delay to avoid rate limiting
      if (i < commits.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    process.stdout.write('\n');
    return categorized;
  }
}
