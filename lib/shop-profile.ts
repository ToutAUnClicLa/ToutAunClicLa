/** Canonical English shop account routes. */

export const PROFILE = {
  root: '/profile',
  favorites: '/profile/favorites',
  addresses: '/profile/addresses',
  orders: '/profile/orders',
  security: '/profile/security',
  settings: '/profile/settings',
} as const;

export function orderPath(id: string): string {
  return `${PROFILE.orders}/${id}`;
}
