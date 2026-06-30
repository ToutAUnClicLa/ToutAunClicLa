# Tout À Un Clic Là — Pro · Sistema de Diseño

> Guía de diseño para **pro.toutaunclicla.com** (módulo de servicios / tarjetas digitales).
> Estética **startup-clean** (Linear · Vercel · Stripe · shadcn/ui) sobre la identidad verde de la marca.
> Stack: Next.js (App Router) + Tailwind + shadcn/ui + Radix.

---

## 1. Filosofía de marca

**Personalidad:** profesional · confiable · local (Québec) · moderno · premium pero accesible.

**Principios visuales** (derivados de Linear/Vercel/Stripe):
1. **Monocromo + 1 acento.** El 90% de la UI es escala neutra (slate). El verde de marca se reserva para acciones primarias, foco y estados activos. Nunca "arcoíris".
2. **Whitespace = aire, no vacío.** Más espacio del que parece necesario. El ojo descansa y sabe a dónde ir.
3. **Alto contraste, nada turbio.** Texto casi-negro sobre blanco; en dark, casi-blanco sobre casi-negro. Evitar grises a medias para texto principal.
4. **Bordes hairline.** Separadores de 1px a baja opacidad. Borde + sombra sutil para "elevar" sin pesadez.
5. **Movimiento con propósito.** Solo `transform` y `opacity`. Entra suave, nunca abrupto. Respeta `prefers-reduced-motion`.
6. **Contenido primero.** La tipografía y el espaciado hacen el trabajo; los adornos se ganan su lugar.

**Diferencia con el e-commerce:** el e-commerce es colorido y comercial. **Pro es sobrio, premium y enfocado** — como una herramienta profesional, no una tienda.

---

## 2. Color

### 2.1 Acento de marca — Verde "Clic"
Construido alrededor de `#00875A` (el verde de Servicios).

| Token | Hex | Uso |
|---|---|---|
| `green-50` | `#ECFDF5` | fondos sutiles, hover de items |
| `green-100` | `#D1FAE5` | badges suaves |
| `green-500` | `#10B981` | acento en **dark mode** (pop) |
| `green-600` | `#059669` | hover de primario |
| `green-700` | `#00875A` | **PRIMARIO (marca)** |
| `green-900` | `#004D40` | superficies oscuras, hero |
| `green-950` | `#00332A` | gradiente hero (fin) |

### 2.2 Neutros (la base — escala slate)
`#FFFFFF` · `#F8FAFC` (50) · `#F1F5F9` (100) · `#E2E8F0` (200) · `#CBD5E1` (300) · `#94A3B8` (400) · `#64748B` (500) · `#475569` (600) · `#334155` (700) · `#1E293B` (800) · `#0F172A` (900) · `#020617` (950).

### 2.3 Semánticos
- **Éxito:** verde de marca · **Aviso:** `#F59E0B` · **Error:** `#EF4444` · **Info:** `#3B82F6`.
- Tier badges: **Free** gris (`slate-500`), **Pro** verde (`green-700`), **Max** degradado verde→teal con sutil brillo.

### 2.4 Tokens shadcn (CSS variables · pegar en `app/pro/globals` o scope `.pro`)

```css
/* LIGHT */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;       /* slate-900 */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --primary: 160 100% 26%;          /* #00875A */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;  /* slate-500 */
  --accent: 152 76% 96%;            /* green-50 */
  --accent-foreground: 160 100% 20%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 214 32% 91%;            /* slate-200 */
  --input: 214 32% 91%;
  --ring: 160 100% 26%;             /* foco verde */
  --radius: 0.625rem;               /* 10px */
}

/* DARK (el look premium) */
.dark {
  --background: 222 47% 5%;         /* casi-negro slate */
  --foreground: 210 40% 98%;
  --card: 222 47% 7%;
  --card-foreground: 210 40% 98%;
  --popover: 222 47% 6%;
  --popover-foreground: 210 40% 98%;
  --primary: 160 84% 39%;           /* #10B981 brillante para dark */
  --primary-foreground: 222 47% 6%;
  --secondary: 217 33% 14%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217 33% 14%;
  --muted-foreground: 215 20% 65%;
  --accent: 161 60% 12%;
  --accent-foreground: 152 76% 80%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 210 40% 98%;
  --border: 215 28% 17%;
  --input: 215 28% 17%;
  --ring: 160 84% 39%;
}
```

> Regla de contraste: texto principal siempre AA+ (≥ 4.5:1). El verde `#00875A` sobre blanco pasa AA para texto grande; para texto pequeño sobre verde usa blanco.

---

## 3. Tipografía

