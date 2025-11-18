/**
 * Tests for Changelog formatting
 */

import { ChangelogFormatter } from '../src/formatter';
import { Changelog } from '../src/types';

describe('ChangelogFormatter', () => {
  const sampleChangelog: Changelog = {
    date: new Date('2024-01-01'),
    version: '1.0.0',
    summary: 'Initial release with core features',
    entries: [
      {
        type: '🚀 Features',
        description: 'Added user authentication',
        commits: [],
      },
      {
        type: '🐛 Bug Fixes',
        description: 'Fixed login redirect issue',
        commits: [],
      },
    ],
  };

  describe('toMarkdown', () => {
    it('should format changelog as markdown', () => {
      const markdown = ChangelogFormatter.toMarkdown(sampleChangelog);
      expect(markdown).toContain('# 1.0.0');
      expect(markdown).toContain('## 🚀 Features');
      expect(markdown).toContain('Added user authentication');
    });
  });

  describe('toJSON', () => {
    it('should format changelog as JSON', () => {
      const json = ChangelogFormatter.toJSON(sampleChangelog);
      const parsed = JSON.parse(json);
      expect(parsed.version).toBe('1.0.0');
      expect(parsed.entries).toHaveLength(2);
    });
  });

  describe('toHTML', () => {
    it('should format changelog as HTML', () => {
      const html = ChangelogFormatter.toHTML(sampleChangelog);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<h1>1.0.0');
      expect(html).toContain('<h2>🚀 Features</h2>');
    });
  });
});
