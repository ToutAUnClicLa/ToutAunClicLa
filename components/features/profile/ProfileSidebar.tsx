"use client";

import Link from 'next/link';
import { User, Heart, MapPin, ShoppingBag, Settings, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const getProfileTabs = (t: any) => [
  {
    value: "profile",
    label: t('profile.navigation.profile'),
    icon: User,
    href: "/profile"
  },
  {
    value: "favorites",
    label: t('profile.navigation.favorites'),
    icon: Heart,
    href: "/profile/favorites"
  },
  {
    value: "addresses",
    label: t('profile.navigation.addresses'),
    icon: MapPin,
    href: "/profile/addresses"
  },
  {
    value: "orders",
    label: t('profile.navigation.orders'),
    icon: ShoppingBag,
    href: "/profile/orders"
  },
  {
    value: "security",
    label: t('profile.navigation.security'),
    icon: Shield,
    href: "/profile/security"
  },
  {
    value: "settings",
    label: t('profile.navigation.settings'),
    icon: Settings,
    href: "/profile/settings"
  }
];

export default function ProfileSidebar() {
  const { t } = useTranslation();
  const profileTabs = getProfileTabs(t);
  
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-24 space-y-2">
        {profileTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.value}
              href={tab.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Icon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
