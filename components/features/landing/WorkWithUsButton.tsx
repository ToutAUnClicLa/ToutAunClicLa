'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';

export default function WorkWithUsButton() {
  const { t } = useTranslation();
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
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          onClick={handleClick}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center gap-2 group"
          style={{
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
          }}
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.div>
          <span className="font-medium text-[10px] sm:text-xs max-w-[100px] sm:max-w-[130px] leading-tight">
            {t('landing.workWithUs.buttonText')}
          </span>
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-0.5"
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
  );
}