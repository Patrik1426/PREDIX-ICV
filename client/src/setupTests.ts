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

// jsdom doesn't implement scrollIntoView — components that auto-scroll a
// chat/list (e.g. Chatbot.tsx) throw "not a function" without a stub. This
// setup file also loads for server (node env) tests, where `Element`
// doesn't exist at all — guard so those don't crash on import.
if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = function scrollIntoViewStub() {};
}