**Fuente:** **Geist Sans** (la estética Vercel/startup) + **Geist Mono** para números, labels y datos.
En Next.js con `next/font` es trivial y sin FOUT.

```ts
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```

> Alternativa equivalente: **Inter** (sans) + **JetBrains Mono**.

### 3.1 Escala (responsive, mobile-first)

| Rol | Tamaño | Peso | Tracking | Line-height | Uso |
|---|---|---|---|---|---|
| Display | `clamp(2.5rem, 5vw, 3.75rem)` | 600 | -0.03em | 1.05 | Hero de la landing |
| H1 | `2.25rem` (36) | 600 | -0.02em | 1.1 | Título de página |
| H2 | `1.875rem` (30) | 600 | -0.02em | 1.2 | Secciones |
| H3 | `1.5rem` (24) | 600 | -0.01em | 1.3 | Subsecciones |
| H4 | `1.25rem` (20) | 600 | -0.01em | 1.4 | Cards |
| Body-lg | `1.125rem` (18) | 400 | 0 | 1.6 | Intro/lead |
| **Body** | `1rem` (16) | 400 | 0 | 1.6 | Texto base |
| Small | `0.875rem` (14) | 400 | 0 | 1.5 | Secundario |
| Label/Mono | `0.75rem` (12) | 500 | 0.05em (mayúsc.) | 1.4 | Etiquetas, kickers, tier |

**Reglas:**
- Títulos en peso **600** (no 700+) → look limpio, no "pesado".
- Tracking **negativo** en títulos grandes (firma startup); **positivo** en labels mayúsculas mono.
- Ancho de lectura: máximo **65–75 caracteres** (`max-w-prose`) en bloques de texto.
- Números/precios/estadísticas → **Geist Mono** con `tabular-nums`.

---

## 4. Espaciado y layout

### 4.1 Grilla base
**4px** (Tailwind: `1` = 4px). Todo múltiplo de 4. Para ritmo vertical generoso, preferir saltos de **8** (`2`).

### 4.2 Espaciado semántico
- Dentro de componente: `8–16px` (`2`–`4`)
- Entre componentes: `24–32px` (`6`–`8`)
- Entre secciones (landing): `clamp(4rem, 10vw, 8rem)` vertical → **mucho aire**

### 4.3 Contenedor y gutters
```
container: max-width 1200px  (dashboard) / 1280px (landing)
gutters:   px-4 (móvil) · px-6 (sm) · px-8 (lg)
```
- **Dashboard**: layout con sidebar 260px + contenido fluido; en móvil el sidebar colapsa a drawer.
- **Landing/perfil público**: centrado, ancho contenido ~`max-w-5xl`.

### 4.4 Radios (border-radius)
| Elemento | Radio |
|---|---|
| Botón / input | `0.625rem` (10px) |
| Card | `0.875rem` (14px) |
| Card grande / modal | `1rem` (16px) |
| Avatar / pill / badge | `full` |
| Tarjeta digital (hero feature) | `1.25rem` (20px) |

### 4.5 Elevación (sombras — sutiles, baja alpha)
```css
--shadow-sm: 0 1px 2px 0 rgb(2 6 23 / 0.04);
--shadow:    0 1px 3px 0 rgb(2 6 23 / 0.06), 0 1px 2px -1px rgb(2 6 23 / 0.04);
--shadow-md: 0 4px 12px -2px rgb(2 6 23 / 0.08);
--shadow-lg: 0 12px 32px -8px rgb(2 6 23 / 0.12);
```
**Regla clave:** elevar combinando **borde hairline + sombra sutil** (no sombra sola). En dark, la elevación se hace con `border` más claro + fondo de card ligeramente más claro que el background, casi sin sombra.

---

## 5. Movimiento (motion)

### 5.1 Duraciones
- **Micro** (hover, focus): `150ms`
- **Base** (entradas, toggles): `200ms`
- **Suave** (modales, drawers): `300ms`
- **Lenta** (hero, reveal): `400–500ms`

### 5.2 Curvas (easing)
```css
--ease-out:   cubic-bezier(0.16, 1, 0.3, 1);   /* entradas (firma "snappy") */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);    /* transiciones de estado */
--spring:     cubic-bezier(0.34, 1.56, 0.64, 1);/* interacciones con "rebote" sutil */
```

### 5.3 Patrones
- **Aparición de contenido:** `opacity 0→1` + `translateY(8px→0)`, `ease-out`, escalonado (`stagger` 40–60ms) en listas/cards.
- **Hover de card:** `translateY(-2px)` + sombra sube, `150ms`.
- **Botón:** `scale(0.98)` al `:active`.
- **Foco:** ring verde animado `150ms`.
- **Solo `transform`/`opacity`** (nunca `width`/`top`/`height` → causan reflow).
- **Interrumpible:** la animación responde al input, no se "bloquea".
- **Accesibilidad:** envolver en `@media (prefers-reduced-motion: reduce) { * { animation: none; transition: none } }`.

