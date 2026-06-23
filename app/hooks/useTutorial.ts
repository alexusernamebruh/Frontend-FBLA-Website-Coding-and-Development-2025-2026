'use client';

import { useCallback } from 'react';

export interface TutorialStep {
  element: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function useTutorial(steps: TutorialStep[]) {
  const startTutorial = useCallback(() => {
    // Dynamically import intro.js to avoid SSR issues
    import('intro.js').then((introJs) => {
      const intro = introJs.default();
      intro.setOptions({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        steps: steps as any,
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: false,
        disableInteraction: true,
        nextLabel: 'Next \u2192',
        prevLabel: '\u2190 Back',
        doneLabel: 'Done',
      });
      intro.start();
    });
  }, [steps]);

  return { startTutorial };
}
