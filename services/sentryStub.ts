// Temporary stub to replace @sentry/react-native while diagnosing a native
// startup crash. The Sentry SDK installs native crash handlers via autolinking
// at app launch, which we suspect is the cause. Swapping imports to this stub
// lets us uninstall the package entirely without touching every call site.

const noop = (..._args: any[]): void => {};

export const init = noop;
export const wrap = <T,>(component: T): T => component;
export const reactNavigationIntegration = (..._args: any[]) => ({
  registerNavigationContainer: noop,
});
export const captureException = noop;
export const captureMessage = noop;
export const addBreadcrumb = noop;
export const setUser = noop;
