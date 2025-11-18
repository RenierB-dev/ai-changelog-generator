/**
 * Changelog formatting utilities
 */

import { Changelog, ChangelogEntry, ChangelogOptions } from './types';

export class ChangelogFormatter {
  /**
   * Format changelog as Markdown
   */
  static toMarkdown(changelog: Changelog, options: ChangelogOptions = {}): string {
    let output = '';

    // Header
    const date = changelog.date.toISOString().split('T')[0];
    if (changelog.version) {
      output += `# ${changelog.version} (${date})\n\n`;
    } else {
      output += `# Changelog (${date})\n\n`;
    }

    // Summary
    if (changelog.summary) {
      output += `${changelog.summary}\n\n`;
    }

    // Group entries by type if needed
    const groupedEntries = this.groupEntries(changelog.entries, options.groupBy);

    // Format entries
    for (const [type, entries] of Object.entries(groupedEntries)) {
      if (entries.length === 0) continue;

      output += `## ${type}\n\n`;

      for (const entry of entries) {
        output += `- ${entry.description}\n`;

        // Add commit links if requested
        if (options.includeCommitLinks && options.repoUrl && entry.commits?.length > 0) {
          const commitLinks = entry.commits
            .map((c) => `[\`${c.hash.substring(0, 7)}\`](${options.repoUrl}/commit/${c.hash})`)
            .join(', ');
          output += `  - Commits: ${commitLinks}\n`;
        }

        // Add authors if requested
        if (options.includeAuthors && entry.commits?.length > 0) {
          const authors = [...new Set(entry.commits.map((c) => c.author))].join(', ');
          output += `  - By: ${authors}\n`;
        }
      }

      output += '\n';
    }

    return output.trim();
  }

  /**
   * Format changelog as JSON
   */
  static toJSON(changelog: Changelog, options: ChangelogOptions = {}): string {
    return JSON.stringify(changelog, null, 2);
  }

  /**
   * Format changelog as HTML
   */
  static toHTML(changelog: Changelog, options: ChangelogOptions = {}): string {
    const date = changelog.date.toISOString().split('T')[0];
    let html = '<!DOCTYPE html>\n<html>\n<head>\n';
    html += '<meta charset="UTF-8">\n';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += `<title>Changelog - ${changelog.version || date}</title>\n`;
    html += '<style>\n';
    html += `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        max-width: 900px;
        margin: 40px auto;
        padding: 0 20px;
        line-height: 1.6;
        color: #333;
      }
      h1 {
        border-bottom: 3px solid #0066cc;
        padding-bottom: 10px;
        color: #0066cc;
      }
      h2 {
        margin-top: 30px;
        color: #444;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
      }
      .summary {
        background: #f5f5f5;
        padding: 15px;
        border-left: 4px solid #0066cc;
        margin: 20px 0;
      }
      ul {
        list-style-type: none;
        padding-left: 0;
      }
      li {
        margin: 10px 0;
        padding-left: 25px;
        position: relative;
      }
      li:before {
        content: '•';
        position: absolute;
        left: 10px;
        color: #0066cc;
        font-weight: bold;
      }
      .breaking {
        color: #cc0000;
        font-weight: bold;
      }
      .meta {
        font-size: 0.9em;
        color: #666;
        margin-left: 25px;
      }
      code {
        background: #f4f4f4;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: monospace;
      }
      a {
        color: #0066cc;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `;
    html += '</style>\n</head>\n<body>\n';

    // Header
    if (changelog.version) {
      html += `<h1>${changelog.version} <small>(${date})</small></h1>\n`;
    } else {
      html += `<h1>Changelog <small>(${date})</small></h1>\n`;
    }

    // Summary
    if (changelog.summary) {
      html += `<div class="summary">${this.escapeHtml(changelog.summary)}</div>\n`;
    }

    // Group entries
    const groupedEntries = this.groupEntries(changelog.entries, options.groupBy);

    // Format entries
    for (const [type, entries] of Object.entries(groupedEntries)) {
      if (entries.length === 0) continue;

      html += `<h2>${this.escapeHtml(type)}</h2>\n<ul>\n`;

      for (const entry of entries) {
        const descClass = entry.breaking ? 'breaking' : '';
        html += `<li class="${descClass}">${this.escapeHtml(entry.description)}`;

        // Add commit links
        if (options.includeCommitLinks && options.repoUrl && entry.commits?.length > 0) {
          const commitLinks = entry.commits
            .map(
              (c) =>
                `<a href="${options.repoUrl}/commit/${c.hash}"><code>${c.hash.substring(0, 7)}</code></a>`
            )
            .join(', ');
          html += `<div class="meta">Commits: ${commitLinks}</div>`;
        }

        // Add authors
        if (options.includeAuthors && entry.commits?.length > 0) {
          const authors = [...new Set(entry.commits.map((c) => c.author))].join(', ');
          html += `<div class="meta">By: ${this.escapeHtml(authors)}</div>`;
        }

        html += '</li>\n';
      }

      html += '</ul>\n';
    }

    html += '</body>\n</html>';
    return html;
  }

  /**
   * Group entries by specified criteria
   */
  private static groupEntries(
    entries: ChangelogEntry[],
    groupBy: string = 'type'
  ): Record<string, ChangelogEntry[]> {
    const grouped: Record<string, ChangelogEntry[]> = {};

    for (const entry of entries) {
      let key: string;

      switch (groupBy) {
        case 'type':
          key = entry.type;
          break;
        case 'author':
          key = entry.commits?.[0]?.author || 'Unknown';
          break;
        case 'date':
          key = entry.commits?.[0]?.date.toISOString().split('T')[0] || 'Unknown';
          break;
        default:
          key = entry.type;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(entry);
    }

    return grouped;
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
