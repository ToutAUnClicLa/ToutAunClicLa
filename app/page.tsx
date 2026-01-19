"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calculator, Car, ChevronDown, Gavel, Gift, GlassWater, Globe2, Handshake, Home as HomeIcon, Languages, Package, PiggyBank, Scissors, Shirt, Sparkles, Stethoscope, Store, Truck, Utensils, Watch, TrendingUp, BadgeDollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from '@/hooks/useTranslation';
import AuthModal from '@/components/features/auth/AuthModal';
import HomeSearchBar from '@/components/features/modules/search/HomeSearchBar';
import WorkWithUsButton from '@/components/features/landing/WorkWithUsButton';
import ServiceCard from '@/components/features/services/ServiceCard';

// Types
interface CategoryCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

interface MobileCategoryCardProps {
  icon: React.ElementType;
  title: string;
  gradient: string;
}

interface SectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconColor: string;
  children: React.ReactNode;
  id?: string;
}

// Components
const CategoryCard = ({ icon: Icon, title, description, gradient }: CategoryCardProps) => {
  return (
    <motion.div
      className={`group relative bg-gradient-to-br ${gradient} p-4 sm:p-5 md:p-6 rounded-2xl flex items-center h-20 sm:h-24 md:h-28 border border-white/10 shadow-lg backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 overflow-hidden`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace("/20", "/0")} group-hover:${gradient.replace("/20", "/10")} transition-all duration-300`} />
      <div className="relative z-10 flex items-center w-full">
        <div className="flex-shrink-0 mr-3">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex-grow">
          <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl mb-0.5 drop-shadow-lg"
            style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)" }}>
            {title}
          </h3>
          <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-md line-clamp-2"
            style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.4)" }}>
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const MobileCategoryCard = ({ icon: Icon, title, gradient }: MobileCategoryCardProps) => {
  return (
    <motion.div
      className={`group relative bg-gradient-to-br ${gradient} p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center h-20 sm:h-24 border border-white/10 backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 overflow-hidden`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient.replace("/20", "/0")} group-hover:${gradient.replace("/20", "/10")} transition-all duration-300`} />
      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white mb-2 group-hover:scale-110 transition-transform duration-300" />
      <span className="text-white font-medium text-xs sm:text-sm text-center drop-shadow-lg relative z-10 px-1"
        style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)" }}>
        {title}
      </span>
    </motion.div>
  );
};

