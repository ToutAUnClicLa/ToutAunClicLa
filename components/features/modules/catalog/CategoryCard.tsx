"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  color: string;
  textColor: string;
  gradient?: string;
  products?: number;
  isActive?: boolean;
}

export function CategoryCard({
  title,
  description,
  href,
  icon,
  color,
  textColor,
  gradient,
  products,
  isActive = false
}: CategoryCardProps) {
  return (
    <Link href={href} className="block h-full">
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "group h-full rounded-xl p-6 transition-all duration-300 relative overflow-hidden",
          color,
          "hover:shadow-xl border border-white/20",
          isActive && "ring-2 ring-blue-500 ring-offset-2"
        )}
      >
        {/* Gradient overlay */}
        {gradient && (
          <div 
            className={cn(
              "absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300",
              gradient
            )}
          />
        )}
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Icon and badge container */}
          <div className="flex items-start justify-between mb-4">
            <div className={cn("transition-transform duration-300 group-hover:scale-110", textColor)}>
              {icon}
            </div>
            
            {products && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium"
              >
                {products} productos
              </motion.div>
            )}
          </div>
          
          {/* Content */}
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-bold group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              {description}
            </p>
          </div>
          
          {/* Action indicator */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-sm font-medium text-white/80"
          >
            <span>Explorar</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{ backgroundClip: 'border-box' }} 
        />
      </motion.div>
    </Link>
  );
}