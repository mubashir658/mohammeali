import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description?: string;
  canonical?: string;
}

/**
 * Sets per-route <title>, <meta name="description">, and canonical link.
 * Restores previous values on unmount so other routes aren't polluted.
 */
export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const setMeta = (selector: string, create: () => HTMLElement, apply: (el: HTMLElement) => void) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      const created = !el;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      const prev = el.getAttribute(el.tagName === 'META' ? 'content' : 'href');
      apply(el);
      return () => {
        if (created) el?.remove();
        else if (prev !== null) el?.setAttribute(el.tagName === 'META' ? 'content' : 'href', prev);
      };
    };

    const cleanups: Array<() => void> = [];

    if (description) {
      cleanups.push(
        setMeta(
          'meta[name="description"]',
          () => {
            const m = document.createElement('meta');
            m.setAttribute('name', 'description');
            return m;
          },
          (el) => el.setAttribute('content', description),
        ),
      );
      cleanups.push(
        setMeta(
          'meta[property="og:description"]',
          () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:description');
            return m;
          },
          (el) => el.setAttribute('content', description),
        ),
      );
    }

    cleanups.push(
      setMeta(
        'meta[property="og:title"]',
        () => {
          const m = document.createElement('meta');
          m.setAttribute('property', 'og:title');
          return m;
        },
        (el) => el.setAttribute('content', title),
      ),
    );

    if (canonical) {
      cleanups.push(
        setMeta(
          'link[rel="canonical"]',
          () => {
            const l = document.createElement('link');
            l.setAttribute('rel', 'canonical');
            return l;
          },
          (el) => el.setAttribute('href', canonical),
        ),
      );
      cleanups.push(
        setMeta(
          'meta[property="og:url"]',
          () => {
            const m = document.createElement('meta');
            m.setAttribute('property', 'og:url');
            return m;
          },
          (el) => el.setAttribute('content', canonical),
        ),
      );
    }

    return () => {
      document.title = prevTitle;
      cleanups.forEach((fn) => fn());
    };
  }, [title, description, canonical]);
}
