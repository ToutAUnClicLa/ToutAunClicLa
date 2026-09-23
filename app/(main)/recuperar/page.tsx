import { redirect } from 'next/navigation';
import { shopAuthAliasHref } from '@/lib/shop-auth';

export default function RecuperarAlias({
  searchParams,
}: {
  searchParams?: { next?: string; email?: string };
}) {
  redirect(shopAuthAliasHref('/forgot-password', searchParams));
}
