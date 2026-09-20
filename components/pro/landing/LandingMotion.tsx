'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function LandingMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const ease = 'power2.out';
        const duration = 0.22;

        const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero-item]');
        if (heroItems.length) {
          gsap.set(heroItems, { opacity: 0, y: 8 });
          gsap
            .timeline({ defaults: { ease, duration } })
            .to(heroItems, { opacity: 1, y: 0, stagger: 0.04 });
        }

        const sections = gsap.utils.toArray<HTMLElement>('[data-animate-section]');
        sections.forEach((section) => {
          // Animate inner copy/cards only — never the section node (keeps full-bleed bg).
          const items = gsap.utils.toArray<HTMLElement>('[data-animate-item]', section);
          const tl = gsap.timeline({
            defaults: { ease, duration },
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              end: 'top 48%',
              toggleActions: 'play none none none',
            },
          });

          const head = section.querySelector('[data-animate-head]');
          if (head) {
            const kids = gsap.utils.toArray<HTMLElement>(head.children);
            gsap.set(kids, { opacity: 0, y: 8 });
            tl.to(kids, { opacity: 1, y: 0, stagger: 0.04 });
          }

          if (!items.length) return;
          gsap.set(items, { opacity: 0, y: 10 });
          tl.to(items, { opacity: 1, y: 0, stagger: 0.05 }, head ? '-=0.08' : 0);

          const rows = gsap.utils.toArray<HTMLElement>('details', section);
          if (rows.length) {
            gsap.set(rows, { opacity: 0, y: 6 });
            tl.to(rows, { opacity: 1, y: 0, stagger: 0.04 }, '<0.04');
          }
        });

        ScrollTrigger.refresh();
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
