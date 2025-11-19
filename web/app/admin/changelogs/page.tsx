'use client';

import { useState } from 'react';
import { Search, Filter, Download, ExternalLink } from 'lucide-react';

interface Changelog {
  id: string;
  repository: string;
  version: string;
  user: string;
  changes: number;
  aiEnhanced: boolean;
  format: 'markdown' | 'json' | 'pdf';
  createdAt: string;
}

export default function ChangelogsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock changelog data
  const changelogs: Changelog[] = [
    {
      id: '1',
      repository: 'facebook/react',
      version: 'v18.2.0',
      user: 'sarah@techcorp.com',
      changes: 47,
      aiEnhanced: true,
      format: 'markdown',
      createdAt: '2024-05-15T10:30:00Z',
    },
    {
      id: '2',
      repository: 'vercel/next.js',
      version: 'v14.0.0',
      user: 'mike@startup.io',
      changes: 132,
      aiEnhanced: true,
      format: 'pdf',
      createdAt: '2024-05-14T15:20:00Z',
    },
    {
      id: '3',
      repository: 'tailwindlabs/tailwindcss',
      version: 'v3.4.0',
      user: 'emily@devshop.com',
      changes: 23,
      aiEnhanced: false,
      format: 'markdown',
      createdAt: '2024-05-14T09:15:00Z',
    },
    {
      id: '4',
      repository: 'microsoft/vscode',
      version: 'v1.89.0',
      user: 'john@example.com',
      changes: 89,
      aiEnhanced: true,
      format: 'json',
      createdAt: '2024-05-13T14:45:00Z',
    },
  ];

  const filteredChangelogs = changelogs.filter(
    (changelog) =>
      changelog.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
      changelog.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      changelog.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'json':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Changelogs</h1>
          <p className="text-gray-600">View and manage generated changelogs</p>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search changelogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Total Changelogs</div>
            <div className="text-2xl font-bold">8,934</div>
            <div className="text-xs text-green-600 mt-1">+234 this week</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">AI Enhanced</div>
            <div className="text-2xl font-bold text-purple-600">67%</div>
            <div className="text-xs text-gray-500 mt-1">5,986 changelogs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Avg Changes/Changelog</div>
            <div className="text-2xl font-bold">42</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 mb-1">Most Popular Format</div>
            <div className="text-lg font-bold">Markdown</div>
            <div className="text-xs text-gray-500 mt-1">52% of exports</div>
          </div>
        </div>

        {/* Changelogs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repository
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Changes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChangelogs.map((changelog) => (
                <tr key={changelog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{changelog.repository}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{changelog.version}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{changelog.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{changelog.changes}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getFormatBadgeColor(
                        changelog.format
                      )}`}
                    >
                      {changelog.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {changelog.aiEnhanced ? (
                      <span className="text-purple-600 text-sm">✨ Yes</span>
                    ) : (
                      <span className="text-gray-400 text-sm">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(changelog.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredChangelogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow mt-6">
            <p className="text-gray-500">No changelogs found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
