'use client';

import { useCallback } from 'react';

import { useTutorial } from './useTutorial';

/**
 * Admin tutorial steps.
 *
 * Required flow for the admin “All Items” page:
 * 1) Sidenav
 * 2) All Items list + filters
 * 3) Individual detailed item view (right panel)
 *
 * Note: Intro.js is hash-triggered on the destination page via useFragmentTutorial.
 * This hook only provides the `startTutorial()` implementation + step config.
 */
export function useAdminTutorial() {
  const steps = [
    {
      // Sidebar wrapper on the desktop admin layout.
      // Use the most specific selector available: the admin SideNav container.
      element:
        'div.hidden.lg\\:flex.bg-grid.text-black.h-full.w-full > div.bg-indigo-500.w-fit.h-full.min-h-screen',
      intro:
        'Sidenav: use this menu to switch between Analytics, Items, Reports, Claims, and Locations management.',
      position: 'right' as const,
    },
    {
      // Left column for the All Items view: filter/search button bar + the items list.
      element:
        'div.flex.w-full.h-full.p-10.gap-10 > div.w-[240px].shrink-0.space-y-4',
      intro:
        'All Items list: this panel shows the items you can manage. Use the filter/search icons at the top (text, image, location, date) to narrow results, then click an item to view details.',
      position: 'top' as const,
    },
    {
      // Right column for the details view of the selected item.
      element:
        'div.flex.w-full.h-full.p-10.gap-10 > div.w-full.h-full.bg-white.overflow-auto.rounded-lg.border.border-gray-300.shadow-md',
      intro:
        'Item detailed view: this is the selected item’s information only (description, status, location, and photos). Use Edit/Delete here to take action for that specific item.',
      position: 'top' as const,
    },
  ];

  const { startTutorial } = useTutorial(steps);
  return { startTutorial: useCallback(() => startTutorial(), [startTutorial]) };
}
