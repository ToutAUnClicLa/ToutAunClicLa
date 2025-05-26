"use client";

import { motion } from "framer-motion";
import { ArrowRight, Package, Utensils, Scissors } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CategoryCard } from "@/components/features/modules/catalog/CategoryCard";
import { ProductCard } from "@/components/features/modules/catalog/ProductCard";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface AnimatedSectionsProps {
  sampleProducts: any[];
  subcategories: {
    products: any[];
    food: any[];
    boutique: any[];
  };
}

export function AnimatedSections({ sampleProducts, subcategories }: AnimatedSectionsProps) {
  return (
    <>
      {/* Categories section */}
      <section className="py-16 bg-muted">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Explore our categories
          </motion.h2>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <CategoryCard 
                title="Products"
                description="Everything you need for your home and more"
                href="/products"
                icon={<Package className="h-10 w-10 text-indigo-600" />}
                color="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60"
                textColor="text-indigo-600 dark:text-indigo-400"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard 
                title="Food"
                description="Fresh and delicious food delivered to your door"
                href="/food"
                icon={<Utensils className="h-10 w-10 text-amber-600" />}
                color="bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60"
                textColor="text-amber-600 dark:text-amber-400"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <CategoryCard 
                title="Boutique"
                description="Exclusive fashion and accessories"
                href="/boutique"
                icon={<Scissors className="h-10 w-10 text-purple-600" />}
                color="bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/60"
                textColor="text-purple-600 dark:text-purple-400"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured products section */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-primary flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {sampleProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard 
                  product={product} 
                  categoryName={product.categoria?.nombre || 'productos'} 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product subcategories section */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-950/40">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
              Products
            </h2>
            <Link href="/products" className="text-indigo-600 dark:text-indigo-400 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {subcategories.products.map((subcategory) => (
              <motion.div key={subcategory.id} variants={itemVariants}>
                <Link href={`/products?subcategory=${subcategory.id}`}>
                  <div className="relative rounded-xl overflow-hidden group h-60">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover transform transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{subcategory.name}</h3>
                      <p className="text-sm text-white/80">{subcategory.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Food subcategories section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-950/40">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
              Food
            </h2>
            <Link href="/food" className="text-amber-600 dark:text-amber-400 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {subcategories.food.map((subcategory) => (
              <motion.div key={subcategory.id} variants={itemVariants}>
                <Link href={`/food?subcategory=${subcategory.id}`}>
                  <div className="relative rounded-xl overflow-hidden group h-60">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover transform transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{subcategory.name}</h3>
                      <p className="text-sm text-white/80">{subcategory.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Boutique subcategories section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-100 dark:from-purple-950/20 dark:to-pink-950/40">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              Boutique
            </h2>
            <Link href="/boutique" className="text-purple-600 dark:text-purple-400 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {subcategories.boutique.map((subcategory) => (
              <motion.div key={subcategory.id} variants={itemVariants}>
                <Link href={`/boutique?subcategory=${subcategory.id}`}>
                  <div className="relative rounded-xl overflow-hidden group h-60">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover transform transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{subcategory.name}</h3>
                      <p className="text-sm text-white/80">{subcategory.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}