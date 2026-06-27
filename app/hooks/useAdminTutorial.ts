'use client';

import { useCallback } from 'react';

import { useTutorial } from './useTutorial';

/**
 * Admin tutorial steps.
 *
 * Note: Intro.js is hash-triggered on the destination page via useFragmentTutorial.
 * This hook only provides the `startTutorial()` implementation + step config.
 */
export function useAdminTutorial() {
  const steps = [
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6 > p:first-child',
      intro:
        'Welcome to the Analytics Dashboard. This is your central hub for monitoring all Lost & Found activity.',
      position: 'bottom' as const,
    },
    {
      element: '.grid.grid-cols-4.gap-5',
      intro:
        'These stat cards give you a quick overview: total items, return rate, pending reports, open claims, and more.',
      position: 'top' as const,
    },
    {
      element: '#analytics-charts',
      intro:
        'Visual charts help you understand item claims, location distribution, and submission trends at a glance.',
      position: 'top' as const,
    },
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6:nth-of-type(3) .grid',
      intro:
        'The Items by Location section shows which areas have the most lost-and-found activity.',
      position: 'top' as const,
    },
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6:nth-of-type(4)',
      intro:
        'Common item types are derived from descriptions, helping you spot patterns.',
      position: 'top' as const,
    },
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6:nth-of-type(5)',
      intro:
        'The submission trend chart shows how many reports have been filed over the last 30 days.',
      position: 'top' as const,
    },
    {
      element: '.bg-indigo-500.w-fit.h-full',
      intro:
        'Use the sidebar to navigate between Analytics, Items, Reports, Claims, and Locations management.',
      position: 'right' as const,
    },
  ];

  const { startTutorial } = useTutorial(steps);
  return { startTutorial: useCallback(() => startTutorial(), [startTutorial]) };
}
