'use client';

import { useCallback } from 'react';

export interface TutorialStep {
  element: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function useTutorial(defaultSteps: TutorialStep[] = []) {
  const startTutorial = useCallback(
    async (overrideSteps?: TutorialStep[]) => {
      const steps = overrideSteps ?? defaultSteps;

      if (steps.length === 0) return;

      const { default: introJs } = await import('intro.js');

      // Load Intro.js styles and Modern theme
      await import('intro.js/introjs.css');
      await import('intro.js/themes/introjs-modern.css');

      const intro = introJs();

      intro.setOptions({
        steps,
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: false,
        disableInteraction: true,

        nextLabel: 'Next →',
        prevLabel: '← Back',
        doneLabel: 'Done',

        scrollToElement: true,
        scrollTo: 'tooltip',

        // Modern theme options
        tooltipClass: 'introjs-modern',
      });

      // Wait for React/layout to finish
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          intro.refresh();
          intro.start();
        });
      });
    },
    [defaultSteps],
  );

  return { startTutorial };
}
