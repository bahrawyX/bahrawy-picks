'use client';

import { useEffect } from 'react';
import { useLottie } from '../../hooks/useLottie';
import type { LayerColorMap } from '../../lib/lottie/colorInjector';
import { cn } from '../../lib/utils';

interface LottieAnimationProps {
  path: string;
  layerColorMap: LayerColorMap;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  segments?: [number, number];
  onComplete?: () => void;
  className?: string;
  width?: number | string;
  height?: number | string;
  /** When this transitions from false to true, restart and play */
  playTrigger?: boolean;
}

export function LottieAnimation({
  path,
  layerColorMap,
  loop = false,
  autoplay = true,
  speed = 1,
  segments,
  onComplete,
  className,
  width,
  height,
  playTrigger,
}: LottieAnimationProps) {
  const { containerRef, play, stop } = useLottie({
    path,
    layerColorMap,
    loop,
    autoplay: playTrigger === undefined ? autoplay : false,
    speed,
    segments,
    onComplete,
  });

  useEffect(() => {
    if (playTrigger === true) {
      stop();
      play();
    }
  }, [playTrigger, play, stop]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden', className)}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
        minWidth: width,
        minHeight: height,
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

export const EMPTY_STATE_TASKS_LAYER_MAP: LayerColorMap = {
  clipboard_body: 'border',
  clipboard_clip: 'mutedForeground',
  line_1: 'mutedForeground',
  line_2: 'mutedForeground',
  line_3: 'mutedForeground',
  dot_blink: 'primary',
  shadow: 'mutedForeground',
};
