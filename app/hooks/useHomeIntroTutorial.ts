'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import type { TutorialPosition } from './useSimpleTutorial';

type IntroStep = {
  key: string;
  title: string;
  elementId: string;
  intro: string;
  position?: TutorialPosition;
  /** Called right before the step starts (sets `current`/mobileTab, etc). */
  onBefore?: () => void | Promise<void>;
};

/**
 * intro.js has no TS typings for CSS imports or the instance shape.
 * We keep `AnyIntro` permissive and only rely on the methods we use.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIntro = any;

export function useHomeIntroTutorial(params: {
  getSetters: {
    setCurrent: (v: string) => void;
    setMobileTab: (v: string) => void;
  };
  getIsDesktop: () => boolean;
  getCurrentTab: () => string;
}) {
  const { setCurrent, setMobileTab } = params.getSetters;
  const isDesktop = params.getIsDesktop;
  const getCurrentTab = params.getCurrentTab;

  const [running, setRunning] = useState(false);
  const introRef = useRef<AnyIntro | null>(null);

  const allSteps: IntroStep[] = useMemo(
    () => [
      {
        key: 'nav_side',
        title: 'Navigation',
        elementId: 'home-nav',
        intro:
          'Start here: use the side navigation (left sidebar) to switch between the main sections of the portal. Each section has its own tools and actions.',
        position: 'right',
      },
      {
        key: 'tab_all',
        title: 'All Items',
        elementId: 'home-unclaimed-items',
        intro:
          "All Items is where you see items that haven't been claimed yet. This is the list area—use the filters/search to narrow results quickly (Text, Image, Location). When you find a match, select it to open the detailed view.",
        position: 'top',
        onBefore: () => {
          setCurrent('All Items');
        },
      },

      {
        key: 'tab_all_detail',
        title: 'Item Details',
        elementId: 'home-item-detail',
        intro:
          'This is the individual item detailed view. It shows the selected item’s description, location, dates, and photos. Use this panel to confirm whether the item is truly a match before you submit a claim.',
        position: 'top',
      },
      {
        key: 'tab_reports',
        title: 'Reports',
        elementId: 'home-report-section',
        intro:
          "Reports is where you submit a lost item report. You'll add the item name, a description, and (optionally) choose the best location. Submitting creates a record administrators can approve and match.",
        position: 'top',
        onBefore: () => {
          setCurrent('Submit Reports');
        },
      },
      {
        key: 'tab_your_reports',
        title: 'Your Reports',
        elementId: 'home-your-reports',
        intro:
          "Your Reports shows the status of reports you've submitted: Pending (waiting), Approved (now live), or Rejected (not used). Use this to quickly track what's changed and what you may need to resubmit.",
        position: 'top',
        onBefore: () => {
          setCurrent('Your Reports');
        },
      },
      {
        key: 'tab_claims',
        title: 'Claims',
        elementId: 'home-claim-section',
        intro:
          'Claims is where you submit a claim if you believe an item belongs to you. First, search/select the item, then write a short comment explaining why it matches. Your claim will be reviewed and may be approved or deleted.',
        position: 'top',
        onBefore: () => {
          setCurrent('Submit Claims');
        },
      },
      {
        key: 'tab_your_claims',
        title: 'Your Claims',
        elementId: 'home-your-claims',
        intro:
          'Your Claims shows your claim history. Claims can be Open (still under review) or Closed (resolved). This is the fastest way to see what happened to each claim you submitted.',
        position: 'top',
        onBefore: () => {
          setCurrent('Your Claims');
        },
      },
      {
        key: 'tab_lookouts',
        title: 'Item Lookouts',
        elementId: 'home-item-lookouts',
        intro:
          'Item Lookouts help you create a watchlist for potential matches. Instead of checking everything manually, you can track promising items and get notified when similar items appear.',
        position: 'top',
        onBefore: () => {
          setCurrent('Item Lookouts');
        },
      },
      {
        key: 'tab_chats',
        title: 'Chats',
        elementId: 'home-chats',
        intro:
          'Chats are where you communicate with other users about items. If someone needs clarification or additional details, chat is the place to coordinate safely and keep a record of the discussion.',
        position: 'right',
        onBefore: () => {
          setCurrent('Chats');
        },
      },
      {
        key: 'tab_alerts',
        title: 'Alerts',
        elementId: 'home-notifications',
        intro:
          'Alerts show the updates that matter: approvals/rejections on your submissions, new chat messages, and lookout matches. Mark items read to keep your inbox focused.',
        position: 'left',
        onBefore: () => {
          setCurrent('Notifications');
        },
      },
    ],
    [setCurrent],
  );

  const getStepsForCurrentTab = useCallback(() => {
    const current = getCurrentTab();

    const nav = allSteps.find((s) => s.key === 'nav_side')!;

    // Build 3 steps per tab: nav (common) + current tab main section + a
    // “what to do next” sub-step (based on the same section).
    // If a secondary target doesn't exist on the current render, we fall back
    // to the main tab step.
    const stepByTab: Record<string, { mainKey: string; nextKey?: string }> = {
      'All Items': { mainKey: 'tab_all', nextKey: 'tab_all' },
      // Reports
      'Submit Reports': { mainKey: 'tab_reports', nextKey: 'tab_reports' },
      'Your Reports': {
        mainKey: 'tab_your_reports',
        nextKey: 'tab_your_reports',
      },
      // Claims
      'Submit Claims': { mainKey: 'tab_claims', nextKey: 'tab_claims' },
      'Your Claims': {
        mainKey: 'tab_your_claims',
        nextKey: 'tab_your_claims',
      },
      // Lookouts / Chat / Alerts
      'Item Lookouts': { mainKey: 'tab_lookouts', nextKey: 'tab_lookouts' },
      Chats: { mainKey: 'tab_chats', nextKey: 'tab_chats' },
      Notifications: { mainKey: 'tab_alerts', nextKey: 'tab_alerts' },
    };

    // We want EXACTLY 3 steps: nav -> list (incl. filters) -> item details.
    // For All Items we override the 3-step mapping precisely.
    if (current === 'All Items') {
      const sNav = allSteps.find((s) => s.key === 'nav_side')!;
      const listStep = allSteps.find((s) => s.key === 'tab_all') ?? allSteps[1];
      const detailStep =
        allSteps.find((s) => s.key === 'tab_all_detail') ?? listStep;

      return [
        sNav,
        {
          ...listStep,
          elementId: 'home-unclaimed-items',
          title: 'All Items + Filters',
          intro:
            "All Items is where you see items that haven't been claimed yet. This area includes the filters (Text, Image, Location) so you can narrow results quickly. Select an item to open the detailed view.",
          position: 'top',
        },
        detailStep,
      ];
    }

    const desired = stepByTab[current] ?? stepByTab['All Items'];

    const mainStep =
      allSteps.find((s) => s.key === desired.mainKey) ?? allSteps[1];
    const nextStep =
      desired.nextKey && allSteps.find((s) => s.key === desired.nextKey);

    const s1 = mainStep;
    const s2 = nextStep ?? mainStep;

    return [nav, s1, s2];
  }, [allSteps, getCurrentTab]);

  const stop = useCallback(() => {
    try {
      introRef.current?.exit();
    } catch {}
    introRef.current = null;
    setRunning(false);
  }, []);

  const start = useCallback(async () => {
    if (running) return;

    const { default: introJs } = await import('intro.js');

    // intro.js has no TS typings for CSS imports.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await import('intro.js/introjs.css');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await import('intro.js/themes/introjs-modern.css');

    const intro: AnyIntro = introJs();

    const waitForElement = async (cssSelector: string, timeoutMs = 4000) => {
      const startTime = Date.now();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const el = document.querySelector(cssSelector);
        if (el) return el as HTMLElement;
        if (Date.now() - startTime > timeoutMs) return null;
        await new Promise((r) => setTimeout(r, 50));
      }
    };

    const steps: IntroStep[] = getStepsForCurrentTab().filter(
      (s): s is IntroStep => Boolean(s && typeof s === 'object'),
    );

    const introSteps = steps.map((s) => {
      return {
        element: `#${s.elementId}`,
        intro: s.intro,
        position: (s.position ?? 'top') as TutorialPosition,
      };
    });

    // Intro.js modifies DOM around the current view; we keep the steps/options
    // minimal to avoid layout/height side effects.
    intro.setOptions({
      steps: introSteps as AnyIntro,
      // Fix occasional layout/overlay spacing issues by disabling Intro's helper scroll behavior.
      // (This prevents the page from gaining extra bottom space in some routes.)
      scrollToElement: false,
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      disableInteraction: true,
      // scrollToElement: true,
      nextLabel: 'Next \u2192',
      prevLabel: '\u2190 Back',
      doneLabel: 'Done',
    });

    intro.onbeforechange?.(async (target: { index?: number }) => {
      const nextIndex = target?.index ?? -1;
      const step = steps[nextIndex];
      if (!step) return;

      await waitForElement(`#${step.elementId}`);

      if (step.onBefore) {
        await step.onBefore();

        // For the mobile layout, keep `mobileTab` in sync.
        if (!isDesktop()) {
          if (step.elementId === 'home-report-section') setMobileTab('Reports');
          if (step.elementId === 'home-your-reports')
            setMobileTab('Your Reports');
          if (step.elementId === 'home-claim-section') setMobileTab('Claims');
          if (step.elementId === 'home-your-claims')
            setMobileTab('Your Claims');
        }
      }
    });

    intro.onexit?.(() => {
      introRef.current = null;
      setRunning(false);
    });

    intro.oncomplete?.(() => {
      introRef.current = null;
      setRunning(false);
    });

    introRef.current = intro;
    setRunning(true);

    // Wait for the first target (#home-nav) and the current tab target to exist before starting.
    await waitForElement('#home-nav', 4000);

    const tabStep = steps[1];
    if (tabStep?.elementId) {
      await waitForElement(`#${tabStep.elementId}`, 4000);
    }

    intro.start();
  }, [getStepsForCurrentTab, isDesktop, running, setMobileTab]);

  return {
    running,
    start,
    stop,
  };
}
