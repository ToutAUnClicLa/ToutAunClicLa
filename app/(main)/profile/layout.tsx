import { Metadata } from 'next';
import { ProfileBackLink } from '@/components/features/profile/ProfileChrome';

export const metadata: Metadata = {
  title: {
    template: '%s | Tout à un Clic Là',
    default: 'Account | Tout à un Clic Là',
  },
  description: 'Manage your Tout à un Clic Là account, addresses, favorites and orders.',
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    // min-h-screen is the account canvas only. The negative margin cancels main's header padding so this 100vh block ends on the fold and the shop footer sits under it.
    <div className="-mt-[var(--shop-header-h)] min-h-screen bg-[var(--shop-canvas-muted)] pt-[var(--shop-header-h)] text-[var(--shop-ink)]">
      <div className="container py-8 sm:py-10 lg:py-12">
        <ProfileBackLink />
        {children}
      </div>
    </div>
  );
}
