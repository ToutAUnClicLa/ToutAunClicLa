/** Same-origin return URL for shop auth pages. Rejects loops and open redirects. */

const NEXT_KEY = 'shop_auth_next';

const AUTH_PREFIXES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/registro',
  '/recuperar',
  '/restablecer',
  '/verificar-email',
  '/auth',
];

export function safeNext(raw?: string | null): string {
  if (!raw) return '/';
  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return '/';
  }
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return '/';
  const pathname = path.split('?')[0];
  if (AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return '/';
  return path;
}

export function withNext(href: string, next?: string | null): string {
  const n = safeNext(next);
  if (n === '/') return href;
  const sep = href.includes('?') ? '&' : '?';
  return `${href}${sep}next=${encodeURIComponent(n)}`;
}

export function loginPath(next?: string | null): string {
  return withNext('/login', next);
}

export function registerPath(next?: string | null): string {
  return withNext('/register', next);
}

export function forgotPath(email?: string | null): string {
  return email?.trim()
    ? `/forgot-password?email=${encodeURIComponent(email.trim())}`
    : '/forgot-password';
}

export function resetPath(email?: string | null): string {
  return email?.trim()
    ? `/reset-password?email=${encodeURIComponent(email.trim())}`
    : '/reset-password';
}

export function verifyPath(email: string, next?: string | null): string {
  const href = `/verify-email?email=${encodeURIComponent(email)}`;
  return withNext(href, next);
}

/** Preserve email/next when aliasing ES → EN shop auth URLs. */
export function shopAuthAliasHref(
  canonical: string,
  search?: { email?: string; next?: string } | null
): string {
  const params = new URLSearchParams();
  const email = search?.email?.trim();
  if (email) params.set('email', email);
  const next = safeNext(search?.next);
  if (search?.next && next !== '/') params.set('next', next);
  const q = params.toString();
  return q ? `${canonical}?${q}` : canonical;
}

export function persistShopAuthNext(next?: string | null): void {
  if (typeof window === 'undefined') return;
  const n = safeNext(next);
  if (n === '/') {
    sessionStorage.removeItem(NEXT_KEY);
    return;
  }
  sessionStorage.setItem(NEXT_KEY, n);
}

export function consumeShopAuthNext(): string {
  if (typeof window === 'undefined') return '/';
  const stored = sessionStorage.getItem(NEXT_KEY);
  sessionStorage.removeItem(NEXT_KEY);
  return safeNext(stored);
}

export function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  return `${window.location.pathname}${window.location.search}`;
}

// ponytail: O(n) prefix scan; upgrade if auth routes grow.
export function assertSafeNext() {
  const cases: Array<[string | null, string]> = [
    [null, '/'],
    ['/cart', '/cart'],
    ['/cart?x=1', '/cart?x=1'],
    ['https://evil.com', '/'],
    ['//evil.com', '/'],
    ['/login', '/'],
    ['/register?next=/cart', '/'],
    ['/registro?next=/cart', '/'],
    ['/forgot-password', '/'],
    ['/verify-email', '/'],
    ['/profile/favorites', '/profile/favorites'],
  ];
  for (const [input, expected] of cases) {
    const got = safeNext(input);
    if (got !== expected) {
      throw new Error(`safeNext(${JSON.stringify(input)}) === ${got}, expected ${expected}`);
    }
  }
}
