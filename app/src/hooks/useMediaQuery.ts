import { useEffect, useState } from 'react';

/** Subscribes to a media query. Used for the real mobile and tablet breakpoints. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** Below this the workspace renders the mobile screens for real. */
export const MOBILE_QUERY = '(max-width: 767px)';
/** Below this the two-column desktop grid collapses to one. */
export const TABLET_QUERY = '(max-width: 1180px)';
