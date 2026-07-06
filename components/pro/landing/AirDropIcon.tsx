// Icono AirDrop compartido (SVG puro, currentColor). Se usa idéntico en el chip
// del hero (HeroCardMockup) y en el paso 3 de "Comment ça marche".
export function AirDropIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.66 15l1.74-1a8 8 0 1 1 13.84 0l1.74 1A10 10 0 0 0 12 2Zm0 4a6 6 0 0 0-5.2 9l1.75-1a4 4 0 1 1 6.9 0l1.75 1A6 6 0 0 0 12 6Zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </svg>
  );
}
