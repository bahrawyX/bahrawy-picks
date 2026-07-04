import '@testing-library/jest-dom'

// jsdom does not implement window.matchMedia; components consult it via
// usePrefersReducedMotion(). Stub it so renders don't throw (matches: false).
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
