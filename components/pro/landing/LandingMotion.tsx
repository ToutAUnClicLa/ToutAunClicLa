'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Animaciones de entrada de la landing /pro (GSAP + ScrollTrigger). Este client
// component no convierte la página en client: se monta al final y anima por
// data-attributes que page.tsx añade a los elementos. Solo transform/opacity.
//
// - [data-hero-item]: entrada escalonada al cargar (badge → headline → … → mockup).
// - [data-animate-section]: reveal LIGADO al scroll (scrub). El progreso de la
//   animación sigue la posición del scroll entre start y end: al bajar avanza,
//   al subir se revierte. La cabecera ([data-animate-head]) revela primero;
//   después los items según el carácter de la sección (data-animate):
//   steps | bento | pricing | fade | faq | cta.
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

        // ---------- Hero: entrada escalonada solo al cargar ----------
        const heroItems = gsap.utils.toArray<HTMLElement>('[data-hero-item]');
        if (heroItems.length) {
          gsap.set(heroItems, { opacity: 0, y: 14 });
          gsap.set('[data-hero-mockup]', { scale: 0.97, transformOrigin: 'center center' });
          gsap
            .timeline({ defaults: { ease, duration: 0.6 } })
            .to(heroItems, { opacity: 1, y: 0, stagger: 0.09 })
            .to('[data-hero-mockup]', { scale: 1, duration: 0.7 }, '<0.1');
        }

        // ---------- Secciones: reveal por scroll con carácter propio ----------
        const sections = gsap.utils.toArray<HTMLElement>('[data-animate-section]');
        sections.forEach((section) => {
          const type = section.dataset.animate || 'rise';
          const items = gsap.utils.toArray<HTMLElement>('[data-animate-item]', section);

          const tl = gsap.timeline({
            defaults: { ease, duration: 0.65 },
            scrollTrigger: {
              trigger: section,
              // scrub ata el progreso al scroll: baja → avanza, sube → revierte.
              // El valor (0.6s) suaviza el "catch-up" para que no se sienta brusco.
              // start en 65% (no 85%): la sección ya está bien dentro del viewport
              // cuando empieza a revelarse, así el reveal se ve de verdad.
              start: 'top 65%',
              end: 'top 25%',
              scrub: 0.6,
            },
          });

          // Cabecera de sección: kicker → título → subtítulo.
          const head = section.querySelector('[data-animate-head]');
          if (head) {
            const kids = gsap.utils.toArray<HTMLElement>(head.children);
            gsap.set(kids, { opacity: 0, y: 16 });
            tl.to(kids, { opacity: 1, y: 0, stagger: 0.08 });
          }

          switch (type) {
            // Pasos: cards suben con scale sutil; el tile del icono hace "pop".
            case 'steps': {
              const tiles = gsap.utils.toArray<HTMLElement>('[data-step-icon]', section);
              gsap.set(items, { opacity: 0, y: 26, scale: 0.97 });
              gsap.set(tiles, { opacity: 0, scale: 0.6, transformOrigin: 'center center' });
              tl.to(items, { opacity: 1, y: 0, scale: 1, stagger: 0.12 }, head ? '-=0.3' : 0)
                .to(
                  tiles,
                  { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.12 },
                  '<0.15',
                );
              break;
            }

            // Bento: entrada direccional alternada (izquierda / derecha).
            case 'bento': {
              items.forEach((item, i) => {
                gsap.set(item, { opacity: 0, x: i % 2 === 0 ? -28 : 28, y: 10 });
                tl.to(item, { opacity: 1, x: 0, y: 0 }, (head ? 0.25 : 0) + i * 0.1);
              });
              break;
            }

            // Pricing: Free/Pro suben; la featured (Max) llega última con énfasis
            // y su badge "Recommandé" hace pop.
            case 'pricing': {
              const normal = items.filter((el) => !el.hasAttribute('data-featured'));
              const featured = items.find((el) => el.hasAttribute('data-featured'));
              const badge = featured?.querySelector('[data-pricing-badge]');
              gsap.set(normal, { opacity: 0, y: 26 });
              tl.to(normal, { opacity: 1, y: 0, stagger: 0.12 }, head ? '-=0.3' : 0);
              if (featured) {
                gsap.set(featured, {
                  opacity: 0,
                  y: 34,
                  scale: 0.955,
                  transformOrigin: 'center bottom',
                });
                tl.to(featured, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, '-=0.35');
              }
              if (badge) {
                gsap.set(badge, { opacity: 0, scale: 0.5, transformOrigin: 'center center' });
                tl.to(badge, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.5)' }, '-=0.2');
              }
              break;
            }

            // Marquee: fade puro (su transform interno ya está animado por CSS).
            case 'fade': {
              gsap.set(items, { opacity: 0 });
              tl.to(items, { opacity: 1, duration: 0.8 }, head ? '-=0.25' : 0);
              break;
            }

            // FAQ: las filas caen en cascada dentro del contenedor.
            case 'faq': {
              const rows = gsap.utils.toArray<HTMLElement>('details', section);
              gsap.set(items, { opacity: 0, y: 18 });
              gsap.set(rows, { opacity: 0, y: 12 });
              tl.to(items, { opacity: 1, y: 0 }, head ? '-=0.3' : 0).to(
                rows,
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 },
                '<0.1',
              );
              break;
            }

            // CTA final: la banda escala desde abajo y su contenido se revela después.
            case 'cta': {
              const inner = gsap.utils.toArray<HTMLElement>('[data-cta-item]', section);
              gsap.set(items, {
                opacity: 0,
                y: 30,
                scale: 0.95,
                transformOrigin: 'center bottom',
              });
              gsap.set(inner, { opacity: 0, y: 16 });
              tl.to(items, { opacity: 1, y: 0, scale: 1, duration: 0.75 }).to(
                inner,
                { opacity: 1, y: 0, stagger: 0.1 },
                '-=0.35',
              );
              break;
            }

            // Default: fade + rise con stagger (comportamiento original).
            default: {
              const targets = items.length ? items : [section];
              gsap.set(targets, { opacity: 0, y: 16 });
              tl.to(targets, { opacity: 1, y: 0, stagger: 0.07 }, head ? '-=0.3' : 0);
            }
          }
        });

        ScrollTrigger.refresh();
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
