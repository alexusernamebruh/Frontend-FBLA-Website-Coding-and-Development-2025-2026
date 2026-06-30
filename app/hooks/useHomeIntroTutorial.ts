'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { TutorialPosition } from './useSimpleTutorial';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyIntro = any;

type IntroStep = {
  key: string;
  elementId: string;
  intro: string;
  position?: TutorialPosition;
  onBefore?: () => void | Promise<void>;
};

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

  const allSteps = useMemo<Record<string, IntroStep>>(
    () => ({
      nav: {
        key: 'nav',
        elementId: 'home-nav',
        intro:
          'Use the sidebar to navigate between all sections of the Lost & Found portal.',
        position: 'right',
      },

      itemsList: {
        key: 'itemsList',
        elementId: 'home-items-list',
        intro:
          'Browse all currently unclaimed items. Search and filters help narrow down possible matches.',
        position: 'right',
        onBefore: () => setCurrent('All Items'),
      },

      itemsDetail: {
        key: 'itemsDetail',
        elementId: 'home-item-detail',
        intro:
          'Selecting an item displays its photos, description, location, and claim options.',
        position: 'left',
      },

      reportsList: {
        key: 'reportsList',
        elementId: 'home-reports-list',
        intro:
          'This panel contains every report that you have submitted and their current status.',
        position: 'right',
        onBefore: () => setCurrent('Your Reports'),
      },

      reportsDetail: {
        key: 'reportsDetail',
        elementId: 'home-reports-detail',
        intro:
          'Selecting a report displays its information and approval status.',
        position: 'left',
      },

      submitReport: {
        key: 'submitReport',
        elementId: 'home-report-section',
        intro:
          'Submit a lost item report by entering information about your item. Administrators can review and approve your report.',
        position: 'top',
        onBefore: () => setCurrent('Submit Reports'),
      },

      claimsList: {
        key: 'claimsList',
        elementId: 'home-claims-list',
        intro:
          'This panel contains all ownership claims that you have submitted.',
        position: 'right',
        onBefore: () => setCurrent('Your Claims'),
      },

      claimsDetail: {
        key: 'claimsDetail',
        elementId: 'home-claims-detail',
        intro: 'Selecting a claim displays its information and review status.',
        position: 'left',
      },

      submitClaim: {
        key: 'submitClaim',
        elementId: 'home-claim-section',
        intro:
          'Submit a claim if you believe an item belongs to you. Explain why the item matches and your claim will be reviewed.',
        position: 'top',
        onBefore: () => setCurrent('Submit Claims'),
      },

      lookouts: {
        key: 'lookouts',
        elementId: 'home-item-lookouts',
        intro:
          'Create item lookouts and receive notifications when similar items are found.',
        position: 'top',
        onBefore: () => setCurrent('Item Lookouts'),
      },

      chats: {
        key: 'chats',
        elementId: 'home-chats-container',
        intro:
          'Chat with other users to coordinate item pickup and ask questions.',
        position: 'top',
        onBefore: () => setCurrent('Chats'),
      },

      notificationsHeader: {
        key: 'notificationsHeader',
        elementId: 'home-notifications-header',
        intro:
          'Notifications keep you updated about reports, claims, chats, and lookout matches.',
        position: 'bottom',
        onBefore: () => setCurrent('Notifications'),
      },

      notificationsList: {
        key: 'notificationsList',
        elementId: 'home-notifications-list',
        intro:
          'Your notifications appear here and can be marked as read or unread.',
        position: 'left',
      },
    }),
    [setCurrent],
  );

  const getStepsForCurrentTab = useCallback(() => {
    const nav = allSteps.nav;
    const current = getCurrentTab();

    switch (current) {
      case 'All Items':
        return [nav, allSteps.itemsList, allSteps.itemsDetail];

      case 'Your Reports':
        return [nav, allSteps.reportsList, allSteps.reportsDetail];

      case 'Submit Reports':
        return [
          nav,
          allSteps.submitReport,
          {
            ...allSteps.submitReport,
            key: 'submitReport2',
            intro:
              'Complete the required fields and submit the report so administrators can review it.',
          },
        ];

      case 'Your Claims':
        return [nav, allSteps.claimsList, allSteps.claimsDetail];

      case 'Submit Claims':
        return [
          nav,
          allSteps.submitClaim,
          {
            ...allSteps.submitClaim,
            key: 'submitClaim2',
            intro:
              'Choose the matching item and explain why you believe it belongs to you.',
          },
        ];

      case 'Item Lookouts':
        return [
          nav,
          allSteps.lookouts,
          {
            ...allSteps.lookouts,
            key: 'lookouts2',
            intro:
              'You can manage your existing lookouts and receive notifications when similar items appear.',
          },
        ];

      case 'Chats':
        return [nav, allSteps.chats];

      case 'Notifications':
        return [nav, allSteps.notificationsHeader, allSteps.notificationsList];

      default:
        return [nav, allSteps.itemsList, allSteps.itemsDetail];
    }
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
    await import('intro.js/introjs.css');
    await import('intro.js/themes/introjs-modern.css');

    const intro: AnyIntro = introJs();

    const waitForElement = async (selector: string, timeoutMs = 4000) => {
      const startTime = Date.now();

      while (true) {
        const el = document.querySelector(selector);

        if (el) {
          return el as HTMLElement;
        }

        if (Date.now() - startTime > timeoutMs) {
          return null;
        }

        await new Promise((r) => setTimeout(r, 50));
      }
    };

    const steps = getStepsForCurrentTab();

    intro.setOptions({
      steps: steps.map((s) => ({
        element: `#${s.elementId}`,
        intro: s.intro,
        position: s.position ?? 'top',
      })),
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: false,
      disableInteraction: true,
      nextLabel: 'Next →',
      prevLabel: '← Back',
      doneLabel: 'Done',
      scrollToElement: false,
    });

    intro.onbeforechange?.(async (target: { index?: number }) => {
      const index = target?.index ?? -1;
      const step = steps[index];

      if (!step) return;

      if (step.onBefore) {
        await step.onBefore();
      }

      if (!isDesktop()) {
        const current = getCurrentTab();

        if (current === 'Your Reports' || current === 'Submit Reports') {
          setMobileTab('Reports');
        }

        if (current === 'Your Claims' || current === 'Submit Claims') {
          setMobileTab('Claims');
        }
      }

      await waitForElement(`#${step.elementId}`);
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

    await waitForElement('#home-nav');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        intro.refresh();
        intro.start();
      });
    });
  }, [getCurrentTab, getStepsForCurrentTab, isDesktop, running, setMobileTab]);

  return {
    running,
    start,
    stop,
  };
}
