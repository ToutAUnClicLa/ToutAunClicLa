'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Animaciones sutiles de entrada de la landing /pro. Este client component no
// convierte la página en client: se monta al final y anima por selectores
// data-attribute que page.tsx añade a los elementos. Solo transform/opacity.
//
// - [data-hero-item]: entrada escalonada al cargar (badge → headline → … → mockup).
// - [data-animate-section] + [data-animate-item]: reveal por scroll con stagger.
//
// FOUC inverso evitado: los elementos NO están ocultos en el CSS/JSX; el estado
// inicial oculto lo pone gsap.set dentro del efecto, así que si GSAP no corre
// (o reduced-motion) el contenido es visible de inmediato.
export function LandingMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const ease = 'power3.out';

        // Hero: entrada escalonada solo al cargar, una vez.
        const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero-item]');
        if (heroItems.length) {
          gsap.set(heroItems, { opacity: 0, y: 14 });
          gsap.set('[data-hero-mockup]', { scale: 0.97, transformOrigin: 'center center' });
          gsap
            .timeline({ defaults: { ease, duration: 0.6 } })
            .to(heroItems, { opacity: 1, y: 0, stagger: 0.09 })
            .to('[data-hero-mockup]', { scale: 1, duration: 0.7 }, '<0.1');
        }

        // Secciones: reveal por scroll con stagger, una sola vez.
        const sections = gsap.utils.toArray<HTMLElement>('[data-animate-section]');
        sections.forEach((section) => {
          const items = gsap.utils.toArray<HTMLElement>('[data-animate-item]', section);
          const targets = items.length ? items : [section];
          gsap.set(targets, { opacity: 0, y: 16 });
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease,
            stagger: 0.07,
            scrollTrigger: {
              trigger: section,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          });
        });

        ScrollTrigger.refresh();
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
