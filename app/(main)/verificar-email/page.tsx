import { redirect } from 'next/navigation';
import { shopAuthAliasHref } from '@/lib/shop-auth';

export default function VerificarEmailAlias({
  searchParams,
}: {
  searchParams?: { next?: string; email?: string };
}) {
  redirect(shopAuthAliasHref('/verify-email', searchParams));
}
