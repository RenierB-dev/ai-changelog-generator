import Anthropic from '@anthropic-ai/sdk';
import type { Commit } from './types.js';

export class AIService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateChangelog(
    commits: Commit[],
    fromVersion: string,
    toVersion: string
  ): Promise<string> {
    const commitsText = commits
      .map((commit) => {
        const lines = [
          `Commit: ${commit.hash.substring(0, 8)}`,
          `Author: ${commit.author}`,
          `Date: ${commit.date}`,
          `Message: ${commit.message}`,
        ];
        if (commit.body) {
          lines.push(`Body: ${commit.body}`);
        }
        return lines.join('\n');
      })
      .join('\n\n---\n\n');

    const prompt = `You are a changelog generator. I will provide you with git commit history between two versions, and you should generate a well-formatted, professional changelog in markdown format.

Version range: ${fromVersion} → ${toVersion}
Number of commits: ${commits.length}

Commit history:
${commitsText}

Please generate a changelog that:
1. Groups changes into logical categories (Features, Bug Fixes, Performance, Documentation, etc.)
2. Uses clear, user-friendly language (not just commit messages)
3. Highlights breaking changes if any
4. Follows the Keep a Changelog format
5. Is formatted in clean markdown

Generate the changelog now:`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = message.content[0];
      if (content?.type === 'text') {
        return content.text;
      }

      throw new Error('Unexpected response format from Claude API');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate changelog: ${error.message}`);
      }
      throw error;
    }
  }
}
