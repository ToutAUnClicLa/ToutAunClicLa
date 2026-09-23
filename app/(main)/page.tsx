"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeDollarSign, Calculator, Car, Gavel, Gift, GlassWater, Home as HomeIcon, Languages, Package, Scissors, Shirt, Sparkles, Stethoscope, Store, TrendingUp, Utensils, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslation } from '@/hooks/useTranslation';
import { loginPath } from '@/lib/shop-auth';
import HomeSearchBar from '@/components/features/modules/search/HomeSearchBar';
import WorkWithUsButton from '@/components/features/landing/WorkWithUsButton';
import ServiceCard from '@/components/features/services/ServiceCard';
import { shopBanner, shopChrome, shopCss, shopSection, SHOP_HEADER_PX, type ShopSectionTone } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';

interface SectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  tone: ShopSectionTone;
  children: React.ReactNode;
  id?: string;
  kicker?: string;
  cta?: React.ReactNode;
}

const Section = ({ title, description, icon: Icon, tone, children, id, kicker, cta }: SectionProps) => {
  const theme = shopSection[tone];
  return (
    <section id={id} data-shop-reveal className={`scroll-mt-[5rem] border-t border-[var(--shop-hairline)] bg-white py-20 sm:py-24 lg:py-28 ${theme.wash}`}>
      <div className="container">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${theme.tile}`}>
                <Icon className={`h-4 w-4 ${theme.icon}`} />
              </span>
              {kicker && (
                <span className="rounded-full border border-[var(--shop-hairline)] px-2.5 py-0.5 text-xs font-medium text-[var(--shop-purple)]">
                  {kicker}
                </span>
              )}
            </div>
            <h2 className="text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--shop-ink)] sm:text-4xl lg:text-[2.5rem]">
              {title}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--shop-muted)] sm:text-lg">
              {description}
            </p>
          </div>
          {cta}
        </div>
        {children}
      </div>
    </section>
  );
};

// Main component
export default function Home() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const auth = params.get('auth');
    const redirectTo = params.get('redirectTo');
    if (auth === 'forgot') {
      window.location.replace('/forgot-password');
      return;
    }
    if (auth === 'reset') {
      window.location.replace('/reset-password');
      return;
    }
    if (auth === 'login' || redirectTo) {
      window.location.replace(loginPath(redirectTo || '/'));
    }
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nodes = document.querySelectorAll<HTMLElement>('[data-shop-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top >= window.innerHeight * 0.85) {
        node.classList.add('shop-pending');
      }
      io.observe(node);
    });
    return () => io.disconnect();
  }, []);

  // Función para scroll suave a las secciones considerando el navbar fijo
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - SHOP_HEADER_PX - 12;
      window.scrollTo({
        top: y,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
  };

  const categories = [
    // Sección de productos ocultada temporalmente (conservar para reactivar)
    // {
    //   icon: Package,
    //   title: t('landing.categories.products.title'),
    //   description: t('landing.categories.products.description'),
    //   gradient: "from-indigo-600/20 to-blue-600/20",
    //   sectionId: "productos"
    // },
    {
      icon: Utensils,
      title: t('landing.categories.foods.title'),
      description: t('landing.categories.foods.description'),
      tone: "food" as const,
      sectionId: "comidas"
    },
    {
      icon: Sparkles,
      title: t('landing.categories.services.title'),
      description: t('landing.categories.services.description'),
      tone: "svc" as const,
      sectionId: "servicios"
    },
    {
      icon: Store,
      title: t('landing.categories.boutique.title'),
      description: t('landing.categories.boutique.description'),
      tone: "souv" as const,
      sectionId: "boutique"
    }
  ];

  // Definir interfaces para nuestras categorías
  interface ProductCategory {
    id: number;
    name: string;
    description: string;
    image: string;
    color: string;
    viewText: string;
    subcategoria_id: string;
    icon?: React.ReactNode;
  }

  interface FoodRegion {
    id: number;
    name: string;
    description: string;
    image: string;
    color: string;
    viewText: string;
    subcategoria_id: string;
  }

  interface BoutiqueCategory {
    id: number;
    name: string;
    description: string;
    image: string;
    color: string;
    viewText: string;
    subcategoria_id: string;
    icon?: React.ReactNode;
  }

  interface PanamericanFood {
    id: number;
    name: string;
    description: string;
    image: string;
    color: string;
    viewText: string;
  }


  // Obtener categorías de productos de las traducciones
  const productCategories = t<ProductCategory[]>('landing.productCategories').map(category => {
    let icon;
    switch (category.subcategoria_id) {
      case 'harinas-masas':
        icon = <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      case 'salsas-aderezos':
        icon = <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      case 'paquetes-snacks':
        icon = <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      case 'bebidas':
        icon = <GlassWater className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      default:
        icon = <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
    }
    return { ...category, icon };
  });

  // Obtener banner de comida panamericana de las traducciones
  const panamericanFood = t<PanamericanFood>('landing.panamericanFood');

  // Obtener categorías de boutique de las traducciones
  const boutiqueCategories = t<BoutiqueCategory[]>('landing.boutiqueCategories').map(category => {
    let icon;
    switch (category.subcategoria_id) {
      case 'ropa-accesorios':
        icon = <Shirt className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      case 'accesorios-decorativos':
        icon = <Store className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      case 'souvenirs':
        icon = <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
        break;
      default:
        icon = <Store className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }} />;
    }
    return { ...category, icon };
  });

  // Services definition consistent with Services Page
  const services = [
    {
      id: 'lawyers',
      icon: Gavel,
      titleKey: 'services.categories.lawyers.title',
      descKey: 'services.categories.lawyers.description',
      subServices: ['services.subservices.lawyers', 'services.subservices.notaries', 'services.subservices.migration', 'services.subservices.civil'],
      image: '/services/lawyers.png',
    },
    {
      id: 'health',
      icon: Stethoscope,
      titleKey: 'services.categories.health.title',
      descKey: 'services.categories.health.description',
      subServices: ['services.subservices.dentists', 'services.subservices.psychologists', 'services.subservices.doctors'],
      image: '/services/health.png',
    },
    {
      id: 'accounting',
      icon: Calculator,
      titleKey: 'services.categories.accounting.title',
      descKey: 'services.categories.accounting.description',
      subServices: ['services.subservices.taxes', 'services.subservices.payroll', 'services.subservices.bookkeeping'],
      image: '/services/accounting.png',
    },
    {
      id: 'finance',
      icon: TrendingUp,
      titleKey: 'services.categories.finance.title',
      descKey: 'services.categories.finance.description',
      subServices: ['services.subservices.insurance', 'services.subservices.investments'],
      image: '/services/finance.png',
    },
    {
      id: 'realestate',
      icon: HomeIcon,
      titleKey: 'services.categories.realestate.title',
      descKey: 'services.categories.realestate.description',
      subServices: ['services.subservices.buying', 'services.subservices.renting', 'services.subservices.commercial'],
      image: '/services/home-services.png',
    },
    {
      id: 'cars',
      icon: Car,
      titleKey: 'services.categories.cars.title',
      descKey: 'services.categories.cars.description',
      subServices: ['services.subservices.dealerships', 'services.subservices.mechanics'],
      image: '/services/cars.png',
    },
    {
      id: 'beauty',
      icon: Scissors,
      titleKey: 'services.categories.beauty.title',
      descKey: 'services.categories.beauty.description',
      subServices: ['services.subservices.stylists', 'services.subservices.nails', 'services.subservices.barber'],
      image: '/services/beauty.png',
    },
    {
      id: 'translation',
      icon: Languages,
      titleKey: 'services.categories.translation.title',
      descKey: 'services.categories.translation.description',
      subServices: ['services.subservices.official', 'services.subservices.interpretation'],
      image: '/services/translation.png',
    },
    {
      id: 'money',
      icon: BadgeDollarSign,
      titleKey: 'services.categories.money.title',
      descKey: 'services.categories.money.description',
      subServices: ['services.subservices.remittances', 'services.subservices.exchange'],
      image: '/services/money.png',
    },
    {
      id: 'maintenance',
      icon: Wrench,
      titleKey: 'services.categories.maintenance.title',
      descKey: 'services.categories.maintenance.description',
      subServices: ['services.subservices.electricians', 'services.subservices.plumbers', 'services.subservices.painters', 'services.subservices.carpenters', 'services.subservices.locksmiths'],
      image: '/services/maintenance.png',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section data-shop-reveal className="relative isolate overflow-hidden">
        <Image
          src="/landing/hero/heroImg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[var(--shop-ink)]/75" aria-hidden />
        <div className="container relative pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-28 lg:pt-20">
          <motion.div
            className="shop-hero-motion max-w-2xl text-left"
            initial={reduceMotion ? false : { opacity: 1, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: 'easeOut' }}
          >
            <h1 className="max-w-[11ch] text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.5rem]">
              Tout à un Clic Là
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white sm:text-lg">
              {t('landing.hero.description')}
            </p>
            <div className="mt-8 w-full max-w-xl">
              <HomeSearchBar />
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    type="button"
                    key={cat.sectionId}
                    onClick={() => scrollToSection(cat.sectionId)}
                    className={cn(shopChrome.aisleChip, shopChrome.focus)}
                  >
                    <Icon className="h-4 w-4 text-[var(--shop-purple)]" />
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products Section — ocultada temporalmente (cambiar false -> true para reactivar) */}
      {false && (
      <Section
        id="productos"
        title={t('landing.sections.products.title')}
        description={t('landing.sections.products.description')}
        icon={Package}
        tone="food"
      >
        <motion.div
          className="mb-10 sm:mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/productos">
            <motion.button
              className="inline-flex items-center bg-indigo-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('landing.sections.products.viewAll') as string}
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productCategories.map(category => (
            <Link key={category.id} href={`/productos?subcategoria=${category.subcategoria_id}`}>
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-52 sm:h-56 md:h-80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 filter blur-[0.8px]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                  <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                    <div className="flex items-center mb-3 sm:mb-4">
                      {category.icon}
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white ml-3 sm:ml-4 drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg">
                      <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                        {category.viewText}
                      </span>
                      <motion.div
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </Section>
      )}

      {/* Food Section */}
      <Section
        id="comidas"
        title={t('landing.sections.foods.title')}
        description={t('landing.sections.foods.description')}
        icon={Utensils}
        tone="food"
        cta={
          <Link
            href="/comidas"
            className={shopChrome.aisleCta}
            style={{ backgroundColor: shopCss.foodAccent }}
          >
            {t('landing.sections.foods.viewAll') as string}
          </Link>
        }
      >
        <Link href="/comidas" className={cn('shop-press block rounded-xl', shopChrome.focus)}>
          <div className={shopBanner}>
            <Image
              src="/landing/comidas/ComidasImg.webp"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
              loading="lazy"
            />
            <div
              className="shop-food-scrim pointer-events-none absolute inset-0"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-3xl">
                {panamericanFood.name}
              </h3>
              <p className="mt-2 max-w-2xl line-clamp-2 text-sm leading-relaxed text-white sm:text-base">
                {panamericanFood.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                {panamericanFood.viewText}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </div>
        </Link>
      </Section>

      {/* Services Section */}
      <Section
        id="servicios"
        title={t('landing.sections.services.title')}
        description={t('landing.sections.services.description')}
        icon={Sparkles}
        tone="svc"
        kicker="Pro"
        cta={
          <Link
            href="/servicios"
            className={shopChrome.aisleCta}
            style={{ backgroundColor: shopCss.svcPrimary }}
          >
            {t('landing.sections.services.viewAll') as string}
          </Link>
        }
      >
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <div key={service.id} className="shop-press h-full">
              <ServiceCard
                icon={service.icon}
                title={t(service.titleKey)}
                description={t(service.descKey)}
                subServices={service.subServices.map(key => t(key))}
                comingSoonText={t('services.card.comingSoon')}
                subServicesText={t('services.card.subservices')}
                viewMoreText={t('services.card.viewMore')}
                image={service.image}
                variant="pro"
                href={`/servicios/${service.id}`}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Boutique Section */}
      <Section
        id="boutique"
        title={t('landing.sections.boutique.title')}
        description={t('landing.sections.boutique.description')}
        icon={Store}
        tone="souv"
        cta={
          <Link
            href="/boutique"
            className={shopChrome.aisleCta}
            style={{ backgroundColor: shopCss.svcPrimary }}
          >
            {t('landing.sections.boutique.viewAll') as string}
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {boutiqueCategories.map(category => (
            <Link
              key={category.id}
              href={`/boutique?subcategoria=${category.subcategoria_id}`}
              className={cn('shop-press group block h-full rounded-xl', shopChrome.focus)}
            >
              <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--shop-hairline)] bg-white">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--shop-canvas-muted)]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--shop-ink)]">
                    {category.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--shop-muted)]">
                    {category.description}
                  </p>
                  <span className="mt-4 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-medium text-[var(--shop-purple)]">
                    {category.viewText}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </Section>

      {/* Work With Us Floating Button */}
      <WorkWithUsButton />
    </div>
  );
}
