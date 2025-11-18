/**
 * AI integration using Anthropic's Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import { GitCommit, Changelog, AIAnalysisResult } from './types';

export class AIAnalyzer {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-3-5-sonnet-20241022') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  /**
   * Analyze commits and generate a changelog using Claude AI
   */
  async generateChangelog(commits: GitCommit[]): Promise<AIAnalysisResult> {
    if (commits.length === 0) {
      return {
        changelog: {
          date: new Date(),
          entries: [],
          summary: 'No commits found in the specified range.',
        },
        rawResponse: '',
      };
    }

    const prompt = this.buildPrompt(commits);

    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const rawResponse = this.extractTextContent(message.content);
      const changelog = this.parseChangelogResponse(rawResponse, commits);

      return {
        changelog,
        rawResponse,
      };
    } catch (error) {
      throw new Error(`Failed to generate changelog with AI: ${error}`);
    }
  }

  /**
   * Build the prompt for Claude AI
   */
  private buildPrompt(commits: GitCommit[]): string {
    const commitList = commits
      .map(
        (c, i) =>
          `${i + 1}. [${c.hash.substring(0, 7)}] ${c.message}${c.body ? '\n   ' + c.body.split('\n').join('\n   ') : ''}`
      )
      .join('\n');

    return `You are a technical writer tasked with creating a clear, well-organized changelog from git commits.

Analyze the following ${commits.length} commits and generate a professional changelog:

${commitList}

Please organize the changes into these categories:
- 🚀 Features: New features and enhancements
- 🐛 Bug Fixes: Bug fixes and corrections
- 📝 Documentation: Documentation updates
- 🔧 Refactoring: Code refactoring and improvements
- 🎨 Styling: UI/UX and styling changes
- ⚡ Performance: Performance improvements
- 🧪 Testing: Test additions and updates
- 🔨 Chores: Build process, dependencies, and other maintenance

For each change:
1. Write a clear, user-friendly description (not just the commit message)
2. Group related commits together
3. Highlight breaking changes with a ⚠️ WARNING marker
4. Focus on the impact to users, not implementation details

Format your response as a markdown changelog with the following structure:

## Summary
[Brief 2-3 sentence overview of the main changes]

## Changes

### 🚀 Features
- Description of feature (if relevant, mention the scope)

### 🐛 Bug Fixes
- Description of bug fix

[Continue with other categories as needed]

Only include categories that have changes. Be concise but informative.`;
  }

  /**
   * Extract text content from Claude's response
   */
  private extractTextContent(content: any[]): string {
    return content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
  }

  /**
   * Parse the AI response into a structured Changelog object
   */
  private parseChangelogResponse(response: string, commits: GitCommit[]): Changelog {
    const lines = response.split('\n');
    const entries: any[] = [];
    let summary = '';
    let currentType = '';
    let inSummary = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Extract summary
      if (trimmed === '## Summary') {
        inSummary = true;
        continue;
      }

      if (inSummary && trimmed.startsWith('##')) {
        inSummary = false;
      }

      if (inSummary && trimmed) {
        summary += trimmed + ' ';
        continue;
      }

      // Parse categories
      if (trimmed.startsWith('###')) {
        currentType = trimmed.replace(/^###\s*/, '').trim();
        continue;
      }

      // Parse entries
      if (trimmed.startsWith('-') && currentType) {
        const description = trimmed.replace(/^-\s*/, '').trim();
        const breaking = description.includes('⚠️') || description.toLowerCase().includes('breaking');

        entries.push({
          type: currentType,
          description,
          commits: [], // We could map commits here if needed
          breaking,
        });
      }
    }

    return {
      date: new Date(),
      entries,
      summary: summary.trim(),
    };
  }
}
