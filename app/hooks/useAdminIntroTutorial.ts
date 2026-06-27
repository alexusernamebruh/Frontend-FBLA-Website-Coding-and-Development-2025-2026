'use client';

import { useCallback, useMemo } from 'react';

import { useTutorial } from './useTutorial';

export type AdminSection =
  | 'Analytics'
  | 'All Items'
  | 'Pending Reports'
  | 'Approved Reports'
  | 'Declined Reports'
  | 'Pending Claims'
  | 'Approved Claims'
  | 'All Locations'
  | 'Add Location';

export function useAdminIntroTutorial(params: {
  currentPage: AdminSection | string;
}) {
  const { currentPage } = params;

  const steps = useMemo(() => {
    const commonSideNav = {
      // More stable than generic class selector: SideNav wrapper is the only
      // indigo panel on the desktop layout.
      element: "div[class*='bg-indigo-500'][class*='w-fit'][class*='h-full']",
      intro:
        'Use the sidebar to navigate between Analytics, Items, Reports, Claims, and Locations management.',
      position: 'right' as const,
    };

    switch (currentPage) {
      case 'Analytics':
        return [
          commonSideNav,
          {
            // Analytics header block (has an explicit, stable layout in the Admin page).
            element:
              'div.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6 p.text-2xl.font-bold.text-black',
            intro:
              'Welcome to the Analytics Dashboard. This is your central hub for monitoring all Lost & Found activity.',
            position: 'bottom' as const,
          },
          {
            element: '#admin-analytics-top-keywords',
            intro:
              'These stat cards give you a quick overview: total items, return rate, pending reports, open claims, and more.',
            position: 'top' as const,
          },
          {
            element: '#admin-analytics-charts',
            intro:
              'Visual charts help you understand item claims, location distribution, and submission trends at a glance.',
            position: 'top' as const,
          },
          {
            element: '#admin-analytics-locations',
            intro:
              'The Items by Location section shows which areas have the most lost-and-found activity.',
            position: 'top' as const,
          },
          {
            element: '#admin-analytics-top-keywords',
            intro:
              'Common item types are derived from descriptions, helping you spot patterns.',
            position: 'top' as const,
          },
          {
            element: '#admin-analytics-submission-trend',
            intro:
              'The submission trend chart shows how many reports have been filed over the last 30 days.',
            position: 'top' as const,
          },
        ];

      case 'All Items':
        return [
          commonSideNav,
          {
            element: '#admin-items-list-container',
            intro:
              'This is where all items live. Use filters and search to quickly find items that need review or action.',
            position: 'top' as const,
          },
          {
            element: '#admin-items-filters-row',
            intro:
              'Use these controls to filter by text, image, location, or date.',
            position: 'bottom' as const,
          },
          {
            element: '#admin-items-detail-container',
            intro:
              'Select an item to view its details. You can then edit or delete it from this panel.',
            position: 'top' as const,
          },
        ];

      case 'Pending Reports':
        return [
          commonSideNav,
          {
            element: '#admin-pending-reports-list',
            intro:
              'Pending Reports are submissions waiting for administrator review.',
            position: 'top' as const,
          },
          {
            element: '#admin-pending-report-detail',
            intro:
              'Select a pending report to review it here. Approve or reject decisions happen from this panel.',
            position: 'top' as const,
          },
          {
            element: '#admin-pending-report-detail',
            intro:
              'Tip: scan the description + location first, then approve (publish) or reject (decline) based on what matches.',
            position: 'bottom' as const,
          },
        ];

      case 'Approved Reports':
        return [
          commonSideNav,
          {
            element: '#admin-approved-reports-list',
            intro:
              'Approved Reports are submissions that are live in the system.',
            position: 'top' as const,
          },
          {
            element: '#admin-approved-report-detail',
            intro:
              'Select an approved report to review the submission details.',
            position: 'top' as const,
          },
          {
            element: '#admin-approved-report-detail',
            intro:
              'Use the details panel to verify location + description for consistency before acting on related items.',
            position: 'bottom' as const,
          },
        ];

      case 'Declined Reports':
        return [
          commonSideNav,
          {
            element: '#admin-declined-reports-list',
            intro:
              'Declined Reports are submissions that were rejected by an administrator.',
            position: 'top' as const,
          },
          {
            element: '#admin-declined-report-detail',
            intro: 'Review the declined submission details here.',
            position: 'top' as const,
          },
          {
            element: '#admin-declined-report-detail',
            intro:
              'If needed, use the information here as context for the next submission review cycle.',
            position: 'bottom' as const,
          },
        ];

      case 'Pending Claims':
        return [
          commonSideNav,
          {
            element: '#admin-pending-claims-list',
            intro:
              'Pending Claims are requests waiting for review (approval or deletion).',
            position: 'top' as const,
          },
          {
            element: '#admin-pending-claim-detail',
            intro:
              'Select a pending claim to see claim details and approve/delete it here.',
            position: 'top' as const,
          },
          {
            element: '#admin-pending-claim-detail',
            intro:
              'Tip: compare the claim comment with the item info before approving or deleting.',
            position: 'bottom' as const,
          },
        ];

      case 'Approved Claims':
        return [
          commonSideNav,
          {
            element: '#admin-approved-claims-list',
            intro:
              'Approved Claims are claim requests that have been resolved.',
            position: 'top' as const,
          },
          {
            element: '#admin-approved-claim-detail',
            intro: 'Review resolved claim details in this panel.',
            position: 'top' as const,
          },
          {
            element: '#admin-approved-claim-detail',
            intro:
              'Use the resolved details to confirm the outcome and keep a record of what was approved.',
            position: 'bottom' as const,
          },
        ];

      case 'All Locations':
        return [
          commonSideNav,
          {
            element: '#admin-locations-list',
            intro:
              'Locations help organize items. Manage location records and see how many items are associated with each.',
            position: 'top' as const,
          },
          {
            element: '#admin-locations-filter-button',
            intro:
              'Open the filter panel to search locations by name or teacher.',
            position: 'bottom' as const,
          },
          {
            element: '#admin-location-detail-container',
            intro:
              'Select a location to view its details (teacher and items count).',
            position: 'top' as const,
          },
        ];

      case 'Add Location':
        return [
          commonSideNav,
          {
            element: '#admin-add-location-form',
            intro:
              'Create a new location by entering a name and (optionally) a teacher/supervisor.',
            position: 'top' as const,
          },
          {
            element: '#admin-add-location-save',
            intro: 'Use the “Add Location” button to submit the new location.',
            position: 'bottom' as const,
          },
          {
            element: '#admin-add-location-save',
            intro:
              'After saving, the new location should appear in the Locations list so it can be selected on other pages.',
            position: 'top' as const,
          },
        ];

      default:
        return [commonSideNav];
    }
  }, [currentPage]);

  // useTutorial expects Intro.js step shapes; our `AdminSection` mapping already
  // matches the required fields (element/intro/position), so we can type it safely.
  const { startTutorial } = useTutorial(steps);

  return { startTutorial: useCallback(() => startTutorial(), [startTutorial]) };
}
