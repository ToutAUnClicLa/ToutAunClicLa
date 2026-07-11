import { Metadata } from 'next';
import ProfileSidebar from '@/components/features/profile/ProfileSidebar';

// TODO: Los metadatos podrían ser dinámicos en el futuro según el idioma
export const metadata: Metadata = {
  title: {
    template: '%s | Tout à un Clic LA',
    default: 'Mi Perfil | Tout à un Clic LA'
  },
  description: 'Gestiona tu perfil, direcciones, favoritos y preferencias en Tout à un Clic LA',
  keywords: 'perfil, cuenta, direcciones, favoritos, configuración, usuario',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Menú lateral - Solo visible en desktop */}
        <ProfileSidebar />
        
        {/* Contenido principal */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}