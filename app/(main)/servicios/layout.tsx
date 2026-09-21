import { ServiciosLangSync } from '@/components/features/services/ServiciosLangSync';

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiciosLangSync />
      {children}
    </>
  );
}
