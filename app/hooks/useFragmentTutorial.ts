'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Starts an Intro.js tutorial when the current URL hash matches `#tutorial`.
 * After completion, it removes the hash by navigating to the same path without it.
 */
export function useFragmentTutorial(params: {
  hash?: string; // default '#tutorial'
  startTutorial: () => void;
}) {
  const { hash = '#tutorial', startTutorial } = params;
  const router = useRouter();
  const startedRef = useRef(false);

  const run = useCallback(() => {
    const currentHash = window.location.hash;
    if (currentHash !== hash) return;
    if (startedRef.current) return;
    startedRef.current = true;

    // Start tutorial and ensure we clean up the hash when it finishes.
    import('intro.js').then((introJs) => {
      // We assume `startTutorial` already started Intro.js.
      // Still, attach a completion handler so we can clear the hash.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const intro = (window as any).__introjsInstance as any;

      if (intro && typeof intro.oncomplete === 'function') {
        intro.oncomplete(() => {
          const path = window.location.pathname;
          // Replace rather than push; avoids adding to history stack.
          router.replace(path);
        });
        return;
      }

      // Fallback: just clear after a small delay (Intro.js length varies).
      setTimeout(() => {
        const path = window.location.pathname;
        router.replace(path);
      }, 500);
    });
  }, [hash, router, startTutorial]);

  useEffect(() => {
    // Only run on client.
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { run };
}
