"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Package, Utensils, Store, Shirt, Watch, Gift, GlassWater } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from '@/hooks/useTranslation';
import AuthModal from '@/components/features/auth/AuthModal';

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

  // Función para formatear la descripción del hero con fecha destacada
  const formatHeroDescription = () => {
    const description = t('landing.hero.description');
    
    // Buscar y reemplazar las fechas en los diferentes idiomas
    if (description.includes('28 de Agosto')) {
      const parts = description.split('28 de Agosto');
      return (
        <>
          {parts[0]}
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">
            28 de Agosto
          </span>
          {parts[1]}
        </>
      );
    } else if (description.includes('August 28th')) {
      const parts = description.split('August 28th');
      return (
        <>
          {parts[0]}
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">
            August 28th
          </span>
          {parts[1]}
        </>
      );
    } else if (description.includes('28 août')) {
      const parts = description.split('28 août');
      return (
        <>
          {parts[0]}
          <span className="font-bold text-lg sm:text-xl md:text-2xl text-white">
            28 août
          </span>
          {parts[1]}
        </>
      );
    }
    
    // Si no encuentra ninguna fecha, devolver el texto normal
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

  // Obtener regiones de comida de las traducciones
  const foodRegions = t<FoodRegion[]>('landing.foodRegions');

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
              <source media="(min-width: 768px)" srcSet="/fondoEscritorio.jpg" />
              <source media="(max-width: 767px)" srcSet="/fondoMobile.png" />
              <Image
                src="/fondoEscritorio.jpg"
                alt="Hero background"
                fill
                className="object-cover filter blur-[0.5px] transition-opacity duration-300 opacity-100"
                priority
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
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
                    className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 md:mb-10 max-w-xl leading-relaxed mt-8 sm:mt-10 md:mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)", fontFamily: "'Inter', sans-serif" }}
                  >
                    {formatHeroDescription()}
                  </motion.p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="mb-4 sm:mb-6 md:mb-0 hidden md:block">
                    <motion.button
                      className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-xl text-base sm:text-lg md:text-xl font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center space-x-3 overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openAuthModal('register')}
                    >
                      <span className="relative z-10">{t('landing.hero.cta') as string}</span>
                      <motion.div className="relative z-10" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ChevronDown className="h-5 w-5 transform rotate-90" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '0%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </motion.button>
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
                <motion.div className="md:hidden w-full mt-6 sm:mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {categories.map((cat, i) => (
                      <div key={i} onClick={() => scrollToSection(cat.sectionId)} className="cursor-pointer">
                        <MobileCategoryCard key={i} icon={cat.icon} title={cat.title} gradient={cat.gradient} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Botón de registro para móviles - después de las categorías */}
                  <motion.div 
                    className="mt-6 flex justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <motion.button
                      className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-16 py-6 rounded-xl text-base font-medium transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 flex items-center space-x-2 overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openAuthModal('register')}
                    >
                      <span className="relative z-10">{t('landing.hero.cta') as string}</span>
                      <motion.div className="relative z-10" animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ChevronDown className="h-4 w-4 transform rotate-90" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '0%' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </motion.button>
                  </motion.div>
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
        <motion.div
          className="mt-10 sm:mt-16 text-center"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foodRegions.map(region => (
            <Link key={region.id} href={`/comidas?subcategoria=${region.subcategoria_id}`}>
              <motion.div
                className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group h-52 sm:h-56 md:h-80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={region.image}
                    alt={region.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 filter blur-[0.8px]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${region.color} opacity-10 transition-opacity duration-300 group-hover:opacity-20`} />
                  <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
                      {region.name}
                    </h3>
                    <p className="text-sm sm:text-base text-white mb-4 sm:mb-6 max-w-2xl drop-shadow-lg" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
                      {region.description}
                    </p>
                    <div className="inline-flex items-center text-white mt-auto bg-black/15 px-3 py-2 rounded-lg">
                      <span className="text-sm sm:text-base font-medium drop-shadow-md" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                        {region.viewText}
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
        <motion.div
          className="mt-10 sm:mt-16 text-center"
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
        <motion.div
          className="mt-10 sm:mt-16 text-center"
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
      </Section>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authModalMode}
      />
    </div>
  );
}