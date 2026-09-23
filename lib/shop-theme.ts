/**
 * Shop landing tokens. Hex lives only in `app/(main)/globals.css` :root.
 * Stripe-like system: white canvas, Inter, hairline chrome, compact header,
 * one accent (shop purple #4f46e5). Do not copy Stripe copy or assets.
 */
export const shopSection = {
  food: {
    wash: 'bg-white',
    icon: 'text-[var(--food-ink)]',
    tile: 'bg-[var(--food-wash)]',
    cta: 'bg-[var(--food-accent)] hover:brightness-95 text-white',
    focus:
      'outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
    hoverText: 'hover:text-[var(--food-ink)]',
    iconBtn:
      'min-h-11 min-w-11 h-11 w-11 shrink-0 text-gray-600 hover:text-[var(--food-ink)] hover:bg-[var(--food-wash)] outline-none focus:outline-none focus-visible:outline-none',
  },
  svc: {
    wash: 'bg-white',
    icon: 'text-[var(--svc-ink)]',
    tile: 'bg-[var(--svc-wash)]',
    cta: 'bg-[var(--shop-purple)] hover:bg-[var(--shop-purple-hover)] text-white',
  },
  souv: {
    wash: 'bg-white',
    icon: 'text-[var(--shop-purple)]',
    tile: 'bg-[var(--shop-purple-wash)]',
    cta: 'bg-[var(--shop-purple)] hover:bg-[var(--shop-purple-hover)] text-white',
  },
} as const;

export type ShopSectionTone = keyof typeof shopSection;

/** Food aisle banner — taller on mobile so overlay copy isn’t clipped. */
export const shopBanner =
  'relative overflow-hidden rounded-xl w-full min-h-[20rem] sm:min-h-0 sm:aspect-[16/7] sm:max-h-64 md:max-h-72 border border-[var(--shop-hairline)]';

/** Souvenir tiles. */
export const shopTile =
  'relative overflow-hidden rounded-xl w-full aspect-[4/3] max-h-44 sm:max-h-52 border border-[var(--shop-hairline)]';

/** Supporting hero photo (side / small bleed). */
export const shopHeroFigure =
  'relative overflow-hidden rounded-xl w-full aspect-[4/3] max-h-64 sm:max-h-80 lg:max-h-[26rem] border border-[var(--shop-hairline)] bg-[var(--shop-canvas-muted)] shadow-[0_1px_2px_rgba(15,23,42,0.06)]';

export const shopCss = {
  purple: 'var(--shop-purple)',
  purpleHover: 'var(--shop-purple-hover)',
  foodAccent: 'var(--food-accent)',
  svcPrimary: 'var(--svc-primary)',
  ink: 'var(--shop-ink)',
  hairline: 'var(--shop-hairline)',
} as const;

/** Header height — sticky offset / scroll-padding. 60px logo (~1.5× 40px). */
export const SHOP_HEADER_PX = 72;

export const shopChrome = {
  focus:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)] focus-visible:ring-offset-2',
  tap: 'min-h-11 min-w-11',
  iconBtn:
    'min-h-11 min-w-11 h-11 w-11 shrink-0 text-gray-600 hover:text-[var(--shop-ink)] hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)] focus-visible:ring-offset-2',
  textLink:
    'text-gray-600 hover:text-[var(--shop-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)] focus-visible:ring-offset-2 rounded-sm',
  drawerRow:
    'w-full justify-start min-h-11 h-11 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-[var(--shop-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)]',
  navLink:
    'relative inline-flex h-11 min-h-11 shrink-0 items-center whitespace-nowrap text-sm font-medium',
  inkCta:
    'inline-flex h-11 min-h-11 items-center justify-center rounded-full bg-[var(--shop-purple)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--shop-purple-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-purple)] focus-visible:ring-offset-2',
  aisleCta:
    'inline-flex h-11 min-h-11 shrink-0 items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white',
  aisleChip:
    'inline-flex h-11 min-h-11 items-center gap-2 rounded-full border border-[var(--shop-hairline)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--shop-ink)] hover:border-[var(--shop-purple-muted)] hover:bg-[var(--shop-purple-wash)]',
  /** Compact tags (search popular, directory langs) — not a 44px CTA. */
  filterChip:
    'inline-flex h-8 items-center rounded-full border border-[var(--shop-hairline)] bg-white px-3 text-[13px] font-medium leading-none text-[var(--shop-ink)] hover:border-[var(--shop-purple-muted)] hover:bg-[var(--shop-purple-wash)]',
  filterChipFood: 
    'inline-flex h-8 items-center rounded-full border border-[var(--shop-hairline)] bg-white px-3 text-[13px] font-medium leading-none text-[var(--shop-ink)] hover:border-[var(--food-accent)]',
  filterChipOn:
    'inline-flex h-8 items-center rounded-full border border-[var(--shop-purple)] bg-[var(--shop-purple)] px-3 text-[13px] font-medium leading-none text-white',
  aisleChipOnPurple:
    'inline-flex h-11 min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20',
  wordmark:
    'ml-1 flex flex-col leading-none tracking-[-0.06em]',
  cardGhostCta:
    'mt-3 inline-flex h-11 min-h-11 w-fit items-center gap-1.5 bg-transparent p-0 text-sm font-medium text-white',
  focusOnPurple:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--shop-purple)]',
  /** Padding lives on the shell — native inputs get padding:0 from Preflight. */
  searchField:
    'flex min-h-11 items-center gap-3 overflow-hidden rounded-full border border-[var(--shop-hairline)] bg-white px-4',
  searchInput:
    'min-h-11 min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[var(--shop-ink)] placeholder:text-gray-400 outline-none sm:text-base',
} as const;
