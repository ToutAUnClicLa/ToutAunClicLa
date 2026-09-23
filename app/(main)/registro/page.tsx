import { redirect } from 'next/navigation';
import { shopAuthAliasHref } from '@/lib/shop-auth';

export default function RegistroAlias({
  searchParams,
}: {
  searchParams?: { next?: string; email?: string };
}) {
  redirect(shopAuthAliasHref('/register', searchParams));
}
