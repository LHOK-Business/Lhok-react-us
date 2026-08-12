// Detects which site a signup came from, based on the hostname the app
// is actually running on. lhok.us and lhok.ca are separate deployments
// (no shared build config), so this is resolved at runtime in the browser.
export function getCountryOfOrigin() {
  return window.location.hostname.includes('lhok.ca') ? 'CAN' : 'USA';
}
