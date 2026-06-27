'use client';

import { useCallback } from 'react';

import { useTutorial } from './useTutorial';

/**
 * User portal (Home) tutorial steps.
 */
// Legacy Intro.js tutorial hook.
// Replaced by the sequential in-app tutorial logic inside `app/home/page.tsx`.
// This is kept as a no-op to avoid breaking any imports.
export function useHomeTutorial() {
  return { startTutorial: () => {} };
}
