# Shop / homepage identity

**Current shop landing (`/`):** white canvas, ink `#0a2540`, one brand accent `#4f46e5`. Order: Hero → Restaurantes → Servicios → Souvenirs. Testimonials are not mounted. Productos is in the file behind `{false && …}` and is not on the page.

Source of truth: `app/(main)/page.tsx`, `app/(main)/globals.css` (`:root` + home classes), `lib/shop-theme.ts`. Hex lives only in `:root`; `shop-theme.ts` points at those variables. Do not restyle `/pro` — that surface is `diseno-pro.md`.

---

## Canvas and type

- Page shell: `min-h-screen bg-white`. Aisle sections are white too (`shopSection.*.wash` is `bg-white`), with a top hairline (`--shop-hairline`) and `py-20 sm:py-24 lg:py-28`.
- Container: `max-w-7xl`, `px-4 sm:px-6 lg:px-8`.
- Type: `Inter` (`next/font/google`, `latin`) on `body` in `app/layout.tsx`. No extra font features on the shop.
- Section title: `font-semibold`, `leading-[1.15]`, `tracking-tight`, `text-[var(--shop-ink)]`, `text-[1.75rem] sm:text-4xl lg:text-[2.5rem]`. Description: `--shop-muted`, `text-base sm:text-lg`, `max-w-xl`.
- Section icon tile: `h-9 w-9 rounded-lg`. Tone classes below.

`themeColor` and the mask icon are `#4f46e5`.

---

## Color tokens

| Token | Hex | Where it shows on `/` |
| --- | --- | --- |
| `--shop-purple` | `#4f46e5` | Search submit, Servicios and Souvenirs aisle CTAs, footer fill, header login, active nav, “Pro” kicker text, souvenir “view” links |
| `--shop-purple-hover` | `#4338ca` | Hover of those purple fills |
| `--shop-purple-wash` | `#eef2ff` | Souvenir icon tile; aisle-chip hover |
| `--shop-purple-muted` | `#a5b4fc` | Aisle-chip hover border; search focus border |
| `--shop-ink` | `#0a2540` | Hero title and lede, section titles, souvenir card titles, food-card scrim |
| `--shop-muted` | `#425466` | Section and card descriptions |
| `--shop-hairline` | `#e6e9ee` | Header, section, card, and chip borders |
| `--shop-canvas-muted` | `#f6f9fc` | Souvenir image well |
| `--food-accent` | `#d97706` | Restaurantes aisle CTA only |
| `--food-wash` | `#fff7ed` | Restaurantes icon tile |
| `--food-ink` | `#b45309` | Restaurantes icon |
| `--svc-primary` | `#4f46e5` | Same hex as `--shop-purple`; Servicios and Souvenirs CTAs use this variable |
| `--svc-wash` | `#eef2ff` | Servicios icon tile |
| `--svc-ink` | `#3730a3` | Servicios icon |

There is no full-bleed navy, no boutique purple `#9333ea`, and no terracotta or amber rail on the aisles.

---

## Header

Fixed, `h-[4.5rem]`, `bg-white/90`, `backdrop-blur-md`, bottom hairline. After scroll, a 1px hairline shadow. Logo `/logoaunclic.svg` at 60×60. Wordmark: “Tout à un” in ink, “Clic Là” in `#4f46e5`. `main` pads `pt-[4.5rem]` (`MainContentWrapper`). In-page jumps subtract `SHOP_HEADER_PX` (72) plus 12px. `html` has `scroll-padding-top: 5.5rem`. Hidden on restaurante dashboard, admin, and factura routes — same as the footer.

Nav links: Inicio, Comidas, Servicios, Boutique. Productos is commented out. Active link is `#4f46e5` with a 1px underline.

---

## Hero

Full viewport under the fixed header (`.shop-hero`: `min-height: calc(100vh - 4.5rem)` and the same with `100dvh`).

- Photo: `/landing/hero/heroImg.webp`, `fill`, `object-cover object-[center_32%]`, `priority`, empty alt.
- Veil: `.shop-hero-scrim` covers the photo — `rgb(255 206 140 / 0.68)`. Warm apricot wash. It is not a full-screen navy overlay (`bg-[var(--shop-ink)]/75` is gone).
- Block: centered in the viewport (`items-center justify-center`) and centered in itself (`items-center text-center`, `max-w-2xl`).
- Title “Tout à un Clic Là”: ink `#0a2540` (`--shop-ink`), `max-w-[11ch]`, `font-semibold`, `leading-[1.05]`, `tracking-tight`, `text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.5rem]`.
- Lede: `landing.hero.description`, same ink, `max-w-lg`.
- Search (`HomeSearchBar`): white pill, hairline, 1px shadow. Submit is `#4f46e5`, hover `#4338ca`, label “Buscar” from `sm` up.
- Chips under the search (centered row): Restaurantes → `#comidas`, Servicios → `#servicios`, Souvenirs → `#boutique`. White pills, hairline, ink label, icon in `#4f46e5`. They call `scrollToSection` (smooth, unless reduced motion).

