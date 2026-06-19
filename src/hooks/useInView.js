import { useEffect, useRef, useState } from 'react';

// Reusable scroll-reveal: returns [ref, inView]. Adds the class once when the
// element first enters the viewport (then stops observing). Pair with the
// `.reveal` / `.is-visible` utilities (or component-scoped equivalents).
export function useInView(options = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
