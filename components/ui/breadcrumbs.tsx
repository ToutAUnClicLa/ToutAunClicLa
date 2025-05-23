"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbsProps {
  className?: string;
  separator?: React.ReactNode;
  homeIcon?: React.ReactNode;
  homeLabel?: string;
  customLabels?: Record<string, string>;
  containerClassName?: string;
  linkClassName?: string;
  activeClassName?: string;
  separatorClassName?: string;
  disableHome?: boolean;
  disableLastCrumb?: boolean;
}

export function Breadcrumbs({
  className,
  separator = <ChevronRight className="h-4 w-4" />,
  homeIcon = <Home className="h-4 w-4" />,
  homeLabel = "Inicio",
  customLabels = {},
  containerClassName,
  linkClassName,
  activeClassName,
  separatorClassName,
  disableHome = false,
  disableLastCrumb = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Si estamos en la página de inicio, no mostramos breadcrumbs
  if (pathname === "/") {
    return null;
  }

  // Dividir la ruta en segmentos
  const segments = pathname.split("/").filter(Boolean);

  // Función para obtener etiquetas personalizadas para cada segmento
  const getLabel = (segment: string, index: number, segments: string[]) => {
    // Verifica si hay una etiqueta personalizada para este segmento
    if (customLabels[segment]) {
      return customLabels[segment];
    }

    // Soporte multilingüe: si el segmento es un código de idioma, mostrarlo correctamente
    if (index === 0 && ["es", "fr", "en"].includes(segment)) {
      const languageLabels: Record<string, string> = {
        es: "Español",
        fr: "Français",
        en: "English",
      };
      return languageLabels[segment];
    }

    // Limpiar identificadores numéricos en URLs
    if (segment.match(/^[0-9a-f]{24}$/i) || segment.match(/^\d+$/)) {
      // Es un ID, buscar el segmento anterior para dar contexto
      const prevSegment = index > 0 ? segments[index - 1] : "";
      const contextualLabels: Record<string, string> = {
        productos: "Detalle de Producto",
        comidas: "Detalle de Comida",
        boutique: "Artículo de Boutique",
        blog: "Artículo de Blog",
      };
      return contextualLabels[prevSegment] || "Detalle";
    }

    // Convertir kebab-case a Title Case
    return segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Construir los elementos de breadcrumb
  const breadcrumbs = [];

  // Agregar enlace a la página de inicio
  if (!disableHome) {
    breadcrumbs.push(
      <li key="home" className="flex items-center">
        <Link
          href="/"
          className={cn(
            "flex items-center text-gray-600 hover:text-indigo-600 transition-colors",
            linkClassName
          )}
          aria-label="Ir a la página de inicio"
        >
          {homeIcon}
          <span className="ml-1 sr-only sm:not-sr-only">{homeLabel}</span>
        </Link>
      </li>
    );
  }

  // Agregar segmentos de ruta
  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = getLabel(segment, index, segments);

    // No añadir el último segmento como enlace si disableLastCrumb es true
    if (isLast && disableLastCrumb) {
      breadcrumbs.push(
        <li key={segment} className="flex items-center">
          <span
            className={cn(
              "text-indigo-600 font-medium",
              activeClassName
            )}
            aria-current="page"
          >
            {label}
          </span>
        </li>
      );
    } else {
      breadcrumbs.push(
        <li key={segment} className="flex items-center">
          <Link
            href={href}
            className={cn(
              "text-gray-600 hover:text-indigo-600 transition-colors",
              linkClassName,
              isLast && activeClassName
            )}
          >
            {label}
          </Link>
        </li>
      );
    }

    // Agregar separador después de cada elemento excepto el último
    if (!isLast) {
      breadcrumbs.push(
        <li key={`separator-${index}`} className={cn("mx-2 text-gray-400", separatorClassName)}>
          {separator}
        </li>
      );
    }
  });

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex items-center flex-wrap text-sm",
          containerClassName
        )}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {breadcrumbs.map((breadcrumb, index) => {
          // Solo añadir propiedades de schema.org a los elementos de la lista, no a los separadores
          if (index % 2 === 0) {
            return (
              <div
                key={index}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {breadcrumb}
                <meta itemProp="position" content={String(Math.ceil((index + 1) / 2))} />
              </div>
            );
          }
          return breadcrumb;
        })}
      </ol>
    </nav>
  );
} 