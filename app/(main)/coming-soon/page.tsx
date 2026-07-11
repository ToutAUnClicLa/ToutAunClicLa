'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  Rocket, 
  CheckCircle, 
  Circle,
  Home,
  Bell,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/common/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/ui/card'
import { Badge } from '@/components/common/ui/badge'
import { useTranslation } from '@/hooks/useTranslation'

export default function ComingSoonPage() {
  const router = useRouter()
  const { t } = useTranslation()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const pulseVariants = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  const progressSteps = [
    { key: 'design', icon: CheckCircle, completed: true },
    { key: 'development', icon: Clock, completed: false, active: true },
    { key: 'testing', icon: Circle, completed: false },
    { key: 'launch', icon: Rocket, completed: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <motion.div
        className="relative z-10 container mx-auto px-4 py-6 sm:py-8 lg:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <motion.div 
            className="flex items-center gap-4 mb-6 sm:mb-8"
            variants={itemVariants}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2 hover:bg-white hover:shadow-sm rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <div>
              <h1 className="text-sm text-gray-500 font-medium">
                ToutAunClicLa
              </h1>
            </div>
          </motion.div>

          {/* Main content */}
          <div className="grid lg:grid-cols-1 gap-8 lg:gap-12 items-center">
            {/* Left column - Main message */}
            <div className="space-y-6 sm:space-y-8">
              <motion.div variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                    animate={pulseVariants}
                  >
                    <Sparkles className="h-6 w-6 text-white" />
                  </motion.div>
                  <Badge 
                    className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border-0"
                  >
                    {t('comingSoon.subtitle')}
                  </Badge>
                </div>
                
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {t('comingSoon.title')}
                </h1>
                
                <p className="text-lg sm:text-xl text-indigo-600 font-medium mt-4">
                  {t('comingSoon.mainMessage')}
                </p>
                
                <p className="text-gray-600 text-base sm:text-lg mt-4">
                  {t('comingSoon.description')}
                </p>
              </motion.div>

              {/* Action buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                variants={itemVariants}
              >
                <Button
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  {t('comingSoon.actions.backToHome')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/productos')}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('comingSoon.actions.visitOtherSections')}
                </Button>
              </motion.div>

              {/* Encouragement section */}
              <motion.div 
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6"
                variants={itemVariants}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">
                      {t('comingSoon.encouragement.title')}
                    </h3>
                    <p className="text-green-700 text-sm sm:text-base">
                      {t('comingSoon.encouragement.message')}
                    </p>
                    <p className="text-green-600 text-sm font-medium mt-2">
                      {t('comingSoon.encouragement.thanksForPatience')} 💚
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </motion.div>

      {/* Custom CSS for grid pattern */}
      <style jsx global>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23000000' fill-opacity='0.4'%3e%3ccircle cx='7' cy='7' r='1'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  )
}