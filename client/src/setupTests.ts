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
