# Servicios Pro — visual identity (current)

Source of truth: live CSS in `app/pro/pro-theme.css`, landing (`app/pro/page.tsx`), and `components/pro/ui/button.tsx`. Use this for Pro UI **and** professional Resend emails. Do not use shop merch (“Amérique Latine”), emerald grocery greens, or the old `#004d40` Pro header.

There is **no** Apple Wallet product. Dashboard `/pro/dashboard/wallet` is an honest empty / coming-soon shell.

---

## Personality

White canvas, one indigo accent, hairline zinc borders, 8px rhythm. Professional digital card product (TÀUCL Pro), not a storefront.

---

## Color tokens (light)

CSS variables are **HSL channels** (no `hsl()` wrapper) on `.pro-theme`:

| Token | HSL | Hex / RGB (approx) | Use |
| --- | --- | --- | --- |
| `--primary` | `243 75% 59%` | `#5048e5` · `rgb(80, 72, 229)` | Buttons, kickers, checks, ring. Matches Tailwind **indigo-600** `#4f46e5` / `rgb(79, 70, 229)` used as `bg-primary` on full-bleed bands. |
| `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text/icons on primary |
| `--background` | `0 0% 100%` | `#ffffff` | Page canvas |
| `--card` | `0 0% 100%` | `#ffffff` | Cards, auth panel, email body |
| `--foreground` | `240 6% 10%` | `#18181b` | Titles, body |
| `--muted-foreground` | `240 4% 42%` | `#65656e` | Subcopy |
| `--secondary` / `--muted` | `243 45% 97%` | `#f4f3fc` | Soft fills, email footer wash |
| `--accent` | `243 80% 95%` | `#ebe9fd` | Icon tiles, selection, code-box fill |
| `--accent-foreground` | `243 55% 38%` | `#3d3696` | Icons on accent |
| `--border` | `240 6% 90%` | `#e4e4e7` | Hairline 1px |
| `--input` | `240 6% 84%` | `#d4d4d8` | Input border |
| `--ring` | same as primary | | Focus |
| `--destructive` | `0 72% 51%` | `#dc2626` | Danger only |
| `--ink` | `243 62% 16%` | `#1a1650` | Dark indigo (legacy token; bands now use **primary**, not zinc-950) |

**Emails:** solid `#4f46e5` header, white body, indigo links, no purple gradient (`#667eea` / `#764ba2`), no emerald.

Dark-mode variables exist on `.dark .pro-theme` but Pro does **not** ship a theme toggle. Do not invert emails.

---

## Type

- **UI:** `Inter` via `next/font/google` on `app/pro/layout.tsx` → `--font-pro-sans`.
- **Fallback stack:** `var(--font-pro-sans), ui-sans-serif, system-ui, sans-serif` (emails: `Inter, ui-sans-serif, system-ui, sans-serif`).
- Features: `'cv02','cv03','cv04','cv11'`; tracking `-0.011em`; body `line-height: 1.5`; antialiased.
- **Hero H1** `.pro-hero-title`: `clamp(2.5rem, 5.5vw, 4rem)`, weight 600, line-height 1.05, tracking `-0.03em`.
- **Kicker** `.pro-kicker`: 12px, weight 500, uppercase, tracking `0.06em`, color primary.
- On `.pro-ink` bands: kicker `hsl(243 90% 82%)`; body copy `hsl(243 30% 84%)`; headings white.

`/card/:slug` is **not** inside `.pro-theme`; it may still use shop body font. Do not promise matching Inter there until it is wrapped.

---

## Shape, space, shadow

- `--radius: 0.5rem` (**8px**) — cards, buttons, inputs, icon tiles, email card.
- Spacing rhythm: 8px. Section padding `.pro-section`: `clamp(4rem, 8vw, 7rem)` block.
- Content columns: landing inner `max-w-6xl`; headers often `max-w-4xl` so logo/actions are not pinned to the viewport edge.
- Shadows: `--shadow-sm` `0 1px 2px rgb(24 24 27 / 0.04)` (default cards). No lift/bounce on hover.
- Cards: white, 1px border, `padding: 1.5rem`. Empty states: `2.5rem 1.5rem`, centered.

---

## Surfaces

- **Canvas** `.pro-canvas`: white + faint indigo orb `radial-gradient(70% 42% at 50% -10%, hsl(243 90% 94% / 0.55), transparent 55%)`.
- **Hero** `.pro-hero-bg`: white + orb at `72% -8%` + 24px dotted grid masked to the top. Auth uses the same hero wash.
- **Full-bleed bands** `.pro-ink` + `bg-primary`: solid primary (no radial glow). Two on landing (features + final CTA). Nested `.pro-card` stays white with dark text.

---

## Components

**Buttons** (`components/pro/ui/button.tsx`): `rounded-lg`, 180ms ease-out, class `pro-btn`. Primary fill `hsl(primary)`, hover `/0.9`, min-height **3rem** (`min-h-12`), default `px-5 py-2.5` text-sm; `lg` `px-7 py-3`; `sm` `min-h-11`; icon 44×44. Secondary: white + border. Ghost: text. Loading: spinner (do not replace with Wallet chrome).

**Focus:** double ring `0 0 0 2px background, 0 0 0 4px ring`.

**Icon tile** `.pro-icon-tile`: 40×40, radius 8px, accent fill.

**Cookie bar:** `html.pro-consent-open .pro-theme { padding-bottom: 7.5rem }` so pricing CTAs are not covered.

---

## Motion

- Duration `--pro-duration: 180ms`; easing `--pro-ease: cubic-bezier(0, 0, 0.2, 1)`.
- Hover on cards: border + shadow only (no translate).
- AirDrop chip: 180ms fade/slide 6px. Banner in: 200ms.
- Testimonials marquee: 36s linear, `translateX(-50%)`, pause on hover/focus; two copies of the track.
- GSAP on landing fades section heads on scroll; `prefers-reduced-motion` kills animations (CSS) and GSAP matchMedia should skip.
- Skeleton shimmer 1.6s.

---

## Copy / chrome notes for emails

- Product name: **TÀUCL Pro** / Tout À Un Clic Là Pro. Tagline: professional card for independents (FR default).
- Support: `serviceclient@toutaunclicla.com`.
- Verification / reset codes: large tabular/mono, letter-spacing, on accent wash + primary border — not orange shop boxes, not green grocery boxes.
