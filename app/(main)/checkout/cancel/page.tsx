'use client'

import { useRouter } from 'next/navigation'
import { XCircleIcon, ShoppingCartIcon, CreditCardIcon } from 'lucide-react'
import { Button } from '@/components/common/ui/button'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/useTranslation'

export default function CancelPage() {
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // Notificar al usuario que el pago fue cancelado
    toast.info(t('checkout.cancel.toastMessage'))
  }, [t])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <XCircleIcon className="mx-auto h-20 w-20 text-red-500 mb-6" />
          <h1 className="text-3xl font-bold text-red-600 mb-2">{t('checkout.cancel.title')}</h1>
          <p className="text-xl text-gray-600">{t('checkout.cancel.subtitle')}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📝 {t('checkout.cancel.whatHappened.title')}
          </h3>
          <div className="space-y-2 text-gray-700">
            {(() => {
              const reasons = t('checkout.cancel.whatHappened.reasons');
              const reasonsArray = Array.isArray(reasons) ? reasons : [reasons];
              return reasonsArray.map((reason: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{String(reason)}</span>
                </div>
              ));
            })()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🚀 {t('checkout.cancel.whatCanYouDo.title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <ShoppingCartIcon className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-semibold mb-1">{t('checkout.cancel.whatCanYouDo.reviewCart.title')}</h4>
              <p className="text-sm text-gray-600">{t('checkout.cancel.whatCanYouDo.reviewCart.description')}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <CreditCardIcon className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-semibold mb-1">{t('checkout.cancel.whatCanYouDo.tryAgain.title')}</h4>
              <p className="text-sm text-gray-600">{t('checkout.cancel.whatCanYouDo.tryAgain.description')}</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="mx-auto h-8 w-8 text-purple-500 mb-2 text-2xl">🛒</div>
              <h4 className="font-semibold mb-1">{t('checkout.cancel.whatCanYouDo.keepShopping.title')}</h4>
              <p className="text-sm text-gray-600">{t('checkout.cancel.whatCanYouDo.keepShopping.description')}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button 
            onClick={() => router.push('/cart')}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            {t('checkout.cancel.buttons.backToCart')}
          </Button>
          <Button 
            onClick={() => router.push('/productos')}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            🛒 {t('checkout.cancel.buttons.continueShopping')}
          </Button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-500 text-lg">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">{t('checkout.cancel.support.title')}</h4>
              <p className="text-sm text-yellow-700 mb-3">
                {t('checkout.cancel.support.description')}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
              >
                <a href="mailto:serviceclient@toutaunclicla.com">{t('checkout.cancel.support.contactButton')}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}