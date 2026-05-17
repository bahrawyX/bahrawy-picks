export const springSnappy = { type: 'spring' as const, stiffness: 500, damping: 35, mass: 0.8 }
export const springGentle = { type: 'spring' as const, stiffness: 300, damping: 30, mass: 1 }
export const tweenSmooth = { type: 'tween' as const, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], duration: 0.3 }
export const tweenExit = { type: 'tween' as const, ease: [0.3, 0, 1, 1] as [number, number, number, number], duration: 0.2 }

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export const slideLeft = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export const slideRight = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
}
