import "@testing-library/jest-dom";

// recharts' ResponsiveContainer measures its parent via ResizeObserver, which
// jsdom doesn't implement — without a stub, any recharts-based component
// throws in tests. Report a fixed, non-zero size so charts actually render
// DOM nodes (bars/axes/tooltip) instead of staying at 0x0.
class ResizeObserverStub {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [{ target, contentRect: { width: 400, height: 200 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver
    );
  }
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub;

// jsdom doesn't implement IntersectionObserver — scroll-reveal hooks
// (Preview Design's local useReveal()/Reveal, and the pre-existing
// client/src/hooks/useReveal.ts consumed by components/layout/Reveal.tsx)
// call `new IntersectionObserver(...)` unconditionally on mount, so any test
// that renders a component using either throws without a stub. Invoke the
// callback immediately with isIntersecting: true so scroll-revealed content
// is visible right away in tests instead of staying permanently hidden.
class IntersectionObserverStub {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    this.callback(
      [{ target, isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    );
  }
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

// jsdom doesn't implement scrollIntoView — components that auto-scroll a
// chat/list (e.g. Chatbot.tsx) throw "not a function" without a stub. This
// setup file also loads for server (node env) tests, where `Element`
// doesn't exist at all — guard so those don't crash on import.
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = function scrollIntoViewStub() {};
}

// jsdom doesn't implement window.matchMedia — client/src/hooks/useReveal.ts
// calls it directly (`prefers-reduced-motion`) with no guard, so any test
// that renders components/layout/Reveal.tsx (or anything using that hook)
// throws "not a function" without a stub. Same non-browser-environment
// guard as above, since this file also loads for server (node env) tests
// where `window` doesn't exist at all.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = function matchMediaStub(query: string) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  };
}
