import { Metadata } from 'next';
import Link from 'next/link';
import { User, Heart, MapPin, ShoppingBag, Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mi Perfil - A un clic la',
  description: 'Gestiona tu perfil y preferencias en A un clic la',
};

const profileTabs = [
  {
    value: "profile",
    label: "Perfil",
    icon: User,
    href: "/profile"
  },
  {
    value: "favorites",
    label: "Favoritos",
    icon: Heart,
    href: "/profile/favorites"
  },
  {
    value: "addresses",
    label: "Direcciones",
    icon: MapPin,
    href: "/profile/addresses"
  },
  {
    value: "orders",
    label: "Pedidos",
    icon: ShoppingBag,
    href: "/profile/orders"
  },
  {
    value: "settings",
    label: "Ajustes",
    icon: Settings,
    href: "/profile/settings"
  }
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menú lateral - Solo visible en desktop */}
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
        
        {/* Contenido principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}