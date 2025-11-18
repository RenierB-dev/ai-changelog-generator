import { Commit, CategorizedCommit, ChangelogCategory } from './types';

/**
 * Rule-based categorization - works WITHOUT any API key
 * This is the default categorization method
 */
export class RuleBasedCategorizer {
  private static readonly CATEGORY_RULES: Record<ChangelogCategory, RegExp[]> = {
    'Features': [
      /^feat(\(.*?\))?:/i,
      /^feature(\(.*?\))?:/i,
      /\badd(ed|ing)?\s+(new\s+)?feature/i,
      /\bimplement(ed|ing|ation)?\b/i,
      /\bnew\s+\w+/i,
    ],
    'Bug Fixes': [
      /^fix(\(.*?\))?:/i,
      /^bugfix(\(.*?\))?:/i,
      /\bfix(ed|es|ing)?\s+(bug|issue|error)/i,
      /\bresolve(d|s)?\s+(bug|issue)/i,
      /\bpatch(ed)?\b/i,
    ],
    'Performance': [
      /^perf(\(.*?\))?:/i,
      /\bperformance\b/i,
      /\boptimiz(e|ed|ation)/i,
      /\bspeed\s+up/i,
      /\bfaster\b/i,
    ],
    'Documentation': [
      /^docs?(\(.*?\))?:/i,
      /^documentation(\(.*?\))?:/i,
      /\bupdate(d)?\s+(readme|docs?|documentation)/i,
      /\badd(ed)?\s+(readme|docs?|documentation)/i,
      /\bdocument(ed|ation)?\b/i,
    ],
    'Refactoring': [
      /^refactor(\(.*?\))?:/i,
      /\brefactor(ed|ing)?\b/i,
      /\bclean\s*up\b/i,
      /\brestructur(e|ed|ing)/i,
      /\breorganiz(e|ed|ing)/i,
    ],
    'Testing': [
      /^test(\(.*?\))?:/i,
      /\btest(s|ed|ing)?\b/i,
      /\bspec(s)?\b/i,
      /\bcoverage\b/i,
      /\bunit\s+test/i,
    ],
    'Build': [
      /^build(\(.*?\))?:/i,
      /\bbuild\b/i,
      /\bcompil(e|ed|ation)/i,
      /\bwebpack\b/i,
      /\bbundl(e|ed|ing)/i,
    ],
    'CI/CD': [
      /^ci(\(.*?\))?:/i,
      /\bci\/cd\b/i,
      /\bcontinuous\s+integration/i,
      /\bpipeline/i,
      /\bgithub\s+actions/i,
      /\bjenkins\b/i,
    ],
    'Dependencies': [
      /^deps?(\(.*?\))?:/i,
      /^chore\(deps\):/i,
      /\bdependen(cy|cies)\b/i,
      /\bupgrade\s+\w+/i,
      /\bbump\s+\w+/i,
      /\bpackage\b/i,
    ],
    'Other': [],
  };

  /**
   * Categorize a commit using pattern matching rules
   */
  categorize(commit: Commit): CategorizedCommit {
    const fullMessage = `${commit.message}\n${commit.body || ''}`;

    // Try to match against each category's patterns
    for (const [category, patterns] of Object.entries(RuleBasedCategorizer.CATEGORY_RULES)) {
      if (category === 'Other') continue; // Skip 'Other' for now

      for (const pattern of patterns) {
        if (pattern.test(fullMessage)) {
          return {
            ...commit,
            category: category as ChangelogCategory,
          };
        }
      }
    }

    // Default to 'Other' if no match found
    return {
      ...commit,
      category: 'Other',
    };
  }

  /**
   * Categorize multiple commits
   */
  categorizeCommits(commits: Commit[]): CategorizedCommit[] {
    return commits.map(commit => this.categorize(commit));
  }
}
