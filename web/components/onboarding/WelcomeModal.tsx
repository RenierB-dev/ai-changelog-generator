'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WelcomeModalProps {
  userName?: string;
  onClose?: () => void;
  onStartTour?: () => void;
}

export default function WelcomeModal({
  userName = 'Developer',
  onClose,
  onStartTour,
}: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('welcome-modal-seen');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('welcome-modal-seen', 'true');
    onClose?.();
  };

  const handleStartTour = () => {
    setIsOpen(false);
    localStorage.setItem('welcome-modal-seen', 'true');
    onStartTour?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ChangelogAI, {userName}! 🚀
          </h1>
          <p className="text-lg text-gray-600">
            Generate beautiful changelogs from your git commits in seconds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Fast Generation</h3>
            <p className="text-sm text-gray-600">
              Create changelogs in seconds, not hours
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold mb-1">AI Polish</h3>
            <p className="text-sm text-gray-600">
              Transform commits into clear release notes
            </p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-semibold mb-1">Auto-Generate</h3>
            <p className="text-sm text-gray-600">
              Set up GitHub Actions for automation
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3">Quick Start:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Connect your GitHub repository</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Select a version range or let us detect tags</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Generate and export your changelog</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Try AI polish to make it even better (Pro)</span>
            </li>
          </ol>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleStartTour}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Take the Tour
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Skip for Now
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          You can restart the tour anytime from Settings
        </p>
      </div>
    </div>
  );
}
