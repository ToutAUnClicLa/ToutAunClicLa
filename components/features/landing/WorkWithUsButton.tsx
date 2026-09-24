'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';

export default function WorkWithUsButton() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el botón después de un pequeño retraso
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open('https://forms.gle/e4WXdTJSr9rMUU1T8', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden md:block">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={handleClick}
            className="pointer-events-auto absolute bottom-6 right-6 flex min-h-11 items-center gap-2 rounded-lg bg-[var(--shop-purple)] px-4 py-2.5 text-white hover:bg-[var(--shop-purple-hover)]"
            style={{ boxShadow: 'none' }}
          >
            <Briefcase className="w-4 h-4" />
            <svg
              className="ml-0.5 h-3.5 w-3.5"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}