# Shop / homepage identity

**Coming soon.**

The storefront at `/` keeps its current look. Do not redesign the homepage, catalog chrome, or shop marketing in this pass. A future identity is expected to *resemble* Servicios Pro (white + indigo, Inter, 8px radius) — that work is not specified here yet.

Until this file is replaced with a real spec:

- Implement shop UI against the existing `(main)` styles (`app/(main)/globals.css`), not `pro-theme.css`.
- Do not leak Pro Preflight (Pro must not add `@tailwind base`). Do not hoist `.pro-theme` onto `html`/`body` for the shop.
- Do not restyle shop transactional emails to match Pro; those stay shop.
- When the new homepage spec lands, write it here and update `README.md`.
