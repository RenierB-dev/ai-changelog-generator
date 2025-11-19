'use client';

import { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, TrendingUp, Zap, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    proSubscribers: 156,
    teamSubscribers: 23,
    mrr: 2043,
    changelogsGenerated: 8934,
    aiFeatureUsage: 67,
    githubActionsInstalled: 89,
  });

  // Mock data for charts
  const changelogData = [
    { date: 'Mon', count: 145 },
    { date: 'Tue', count: 189 },
    { date: 'Wed', count: 234 },
    { date: 'Thu', count: 198 },
    { date: 'Fri', count: 267 },
    { date: 'Sat', count: 123 },
    { date: 'Sun', count: 98 },
  ];

  const revenueData = [
    { month: 'Jan', mrr: 1200 },
    { month: 'Feb', mrr: 1450 },
    { month: 'Mar', mrr: 1680 },
    { month: 'Apr', mrr: 1890 },
    { month: 'May', mrr: 2043 },
  ];

  const featureUsage = [
    { feature: 'Markdown Export', usage: 3421 },
    { feature: 'AI Polish', usage: 2134 },
    { feature: 'PDF Export', usage: 1567 },
    { feature: 'JSON Export', usage: 892 },
    { feature: 'GitHub Action', usage: 456 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">ChangelogAI Platform Analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Total Users</p>
            <div className="mt-2 text-xs text-gray-500">
              Pro: {stats.proSubscribers} | Team: {stats.teamSubscribers}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">${stats.mrr.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Monthly Recurring Revenue</p>
            <div className="mt-2 text-xs text-gray-500">
              ${(stats.mrr * 12).toLocaleString()} ARR
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-semibold">+23%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.changelogsGenerated.toLocaleString()}</h3>
            <p className="text-sm text-gray-600">Changelogs Generated</p>
            <div className="mt-2 text-xs text-gray-500">
              {Math.round(stats.changelogsGenerated / stats.totalUsers)} per user avg
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">{stats.aiFeatureUsage}%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.aiFeatureUsage}%</h3>
            <p className="text-sm text-gray-600">AI Feature Usage Rate</p>
            <div className="mt-2 text-xs text-gray-500">
              {stats.githubActionsInstalled} GitHub Actions
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Changelogs Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Changelogs Generated (7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={changelogData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Growth */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">MRR Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mrr" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Usage Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Feature Usage</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {featureUsage.map((item, index) => {
                  const total = featureUsage.reduce((sum, f) => sum + f.usage, 0);
                  const percentage = ((item.usage / total) * 100).toFixed(1);

                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.feature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.usage.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          +{Math.floor(Math.random() * 20) + 5}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Popular Templates</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Default</span>
                <span className="text-sm font-semibold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Minimal</span>
                <span className="text-sm font-semibold">28%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Detailed</span>
                <span className="text-sm font-semibold">18%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Custom</span>
                <span className="text-sm font-semibold">9%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Export Formats</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Markdown</span>
                <span className="text-sm font-semibold">52%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PDF</span>
                <span className="text-sm font-semibold">31%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">JSON</span>
                <span className="text-sm font-semibold">17%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Top Repositories</h3>
            <div className="space-y-2 text-sm">
              <div className="text-gray-600">1. facebook/react</div>
              <div className="text-gray-600">2. vercel/next.js</div>
              <div className="text-gray-600">3. tailwindlabs/tailwindcss</div>
              <div className="text-gray-600">4. microsoft/vscode</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
