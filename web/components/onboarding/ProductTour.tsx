'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

interface ProductTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const tourSteps: Step[] = [
  {
    target: '[data-tour="connect-repo"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Connect Your GitHub Repository</h3>
        <p>Start by connecting a GitHub repository. We'll analyze your commit history to generate beautiful changelogs.</p>
      </div>
    ),
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="generate-changelog"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Generate Your First Changelog</h3>
        <p>Select a version range and click generate. Our smart categorization will organize your commits automatically.</p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="ai-polish"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Try AI Polish (Pro Feature)</h3>
        <p>
          Transform raw commits like "fix bug" into clear release notes like
          "Fixed authentication timeout issue". Upgrade to Pro to unlock this powerful feature!
        </p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="export"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Export Your Changelog</h3>
        <p>Download as Markdown, JSON, or PDF (Pro). Share with your team or publish to GitHub releases.</p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="github-action"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Automate with GitHub Actions</h3>
        <p>
          Set up our GitHub Action to auto-generate changelogs when you create releases.
          Save time and never forget to document your changes!
        </p>
      </div>
    ),
    placement: 'bottom',
  },
];

export default function ProductTour({ run = false, onComplete }: ProductTourProps) {
  const [runTour, setRunTour] = useState(run);

  useEffect(() => {
    setRunTour(run);
  }, [run]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      onComplete?.();

      // Store that user has completed tour
      if (typeof window !== 'undefined') {
        localStorage.setItem('product-tour-completed', 'true');
      }
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#0ea5e9',
          zIndex: 10000,
        },
        tooltip: {
          fontSize: 16,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: '#0ea5e9',
          fontSize: 14,
          padding: '8px 16px',
        },
        buttonBack: {
          color: '#666',
          fontSize: 14,
        },
        buttonSkip: {
          color: '#999',
          fontSize: 14,
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip tour',
      }}
    />
  );
}
