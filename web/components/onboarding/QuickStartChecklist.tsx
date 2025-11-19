'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface QuickStartChecklistProps {
  userId?: string;
  onItemComplete?: (itemId: string) => void;
}

export default function QuickStartChecklist({
  userId,
  onItemComplete,
}: QuickStartChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'connect_repo',
      title: 'Connect GitHub Repository',
      description: 'Link your first repository to get started',
      completed: false,
    },
    {
      id: 'generate_changelog',
      title: 'Generate First Changelog',
      description: 'Create your first automated changelog',
      completed: false,
    },
    {
      id: 'try_ai',
      title: 'Try AI Rewrite Feature',
      description: 'See how AI transforms your commit messages',
      completed: false,
    },
    {
      id: 'export',
      title: 'Export Changelog',
      description: 'Download as Markdown, JSON, or PDF',
      completed: false,
    },
    {
      id: 'github_action',
      title: 'Install GitHub Action (Optional)',
      description: 'Automate changelog generation on releases',
      completed: false,
    },
  ]);

  useEffect(() => {
    // Load checklist state from localStorage
    if (typeof window !== 'undefined' && userId) {
      const saved = localStorage.getItem(`checklist-${userId}`);
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading checklist:', e);
        }
      }
    }
  }, [userId]);

  const handleToggle = (itemId: string) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );

      // Save to localStorage
      if (typeof window !== 'undefined' && userId) {
        localStorage.setItem(`checklist-${userId}`, JSON.stringify(newItems));
      }

      // Call callback
      const item = newItems.find((i) => i.id === itemId);
      if (item?.completed) {
        onItemComplete?.(itemId);
      }

      return newItems;
    });
  };

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;

  // Hide if all completed
  if (completedCount === totalCount) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {completedCount}/{totalCount}
            </span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Quick Start Guide</h3>
            <p className="text-sm text-gray-600">
              {completedCount === 0
                ? 'Get started with ChangelogAI'
                : `${completedCount} of ${totalCount} completed`}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 group cursor-pointer"
                onClick={() => handleToggle(item.id)}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    item.completed
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium ${
                      item.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-900 group-hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={`text-sm ${
                      item.completed ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {completedCount > 0 && completedCount < totalCount && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                🎉 Great progress! Keep going to unlock the full power of ChangelogAI.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