> Librería sugerida: **Framer Motion** para orquestación (stagger, layout, presence) — alineada con la estética Linear.

---

## 6. Componentes (patrones)

Base: **shadcn/ui** (genera el código en tu repo → control total). Personalizar con los tokens de arriba.

- **Botones:** `primary` (verde sólido), `secondary` (borde + fondo neutro), `ghost` (solo texto/hover), `destructive`. Altura 40px (`h-10`), 44px en CTA hero. Icono + texto con `gap-2`.
- **Inputs:** borde hairline, foco = ring verde + borde verde, `h-10`, label arriba en `small` peso 500. Estados de error con texto `destructive` + borde rojo.
- **Cards:** fondo `card`, borde hairline, `rounded-[14px]`, padding `p-6`. Hover sutil solo si es clickable.
- **Badges de tier:** Free (gris suave), Pro (verde suave `green-100`/`green-700`), Max (degradado verde→teal + icono).
- **Tabs / Nav:** indicador activo con subrayado o `bg-accent`; transición `200ms`.
- **Toast:** esquina, `slide + fade`, auto-dismiss, accionable.
- **Skeleton:** shimmer sutil para estados de carga (nunca spinners genéricos en contenido).
- **Tarjeta digital pública** (feature estrella): superficie premium, `rounded-[20px]`, foto circular, nombre en H3, título en label mono, redes como iconos pill, botón "Guardar contacto" primario, QR. Pensada para verse increíble al compartir.

---

## 7. Responsive

**Mobile-first.** Breakpoints Tailwind:
```
sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536
```
- Diseñar primero el móvil (la mayoría de los pros compartirán/editarán desde el teléfono).
- Sidebar del dashboard → **drawer** bajo `lg`.
- Grids: `grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-3`.
- Tipografía fluida con `clamp()` en display/hero.
- Áreas táctiles mínimas **44×44px**.
- Probar en 360px (móvil chico), 768 (tablet), 1280 (desktop).

---

## 8. Identidad de marca — pasos

1. **Sub-marca:** "Tout À Un Clic Là **Pro**" — mismo paraguas, lockup propio. El "Pro" en verde de marca o como badge.
2. **Logo/avatar:** versión monocroma para fondos oscuros; isotipo simple para favicon/app icon del pase.
3. **Voz y tono:** claro, directo, profesional, **francés primero** (Loi 96), con ES/EN. Frases cortas, beneficios concretos ("Ta carte. Un AirDrop. Nouveau client.").
4. **Iconografía:** **lucide** (ya en tu stack), trazo 1.5–2px, consistente.
5. **Imágenes:** fotos reales de profesionales locales, luz natural, sin stock genérico. Tratamiento limpio, esquinas redondeadas.
6. **Fondo de marca:** patrón de **puntos/grid sutil** (estética Vercel) en hero y secciones vacías; degradado verde→teal muy contenido solo en el hero.
7. **Tarjeta digital como hero del producto:** debe sentirse premium, "Apple-like". Es el activo visual que se comparte y vende solo.

---

## 9. Accesibilidad (no negociable)
- Contraste AA en todo el texto; foco visible siempre (ring verde).
- `prefers-reduced-motion` respetado.
- Navegable por teclado (Radix lo da de base).
- Idioma por defecto **fr**, con selector es/en.
- Cumplimiento **Loi 25** (consentimiento) y **Loi 96** (francés).

---

## 10. Checklist de implementación (Día 8+)
- [ ] Instalar shadcn/ui en el scope `/pro` con estos tokens
- [ ] Cargar Geist Sans + Geist Mono vía `next/font`
- [ ] Crear `app/pro/layout.tsx` con la identidad (no heredar estilos del e-commerce)
- [ ] Definir utilidades: `.pro-container`, `.pro-section`, clases de motion
- [ ] Componentes base: Button, Input, Card, Badge (tier), Skeleton, Toast
- [ ] Modo claro/oscuro con los tokens
- [ ] Probar responsive en 360/768/1280 + reduced-motion

---

### Fuentes de referencia
- [shadcn/ui Handbook 2026](https://shadcnspace.com/blog/shadcn-ui-handbook)
- [Four design principles behind Stripe, Linear, and Vercel](https://www.pixeldarts.com/en/post/four-design-principles-behind-stripe-linear-and-vercel)
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)
