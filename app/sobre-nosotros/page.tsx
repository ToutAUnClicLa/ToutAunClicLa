"use client";

import { motion } from 'framer-motion';
import { MapPin, Mail, Facebook, Instagram, Twitter, Linkedin, Heart, Users, ShoppingBag, Globe, Package, Utensils, Store, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function SobreNosotrosPage() {
  const { t } = useTranslation();
  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/toutaunclicla", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Instagram, href: "https://instagram.com/toutaunclicla", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Twitter, href: "https://twitter.com/toutaunclicla", label: "Twitter", color: "hover:text-blue-400" },
  ];

  const founders = [
    { 
      key: 'zenen1',
      name: t('aboutUs.founders.zenen1.name'), 
      role: t('aboutUs.founders.zenen1.role'), 
      description: t('aboutUs.founders.zenen1.description'),
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      key: 'david',
      name: t('aboutUs.founders.david.name'), 
      role: t('aboutUs.founders.david.role'), 
      description: t('aboutUs.founders.david.description'),
      gradient: "from-purple-500 to-pink-500" 
    },
    { 
      key: 'zenen2',
      name: t('aboutUs.founders.zenen2.name'), 
      role: t('aboutUs.founders.zenen2.role'), 
      description: t('aboutUs.founders.zenen2.description'),
      gradient: "from-blue-500 to-indigo-500"
    }
  ];

  const values = [
    { icon: Heart, title: t('aboutUs.values.passion.title'), description: t('aboutUs.values.passion.description'), gradient: "from-indigo-500 to-purple-500" },
    { icon: Users, title: t('aboutUs.values.community.title'), description: t('aboutUs.values.community.description'), gradient: "from-purple-500 to-pink-500" },
    { icon: ShoppingBag, title: t('aboutUs.values.quality.title'), description: t('aboutUs.values.quality.description'), gradient: "from-blue-500 to-indigo-500" },
    { icon: Globe, title: t('aboutUs.values.diversity.title'), description: t('aboutUs.values.diversity.description'), gradient: "from-indigo-500 to-blue-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Clean and focused */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-white backdrop-blur-md border border-white/20">
                <Image 
                  src="/logoaunclic.svg" 
                  alt="ToutAunClicLa Logo" 
                  width={80} 
                  height={80} 
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" 
                />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {t('aboutUs.pageTitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 leading-relaxed max-w-2xl mx-auto">
              {t('aboutUs.pageSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }} 
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t('aboutUs.ourStory.title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                {t('aboutUs.ourStory.description1')}
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('aboutUs.ourStory.description2')}
              </p>
            </motion.div>
            
            {/* Founders Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {founders.map((founder, index) => (
                <motion.div 
                  key={founder.key} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.6, delay: index * 0.15 }} 
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${founder.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 min-h-[56px] flex items-center justify-center">{founder.name}</h3>
                  <p className="text-sm font-semibold text-indigo-600 mb-3 min-h-[48px] flex items-center justify-center">{founder.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed flex-grow flex items-center justify-center">{founder.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }} 
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t('aboutUs.values.title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                {t('aboutUs.values.subtitle')}
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div 
                    key={value.title} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ duration: 0.6, delay: index * 0.1 }} 
                    className="text-center group"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.8 }} 
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('aboutUs.contact.title')}
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                {t('aboutUs.contact.description')}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8 }} 
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('aboutUs.contact.contactInfo')}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{t('aboutUs.contact.addressLabel')}</p>
                      <p className="text-gray-600 text-sm">{t('aboutUs.contact.addressLine1')}</p>
                      <p className="text-gray-600 text-sm">{t('aboutUs.contact.addressLine2')}</p>
                      <p className="text-gray-600 text-sm">{t('aboutUs.contact.addressLine3')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{t('aboutUs.contact.emailLabel')}</p>
                      <a 
                        href="mailto:serviceclient@toutaunclicla.com" 
                        className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium text-sm"
                      >
                        serviceclient@toutaunclicla.com
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.8 }} 
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('aboutUs.contact.followUs')}</h3>
                <p className="text-gray-600 mb-6 text-sm">{t('aboutUs.contact.followDescription')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a 
                        key={social.label} 
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 text-gray-700 transition-all hover:bg-gray-100 ${social.color} hover:scale-105 group`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with three buttons */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              {t('aboutUs.cta.title')}
            </h2>
            <p className="text-indigo-100 mb-8 text-base sm:text-lg max-w-2xl mx-auto">
              {t('aboutUs.cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link href="/productos">
                <motion.button
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Package className="mr-2 h-5 w-5" />
                  {t('aboutUs.cta.browseProducts')}
                </motion.button>
              </Link>
              
              <Link href="/comidas">
                <motion.button
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Utensils className="mr-2 h-5 w-5" />
                  {t('aboutUs.cta.viewFoods')}
                </motion.button>
              </Link>
              
              <Link href="/boutique">
                <motion.button
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Store className="mr-2 h-5 w-5" />
                  {t('aboutUs.cta.visitBoutique')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}