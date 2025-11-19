'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Twitter, Linkedin, Mail } from 'lucide-react';

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    total_referrals: 0,
    completed_referrals: 0,
    pending_referrals: 0,
    rewards_earned: 0,
  });

  useEffect(() => {
    // In a real app, fetch this from the API
    // For now, using placeholder data
    setReferralCode('ABC12345');
  }, []);

  const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${referralCode}`;

  const shareMessage = `I use ChangelogAI to auto-generate beautiful changelogs with AI. Try it: ${referralUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = 'Check out ChangelogAI';
    const body = shareMessage;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Share ChangelogAI, Get Rewarded! 🎁
          </h1>
          <p className="text-xl text-gray-600">
            Refer developers and get 1 month free for each successful referral
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.total_referrals}
            </div>
            <div className="text-sm text-gray-600">Total Referrals</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.completed_referrals}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {stats.pending_referrals}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.rewards_earned}
            </div>
            <div className="text-sm text-gray-600">Months Earned</div>
          </div>
        </div>

        {/* Referral Link Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Referral Link</h2>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            />
            <button
              onClick={handleCopy}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Social Sharing */}
          <h3 className="font-semibold mb-3">Share on Social Media</h3>
          <div className="flex gap-3">
            <button
              onClick={shareOnTwitter}
              className="flex-1 px-4 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </button>
            <button
              onClick={shareOnLinkedIn}
              className="flex-1 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </button>
            <button
              onClick={shareViaEmail}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Share Your Link</h3>
                <p className="text-gray-600">
                  Share your unique referral link with developer friends and colleagues
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">They Sign Up</h3>
                <p className="text-gray-600">
                  When they sign up using your link, they get started with ChangelogAI
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">You Get Rewarded</h3>
                <p className="text-gray-600">
                  Earn 1 month free for each successful referral. No limits!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Why Share ChangelogAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✨</div>
              <div>
                <h3 className="font-semibold mb-1">Help Your Team</h3>
                <p className="text-blue-100">
                  Share a tool that saves developers hours on release notes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎁</div>
              <div>
                <h3 className="font-semibold mb-1">Earn Free Months</h3>
                <p className="text-blue-100">
                  Get 1 month free per referral - unlimited potential
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🚀</div>
              <div>
                <h3 className="font-semibold mb-1">Support Innovation</h3>
                <p className="text-blue-100">
                  Help us build better tools for the developer community
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💬</div>
              <div>
                <h3 className="font-semibold mb-1">Easy to Share</h3>
                <p className="text-blue-100">
                  Simple one-click sharing on all major platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
