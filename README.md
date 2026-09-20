# ToutAunClicLa (frontend)

Read this file first. It is the map of how this Next.js app is put together. If you change architecture (routes, CSS isolation, env, auth, i18n, scripts), update this file in the same change.

Two products share one Next 14 App Router app:

| Surface | URL | Layout | Who it is |
| --- | --- | --- | --- |
| Shop | `/` (and shop routes) | `app/(main)/layout.tsx` + `SiteChrome` | Latin-American grocery in Montreal |
| Servicios Pro | `/pro` | `app/pro/layout.tsx` + `.pro-theme` | Digital business cards for independents |

Public Pro cards live at `/card/:slug` inside the **shop** layout (not under `/pro`). Color is Pro; typeface still follows shop `body` Inter unless you wrap it in `.pro-theme`.

Do **not** restyle `/` to look like Pro in the same pass as Pro work. Shop identity is planned later — see `diseno-principal.md`. Live Pro identity is `diseno-pro.md`.

---

## Stack and scripts

- Next.js 14.2 App Router, React 18, TypeScript, Tailwind 3.3, shadcn/Radix in `components/common/ui` (shop) and `components/pro/ui` (Pro).
- `package.json` scripts: `npm run dev` / `build` / `start` / `lint`. Dev default is port 3000; bind elsewhere if needed.

```bash
cp .env.example .env.local   # then fill real values
npm install
npm run dev
```

Backend (Express) is expected at `http://localhost:5500` in development. `next.config.js` rewrites `/api/backend/:path*` → `http://localhost:5500/api/v1/:path*` (dev) or the Railway API (prod).

---

## App structure

```
app/layout.tsx              # html/body, Inter, shop Auth + Language, Toaster, GA
app/(main)/                 # shop: homepage, catalog, cart, profile, restaurante, admin
app/(main)/globals.css      # shop Tailwind @tailwind base (Preflight) — only here
app/pro/layout.tsx          # Inter --font-pro-sans, .pro-theme wrapper
app/pro/tailwind-pro.css    # @config tailwind.pro.config.ts; components + utilities only
app/pro/pro-theme.css       # Pro tokens + scoped reset (not a second Preflight on html)
app/card is actually         app/(main)/card/[slug]
translations/{es,en,fr}.ts
middleware.ts               # lang header, security headers, JWT on a few shop routes
```

Root `app/layout.tsx` wraps **everything**. Shop chrome is only under `(main)`. `/pro` does not mount `SiteChrome`.

---

## CSS isolation (do not break this)

Shop Preflight is global (`@tailwind base` in `app/(main)/globals.css`). Pro must **not** emit a second Preflight.

- `tailwind.pro.config.ts`: `corePlugins.preflight: false`, `important: '.pro-theme'`, content limited to `app/pro`, `components/pro`, public-card files.
- `app/pro/tailwind-pro.css` imports that config and only `@tailwind components` + `@tailwind utilities`.
- Tokens and a **scoped** reset live on `.pro-theme` in `pro-theme.css`. Never reset `html`/`body` as if they were Pro-only, except the `:has(.pro-theme)` margin:0 (shop UA margin would otherwise frame a cold `/pro` load).
- Shop `lg` breakpoint is **1025px** (`tailwind.config.ts`); Pro inherits it.

If you add Pro utilities, they must match inside `.pro-theme` so last-stylesheet-wins cannot restyle `/` after a visit to `/pro`.

---

## Env (`NEXT_PUBLIC_*`)

Copy `.env.example` → `.env.local`. Never commit secrets. Names only:

| Variable | Required | Use |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Browser Supabase client |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Anon key (not service role) |
| `NEXT_PUBLIC_API_BASE_URL` | yes | Shop API + Pro in production (`…/api/v1`) |
| `NEXT_PUBLIC_BASE_URL` | optional | Sitemap, Stripe success/cancel |
| `NEXT_PUBLIC_APP_URL` | optional | Pro card/QR/register origin (fallback localhost) |
| `JWT_SECRET` | shop middleware | Verify JWT on `/profile/orders` and `/profile/notifications`. If unset, those routes look logged-out. Must match backend. |

Pro `next dev` **ignores** `NEXT_PUBLIC_API_BASE_URL` and talks to `http://localhost:5500/api/v1` (`lib/pro/config.ts`). Production uses the env URL.

Google Analytics measurement ID `G-7MSB178MLC` is hardcoded in `app/layout.tsx` via `next/script` (`afterInteractive`) so it covers `/` and `/pro`.

---

## i18n

- Dictionaries: `translations/es.ts`, `en.ts`, `fr.ts`. Shop hook: `useTranslation` + `LanguageContext` (`preferred-language` cookie). Shop default **es**.
- Pro server copy: `lib/pro/i18n.ts` (`getProT`). Pro default **fr** (Loi 96) when cookie is missing (`middleware` sets `x-app-lang`).
- `next.config.js` still lists `i18n.locales`; routing is App Router paths, not `/es` folders. Language is cookie + `?lang=` on some Pro pages.

---

## Auth (two sessions)

- **Shop:** `AuthProvider` + `lib/services/auth.ts`. Token `localStorage` key `auth_token`. Google OAuth via backend. Middleware JWT only on `/profile/orders` and `/profile/notifications`.
- **Pro:** `ProAuthProvider` + `lib/pro/api.ts`. Token key `pro_token` (not the shop token). Dashboard layout redirects to `/pro` if missing or unverified. Do not mix the two cookies/keys.

---

## Routing cheat sheet

Shop: `/`, `/productos`, `/boutique`, `/comidas`, `/cart`, `/checkout/*`, `/profile/*`, `/servicios`, `/restaurante/*`, `/admin/*`, `/card/[slug]`.

Pro: `/pro` landing, `/pro/login|register|verify-email|forgot-password|reset-password`, `/pro/pricing`, `/pro/politica-privacidad`, `/pro/dashboard` (profile, card, vcard, analytics, account, wallet placeholder — do not invent Apple Wallet).

---

## Best practices

1. Architecture change → this README in the same diff.
2. Pro visuals → `diseno-pro.md` and `app/pro/pro-theme.css` stay in sync (tokens first).
3. Shop homepage look stays until `diseno-principal.md` is no longer “Coming soon”.
4. No extra markdown at repo root or in `docs/`. These three files only: `README.md`, `diseno-pro.md`, `diseno-principal.md`.
5. Pro UI primitives: `components/pro/ui` (`Button`, shells), not shop `components/common/ui`.
6. Keep shop transactional emails on the shop look; Pro Resend templates follow `diseno-pro.md`.
