/**
 * Changelog Premium - Embeddable Widget
 *
 * Usage:
 * <div id="changelog-widget" data-repo="username/repo" data-version="v1.0.0"></div>
 * <script src="https://your-domain.com/widget.js"></script>
 */

(function() {
  'use strict';

  const WIDGET_API_URL = 'https://your-domain.com/api/widget/changelog';

  class ChangelogWidget {
    constructor(element) {
      this.element = element;
      this.repo = element.getAttribute('data-repo');
      this.version = element.getAttribute('data-version') || 'latest';
      this.theme = element.getAttribute('data-theme') || 'light';

      this.init();
    }

    async init() {
      try {
        this.showLoading();
        const changelog = await this.fetchChangelog();
        this.render(changelog);
      } catch (error) {
        this.showError(error.message);
      }
    }

    showLoading() {
      this.element.innerHTML = `
        <div class="changelog-widget changelog-loading">
          <div class="spinner"></div>
          <p>Loading changelog...</p>
        </div>
      `;
      this.injectStyles();
    }

    showError(message) {
      this.element.innerHTML = `
        <div class="changelog-widget changelog-error">
          <p>Failed to load changelog: ${message}</p>
        </div>
      `;
    }

    async fetchChangelog() {
      const response = await fetch(
        `${WIDGET_API_URL}?repo=${this.repo}&version=${this.version}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch changelog');
      }

      return response.json();
    }

    render(changelog) {
      const html = `
        <div class="changelog-widget ${this.theme}">
          <div class="changelog-header">
            <h3>📝 Changelog ${changelog.version}</h3>
            <span class="changelog-date">${new Date(changelog.date).toLocaleDateString()}</span>
          </div>
          <div class="changelog-content">
            ${this.renderCommits(changelog.commits)}
          </div>
          <div class="changelog-footer">
            <a href="https://your-domain.com" target="_blank">Powered by Changelog Premium</a>
          </div>
        </div>
      `;

      this.element.innerHTML = html;
    }

    renderCommits(commits) {
      if (!commits || commits.length === 0) {
        return '<p class="no-commits">No changes to display</p>';
      }

      const grouped = commits.reduce((acc, commit) => {
        if (!acc[commit.type]) {
          acc[commit.type] = [];
        }
        acc[commit.type].push(commit);
        return acc;
      }, {});

      return Object.entries(grouped)
        .map(([type, commits]) => `
          <div class="changelog-section">
            <h4>${type}</h4>
            <ul>
              ${commits.map(commit => `
                <li>${commit.message}</li>
              `).join('')}
            </ul>
          </div>
        `).join('');
    }

    injectStyles() {
      if (document.getElementById('changelog-widget-styles')) return;

      const styles = `
        <style id="changelog-widget-styles">
          .changelog-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            max-width: 600px;
            background: white;
          }

          .changelog-widget.dark {
            background: #1f2937;
            border-color: #374151;
            color: #f9fafb;
          }

          .changelog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #667eea;
          }

          .changelog-header h3 {
            margin: 0;
            font-size: 20px;
          }

          .changelog-date {
            color: #6b7280;
            font-size: 14px;
          }

          .changelog-section {
            margin-bottom: 16px;
          }

          .changelog-section h4 {
            color: #667eea;
            margin: 0 0 8px 0;
            font-size: 16px;
          }

          .changelog-section ul {
            margin: 0;
            padding-left: 20px;
          }

          .changelog-section li {
            margin-bottom: 6px;
            line-height: 1.5;
          }

          .changelog-footer {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
          }

          .changelog-footer a {
            color: #667eea;
            text-decoration: none;
          }

          .changelog-loading,
          .changelog-error {
            text-align: center;
            padding: 40px 20px;
          }

          .spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto 16px;
            border: 4px solid #f3f4f6;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      `;

      document.head.insertAdjacentHTML('beforeend', styles);
    }
  }

  // Auto-initialize all widgets on page load
  function initWidgets() {
    const widgets = document.querySelectorAll('[id^="changelog-widget"]');
    widgets.forEach(element => {
      new ChangelogWidget(element);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }

  // Expose for manual initialization
  window.ChangelogWidget = ChangelogWidget;
})();