const Section = ({ title, description, icon: Icon, color, iconColor, children, id }: SectionProps) => {
  return (
    <section id={id} className={`py-12 sm:py-16 md:py-20 bg-gradient-to-br ${color}`}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${iconColor} mr-2 sm:mr-3`} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          </div>
          <p className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </motion.div>
        {children}
      </div>
    </section>
  );
};

// Main component
export default function Home() {
  const { t } = useTranslation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgotPassword'>('register');

  const openAuthModal = (mode: 'login' | 'register' | 'forgotPassword' = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Función para formatear la descripción del hero con texto destacado
  const formatHeroDescription = () => {
    const description = t('landing.hero.description');

    // Buscar y reemplazar los días de la semana en los diferentes idiomas
    if (description.includes('sábado y domingo')) {
      const parts = description.split('sábado y domingo');
      return (
        <>
          {parts[0]}
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">
            sábado y domingo
          </span>
          {parts[1]}
        </>
      );
    } else if (description.includes('Saturday and Sunday')) {
      const parts = description.split('Saturday and Sunday');
      return (
        <>
          {parts[0]}
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">
            Saturday and Sunday
          </span>
          {parts[1]}
        </>
      );
    } else if (description.includes('samedi et dimanche')) {
      const parts = description.split('samedi et dimanche');
      return (
        <>
          {parts[0]}
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">
            samedi et dimanche
          </span>
          {parts[1]}
        </>
      );
    }

    // Si no encuentra los días, devolver el texto normal
    return description;
  };

  // Función para scroll suave a las secciones considerando el navbar fijo
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Altura del navbar: 64px (h-16) + margen adicional para móviles
      const navbarHeight = window.innerWidth < 768 ? 80 : 64; // Más espacio en móviles
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const categories = [
    {
      icon: Package,
      title: t('landing.categories.products.title'),
      description: t('landing.categories.products.description'),
      gradient: "from-indigo-600/20 to-blue-600/20",
      sectionId: "productos"
    },
    {
      icon: Utensils,
      title: t('landing.categories.foods.title'),
      description: t('landing.categories.foods.description'),
      gradient: "from-amber-500/20 to-orange-500/20",
      sectionId: "comidas"
    },
    {
      icon: Store,
      title: t('landing.categories.boutique.title'),
      description: t('landing.categories.boutique.description'),
      gradient: "from-purple-500/20 to-pink-500/20",
      sectionId: "boutique"
    },
    {
      icon: Sparkles,
      title: t('landing.categories.services.title'),
      description: t('landing.categories.services.description'),
      gradient: "from-emerald-500/20 to-teal-500/20",
      sectionId: "servicios"
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
      subServices: ['services.subservices.notaries', 'services.subservices.migration', 'services.subservices.civil'],
    },
    {
      id: 'health',
      icon: Stethoscope,
      titleKey: 'services.categories.health.title',
      descKey: 'services.categories.health.description',
      subServices: ['services.subservices.dentists', 'services.subservices.psychologists', 'services.subservices.doctors'],
    },
    {
      id: 'accounting',
      icon: Calculator,
      titleKey: 'services.categories.accounting.title',
      descKey: 'services.categories.accounting.description',
      subServices: ['services.subservices.taxes', 'services.subservices.payroll', 'services.subservices.bookkeeping'],
    },
    {
      id: 'finance',
      icon: TrendingUp,
      titleKey: 'services.categories.finance.title',
      descKey: 'services.categories.finance.description',
      subServices: ['services.subservices.insurance', 'services.subservices.investments'],
    },
    {
      id: 'realestate',
      icon: HomeIcon,
      titleKey: 'services.categories.realestate.title',
      descKey: 'services.categories.realestate.description',
      subServices: ['services.subservices.buying', 'services.subservices.renting', 'services.subservices.commercial'],
    },
    {
      id: 'cars',
      icon: Car,
      titleKey: 'services.categories.cars.title',
      descKey: 'services.categories.cars.description',
      subServices: ['services.subservices.dealerships', 'services.subservices.mechanics'],
    },
    {
      id: 'beauty',
      icon: Scissors,
      titleKey: 'services.categories.beauty.title',
      descKey: 'services.categories.beauty.description',
      subServices: ['services.subservices.stylists', 'services.subservices.nails', 'services.subservices.barber'],
    },
    {
      id: 'translation',
      icon: Languages,
      titleKey: 'services.categories.translation.title',
      descKey: 'services.categories.translation.description',
      subServices: ['services.subservices.official', 'services.subservices.interpretation'],
    },
    {
      id: 'money',
      icon: BadgeDollarSign,
      titleKey: 'services.categories.money.title',
      descKey: 'services.categories.money.description',
      subServices: ['services.subservices.remittances', 'services.subservices.exchange'],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px] max-h-[900px] overflow-hidden">
        <div className="relative h-full">
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50"
            style={{ width: "100%", height: "100%", minHeight: "inherit" }}
          >
            <picture className="block w-full h-full">
              <source media="(min-width: 768px)" srcSet="/imagenPrueba.jpeg" />
              <source media="(max-width: 767px)" srcSet="/imagenPrueba.jpeg" />
              <Image
                src="/imagenPrueba.jpeg"
                alt="Hero background"
                fill
                className="object-cover blur-[1px] lg:blur-[2px] filter transition-opacity duration-300 opacity-100"
                priority
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-start mt-20 md:justify-center md:mt-0 px-4 sm:px-6 lg:px-8">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <motion.div
                  className="text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                    <motion.div className="relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                      <div className="flex flex-col items-start">
                        <h1 className="text-6xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight mb-2"
                          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", background: "linear-gradient(to right, #ffffff, #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          Tout À un
                        </h1>
                        <h1 className="text-6xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight relative"
                          style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)", background: "linear-gradient(to right, #ffffff, #ffffff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                          Clic Là
                          <motion.div
                            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "140%" }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                          />
                        </h1>
                      </div>
                    </motion.div>
                  </motion.div>
                  <motion.p
                    className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90  max-w-xl leading-relaxed mt-8 sm:mt-10 md:mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {formatHeroDescription()}
                  </motion.p>

                  {/* Search Bar */}
                  <motion.div
                    className="mt-6 sm:mt-8 md:mt-10 w-full max-w-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <HomeSearchBar />
                  </motion.div>
                </motion.div>

                {/* Desktop Categories */}
                <motion.div className="hidden md:block" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div className="grid grid-cols-1 gap-4 sm:gap-5 max-w-md mx-auto">
                    {categories.map((cat, i) => (
                      <div key={i} onClick={() => scrollToSection(cat.sectionId)} className="cursor-pointer">
                        <CategoryCard key={i} icon={cat.icon} title={cat.title} description={cat.description} gradient={cat.gradient} />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Mobile Categories */}
                <motion.div className="md:hidden w-full  " initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {categories.map((cat, i) => (
                      <div key={i} onClick={() => scrollToSection(cat.sectionId)} className="cursor-pointer">
                        <MobileCategoryCard key={i} icon={cat.icon} title={cat.title} gradient={cat.gradient} />
                      </div>
                    ))}
                  </div>

                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <Section
        id="productos"
        title={t('landing.sections.products.title')}
        description={t('landing.sections.products.description')}
        icon={Package}
        color="from-indigo-50 to-blue-50"
        iconColor="text-indigo-600"
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

      {/* Food Section */}
      <Section
        id="comidas"
        title={t('landing.sections.foods.title')}
        description={t('landing.sections.foods.description')}
        icon={Utensils}
        color="from-amber-50 to-orange-50"
        iconColor="text-amber-600"
      >
        <div className="w-full">
          <motion.div
            className="mb-10 sm:mb-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/comidas">
              <motion.button
                className="inline-flex items-center bg-amber-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('landing.sections.foods.viewAll') as string}
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>
          <Link href="/comidas">
            <motion.div
              className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-64 sm:h-64 md:h-80 w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src="/comidasPanamericanasDesktop.png"
                  alt={panamericanFood.name}
                  fill
                  className="object-cover  transition-transform duration-500 group-hover:scale-110 filter blur-[1.5px]"
                  sizes="100vw"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${panamericanFood.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                <div className="absolute inset-0 flex flex-col justify-center items-center p-6 sm:p-8 text-center">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
                    {panamericanFood.name}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-white mb-6 sm:mb-8 max-w-4xl drop-shadow-lg leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
                    {panamericanFood.description}
                  </p>
                  <div className="inline-flex items-center text-white bg-black/15 px-6 py-3 rounded-lg">
                    <span className="text-base sm:text-lg font-medium drop-shadow-md" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                      {panamericanFood.viewText}
                    </span>
                    <motion.div
                      className="ml-3"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

      </Section>

      {/* Boutique Section */}
      <Section
        id="boutique"
        title={t('landing.sections.boutique.title')}
        description={t('landing.sections.boutique.description')}
        icon={Store}
        color="from-purple-50 to-pink-50"
        iconColor="text-purple-600"
      >
        <motion.div
          className="mb-10 sm:mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/boutique">
            <motion.button
              className="inline-flex items-center bg-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('landing.sections.boutique.viewAll') as string}
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boutiqueCategories.map(category => (
            <Link key={category.id} href={`/boutique?subcategoria=${category.subcategoria_id}`}>
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
                    sizes="(max-width: 768px) 100vw, 33vw"
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

      {/* Services Section */}
      <Section
        id="servicios"
        title={t('landing.sections.services.title')}
        description={t('landing.sections.services.description')}
        icon={Sparkles}
        color="from-emerald-50 via-white to-emerald-50"
        iconColor="text-emerald-600"
      >
        <motion.div
          className="mb-10 sm:mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/servicios">
            <motion.button
              className="inline-flex items-center rounded-full bg-emerald-600 text-white px-6 py-3 text-base sm:text-lg font-semibold shadow-[0_20px_45px_-20px_rgba(16,185,129,1)] hover:-translate-y-0.5 transition-transform"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t('landing.sections.services.viewAll') as string}
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={t(service.titleKey)}
              description={t(service.descKey)}
              subServices={service.subServices.map(key => t(key))}
              comingSoonText={t('services.card.comingSoon')}
              subServicesText={t('services.card.subservices')}
              viewMoreText={t('services.card.viewMore')}
            />
          ))}
        </div>
      </Section>
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />

      {/* Work With Us Floating Button */}
      <WorkWithUsButton />
    </div>
  );
}
