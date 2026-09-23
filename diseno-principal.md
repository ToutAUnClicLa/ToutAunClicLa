# Shop / homepage identity

**Current shop landing (`/`):** solid boutique purple `#9333ea` chrome (header / FAB / search), no rainbow gradients. Order Hero → Restaurantes (amber rail) → Servicios (Pro `#5048e5` rail) → Souvenirs (terracotta). Testimonials unmounted. Tokens in `app/(main)/globals.css` + `lib/shop-theme.ts`. Do not restyle `/pro`.

Until this file is replaced with a real spec:

- Implement shop UI against the existing `(main)` styles (`app/(main)/globals.css`), not `pro-theme.css`.
- Do not leak Pro Preflight (Pro must not add `@tailwind base`). Do not hoist `.pro-theme` onto `html`/`body` for the shop.
- Do not restyle shop transactional emails to match Pro; those stay shop.
- When the new homepage spec lands, write it here and update `README.md`.