Entrance on the block: Framer Motion from `y: 8` to `0`, `0.4s` `easeOut`. `prefers-reduced-motion` skips it (`duration: 0`, and `.shop-hero-motion` is forced still in CSS).

---

## Aisles

Each aisle is a `Section`: icon tile, title, description, optional kicker, pill CTA on the right from `md` up. Live order is Restaurantes, Servicios, Souvenirs.

### Restaurantes (`#comidas`)

Tone `food`. Tile `--food-wash`, icon `--food-ink`. CTA “Ver catálogo completo” links to `/comidas` with fill `#d97706`.

One card, not a rail. Image `/landing/comidas/ComidasImg.webp` inside `shopBanner`: `rounded-xl`, hairline, `min-h-[22rem]`, from `sm` `aspect-[16/7]` with `min-h-[18rem] max-h-[22rem]`, `md:max-h-[24rem]`.

Scrim `.shop-food-scrim` is a gradient **up from the bottom** of the card: `--shop-ink` at 0%, ink at 84% opacity at 32%, transparent at 60%. Copy sits in that lower band (white title, description `line-clamp-2`, “Explorar restaurantes” + arrow). The photo above ~60% stays clear. The whole card is a link to `/comidas` and has `shop-press`.

### Servicios (`#servicios`)

Tone `svc`. Tile `--svc-wash`, icon `--svc-ink`. Hardcoded kicker “Pro” (hairline pill, `#4f46e5` text). CTA “Conoce a los profesionales” links to `/servicios` with fill `#4f46e5`.

Grid: 2 columns, `lg:grid-cols-3`. Ten `ServiceCard`s with `variant="pro"` (lawyers, health, accounting, finance, realestate, cars, beauty, translation, money, maintenance), each wrapped in `shop-press`, linking to `/servicios/{id}`.

Pro card (this variant only): white, hairline, `rounded-xl`, image `aspect-[16/10]` `object-top`, no dark photo overlay and no “coming soon” badge. Title ink, hover `#4f46e5`. Description and subservice chips are `hidden` below `sm`. The card link is purple text plus an arrow, not a filled button.

### Souvenirs (`#boutique`)

Tone `souv`. Tile `--shop-purple-wash`, icon `#4f46e5`. CTA “Ver catálogo completo” links to `/boutique` with the same `#4f46e5` fill as Servicios (not a separate souvenir color).

Grid: 1 column, `sm:grid-cols-3`. Three translation cards (Accesorios Decorativos, Souvenirs, Ropa): white, hairline, `rounded-xl`, image `aspect-[16/10]` on `--shop-canvas-muted`, title ink, description `--shop-muted` `line-clamp-2`, “view” link in `#4f46e5`. Each link has `shop-press`. They do not use the `shopTile` class.

---

## Footer

Solid `#4f46e5`, white type. Logo `/logotoutaunclic.png` 60×60, wordmark both lines white. Three columns: about + social (Twitter, Instagram, Facebook, YouTube), Explorar (Inicio, Comidas, Servicios, Boutique), Contacto (address, `mailto:serviceclient@toutaunclicla.com`, WhatsApp pill: white fill, `#4f46e5` text, opens `wa.me/14384626255`).

Below a `white/20` rule: company links (about, blog, terms, privacy, FAQ), language buttons (es / fr / en, active is white semibold), Admin and Restaurante portals, copyright. Headings are `white/60`; body links `white/75`.

“¿Quieres trabajar con nosotros?” is a separate control, not in the footer: fixed bottom-right, `hidden` below `md`, appears after 1s, `rounded-lg`, fill `#4f46e5`, no shadow, opens the Google form. It fades in (0.2s) unless reduced motion.

---

## Motion

Scroll reveal is CSS plus one `IntersectionObserver` in `Home` (threshold `0.12`, once). Hero and each aisle carry `data-shop-reveal`. A node whose top is at or below 85% of the viewport gets `.shop-pending` (opacity 0, `translateY(8px)`). When it intersects, `.is-in` runs `shop-in` for `0.4s` `ease-out` (to opacity 1, no transform). Nodes already on screen are not marked pending, so they do not animate in.

Press: `.shop-press` on the food card, each service card, and each souvenir card. `transform 120ms ease-out`; `:active` scales to `0.985`. Not on the header, hero chips, or aisle CTA pills.

`prefers-reduced-motion: reduce` turns the observer off, kills `.shop-pending` / `.shop-press` / `.shop-hero-motion`, and sets `scroll-behavior: auto`. Section jumps then use `behavior: 'auto'`.
