'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type TutorialPosition = 'top' | 'bottom' | 'left' | 'right';

export type TutorialStep = {
  key: string;
  title: string;
  body: string;
  targetId: string;
  position?: TutorialPosition;
  /** Optional hook for cases where the target only exists after you set page state */
  onBefore?: () => Promise<void> | void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getTooltipPosition(
  rect: DOMRect,
  position: TutorialPosition,
  gapPx = 12,
) {
  const padding = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Default size estimate; the real size will be adjusted by CSS.
  const tooltipW = 320;
  const tooltipH = 140;

  let x = rect.left;
  let y = rect.top;

  if (position === 'right') {
    x = rect.right + gapPx;
    y = rect.top + rect.height / 2 - tooltipH / 2;
  } else if (position === 'left') {
    x = rect.left - tooltipW - gapPx;
    y = rect.top + rect.height / 2 - tooltipH / 2;
  } else if (position === 'bottom') {
    x = rect.left + rect.width / 2 - tooltipW / 2;
    y = rect.bottom + gapPx;
  } else {
    // top
    x = rect.left + rect.width / 2 - tooltipW / 2;
    y = rect.top - tooltipH - gapPx;
  }

  x = clamp(x, padding, vw - tooltipW - padding);
  y = clamp(y, padding, vh - tooltipH - padding);

  return { x, y };
}

export function useSimpleTutorial(steps: TutorialStep[]) {
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipXY, setTooltipXY] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [hasStarted, setHasStarted] = useState(false);

  const step = steps[stepIndex];
  const rafRef = useRef<number | null>(null);

  const computePositions = useCallback(
    (targetEl: HTMLElement) => {
      const rect = targetEl.getBoundingClientRect();
      // eslint-disable-next-line no-console
      console.log('[tutorial] computePositions', {
        targetId: step?.targetId,
        rect: {
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
        },
      });
      setTargetRect(rect);
      const position = step?.position ?? 'top';
      const xy = getTooltipPosition(rect, position);
      setTooltipXY(xy);
    },
    [step?.position, step?.targetId],
  );

  const findAndCompute = useCallback(async () => {
    if (!step) return;

    // Retry because the element may appear after we flip `current` state.
    const maxAttempts = 40;
    const delayMs = 50;

    for (let i = 0; i < maxAttempts; i++) {
      const el = document.getElementById(step.targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        // eslint-disable-next-line no-console
        console.log('[tutorial] findAndCompute el found', {
          targetId: step.targetId,
          attempt: i + 1,
          rect: { width: rect.width, height: rect.height },
        });
        // Wait until the element is measurable (not hidden / zero-size).
        if (rect.width > 0 && rect.height > 0) {
          computePositions(el);
          return;
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('[tutorial] findAndCompute el missing', {
          targetId: step?.targetId,
          attempt: i + 1,
        });
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }, [computePositions, step]);

  const start = useCallback(async () => {
    if (!steps.length) return;
    // eslint-disable-next-line no-console
    console.log('[tutorial] start()');
    setOpen(true);
    setHasStarted(true);
    setStepIndex(0);

    const s0 = steps[0];
    if (s0?.onBefore) {
      // eslint-disable-next-line no-console
      console.log('[tutorial] start onBefore', s0.key);
      await s0.onBefore();
    }
    await new Promise((r) => setTimeout(r, 0));
    await findAndCompute();
  }, [findAndCompute, steps]);

  const stop = useCallback(() => {
    setOpen(false);
    setStepIndex(0);
    setTargetRect(null);
    setTooltipXY(null);
  }, []);

  const goNext = useCallback(async () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex >= steps.length) {
      stop();
      return;
    }

    setStepIndex(nextIndex);

    const s = steps[nextIndex];
    if (s?.onBefore) await s.onBefore();

    await new Promise((r) => setTimeout(r, 0));
    await findAndCompute();
  }, [findAndCompute, stepIndex, steps, stop]);

  const goPrev = useCallback(() => {
    const prevIndex = stepIndex - 1;
    if (prevIndex < 0) return;
    setStepIndex(prevIndex);
  }, [stepIndex]);

  // Recompute on resize/scroll
  useEffect(() => {
    if (!open) return;

    const onUpdate = () => {
      const el = document.getElementById(step?.targetId ?? '');
      if (el) computePositions(el);
    };

    window.addEventListener('resize', onUpdate);
    window.addEventListener('scroll', onUpdate, true);

    // Initial
    const t = window.setTimeout(onUpdate, 50);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', onUpdate);
      window.removeEventListener('scroll', onUpdate, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [computePositions, open, step?.targetId]);

  const overlayStyle = useMemo(() => {
    if (!open || !targetRect) return undefined;
    return {
      left: targetRect.left + window.scrollX,
      top: targetRect.top + window.scrollY,
      width: targetRect.width,
      height: targetRect.height,
    };
  }, [open, targetRect]);

  return {
    open,
    hasStarted,
    stepIndex,
    step,
    overlayStyle,
    tooltipXY,
    start,
    stop,
    next: goNext,
    prev: goPrev,
    setOpen,
  };
}
