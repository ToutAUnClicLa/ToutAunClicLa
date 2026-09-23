import { redirect } from 'next/navigation';
import { shopAuthAliasHref } from '@/lib/shop-auth';

export default function RestablecerAlias({
  searchParams,
}: {
  searchParams?: { next?: string; email?: string };
}) {
  redirect(shopAuthAliasHref('/reset-password', searchParams));
}
