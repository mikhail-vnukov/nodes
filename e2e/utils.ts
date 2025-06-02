// Playwright helper to expose Zustand store in the browser context for tests
export async function exposeZustandStore(page) {
  await page.addInitScript(() => {
    Object.defineProperty(window, '__zustandStore', {
      get() {
        // @ts-ignore
        return window.__ZUSTAND_STORE__;
      },
      set(val) {
        // @ts-ignore
        window.__ZUSTAND_STORE__ = val;
      },
      configurable: true
    });
  });
} 