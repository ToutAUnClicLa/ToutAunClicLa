"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Package,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCcw,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useOrderDetail } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import {
  OrderDetail,
  getOrderStatusText,
  getOrderStatusColor,
  formatOrderDate,
  getOrderProgress,
} from '@/lib/services/orders';
import { parseOrderNotes } from '@/lib/order-notes';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE, orderPath } from '@/lib/shop-profile';
import {
  ProfileCard,
  ProfilePageHeader,
  ProfileOrderDetailSkeleton,
  profileCtaClass,
  profileOutlineClass,
} from '@/components/features/profile/ProfileChrome';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const NOTE_TITLES: Record<string, string> = {
  'información de entrega': 'orders.detail.noteDelivery',
  'información de cupón': 'orders.detail.noteCoupon',
  'información de envío': 'orders.detail.noteShippingInfo',
};
const NOTE_FIELDS: Record<string, string> = {
  método: 'orders.detail.noteMethod',
  código: 'orders.detail.noteCode',
  tipo: 'orders.detail.noteType',
  'ahorro en envío': 'orders.detail.noteShippingSavings',
  'costo de envío': 'orders.detail.noteShippingCost',
};
const NOTE_VALUES: Record<string, string> = {
  puerta: 'orders.detail.noteDoor',
  'envío gratis': 'orders.detail.noteFreeShipping',
  'envío gratis aplicado por cupón': 'orders.detail.noteFreeShippingCoupon',
};

function localizedNote(raw: string, dict: Record<string, string>, t: (key: string) => string) {
  const key = dict[raw.trim().toLocaleLowerCase('es')];
  if (!key) return raw;
  const next = t(key);
  return next === key ? raw : next;
}

function OrderNotesCard({ notes }: { notes: string }) {
  const { t } = useTranslation();
  const sections = parseOrderNotes(notes);
  return (
    <ProfileCard className="p-5 sm:p-6">
      <h2 className="text-base font-semibold text-[var(--shop-ink)]">{t('orders.detail.notes')}</h2>
      {!sections ? (
        <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--shop-muted)]">{notes}</p>
      ) : (
        <div className="mt-4 space-y-5">
          {sections.map((section) => (
            <div key={section.title || section.lines[0]?.value}>
              {section.title ? (
                <h3 className="text-sm font-semibold text-[var(--shop-ink)]">
                  {localizedNote(section.title, NOTE_TITLES, t)}
                </h3>
              ) : null}
              <dl className="mt-2 space-y-1.5">
                {section.lines.map((line, index) => (
                  <div key={index} className="flex items-baseline justify-between gap-4 text-sm">
                    {line.label ? (
                      <dt className="text-[var(--shop-muted)]">
                        {localizedNote(line.label, NOTE_FIELDS, t)}
                      </dt>
                    ) : null}
                    <dd
                      className={cn(
                        line.label
                          ? 'text-right font-medium text-[var(--shop-ink)]'
                          : 'text-[var(--shop-muted)]'
                      )}
                    >
                      {localizedNote(line.value, NOTE_VALUES, t)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </ProfileCard>
  );
}

interface OrderDetailPageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const orderId = parseInt(params.id, 10);
  const { order, loading, error, refetch } = useOrderDetail({
    orderId: isNaN(orderId) ? null : orderId,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(loginPath(orderPath(params.id)));
    }
  }, [user, authLoading, router, params.id]);

  useEffect(() => {
    if (isNaN(orderId)) {
      toast.error(t('orders.detail.invalidId'));
      router.push(PROFILE.orders);
    }
  }, [orderId, router, t]);

  const getStatusIcon = (status: OrderDetail['status']) => {
    const iconMap = {
      pendiente: Clock,
      pagado: CheckCircle,
      procesando: RefreshCcw,
      enviado: Truck,
      entregado: Package,
      cancelado: AlertCircle,
      reembolsado: RefreshCcw,
      parcialmente_reembolsado: AlertCircle,
    };
    const IconComponent = iconMap[status] || Package;
    return <IconComponent className="h-4 w-4" />;
  };

  if (authLoading || loading) {
    return <ProfileOrderDetailSkeleton />;
  }

  if (error) {
    return (
      <ProfileCard className="p-6 text-center">
        <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <h2 className="text-lg font-semibold text-[var(--shop-ink)]">{t('orders.detail.loadError')}</h2>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">{error}</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={refetch} variant="outline" className={profileOutlineClass()}>
            {t('orders.actions.retry')}
          </Button>
          <Button onClick={() => router.push(PROFILE.orders)} className={profileCtaClass()}>
            {t('orders.detail.backToOrders')}
          </Button>
        </div>
      </ProfileCard>
    );
  }

  if (!order) {
    return (
      <ProfileCard className="p-6 text-center">
        <Package className="mx-auto mb-3 h-8 w-8 text-[var(--shop-muted)]" />
        <h2 className="text-lg font-semibold text-[var(--shop-ink)]">{t('orders.detail.notFound')}</h2>
        <p className="mt-1 text-sm text-[var(--shop-muted)]">{t('orders.detail.notFoundDesc')}</p>
        <Button className={cn('mt-4', profileCtaClass())} onClick={() => router.push(PROFILE.orders)}>
          {t('orders.detail.backToOrders')}
        </Button>
      </ProfileCard>
    );
  }

  const progress = order.tracking ? getOrderProgress(order.tracking) : 0;

  return (
    <div>
      <ProfilePageHeader
        title={order.orderNumber}
        description={t('orders.detail.placedOn', { date: formatOrderDate(order.orderDate) })}
        action={
          <Badge className={`${getOrderStatusColor(order.status)} border font-medium`}>
            <span className="mr-1 inline-flex">{getStatusIcon(order.status)}</span>
            {getOrderStatusText(order.status)}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProfileCard className="p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
              <Package className="h-4 w-4 text-[var(--shop-purple)]" />
              {t('orders.detail.products', { count: order.summary.productCount })}
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-lg bg-[var(--shop-canvas-muted)] p-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-6 w-6 text-[var(--shop-muted)]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-[var(--shop-ink)]">{item.name}</h4>
                    {item.description ? (
                      <p className="mt-0.5 text-sm text-[var(--shop-muted)]">{item.description}</p>
                    ) : null}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-[var(--shop-muted)]">
                        {t('orders.detail.quantity')}: {item.quantity} · {t('orders.detail.unitPrice')}: $
                        {item.unitPrice.toFixed(2)} CAD
                      </span>
                      <span className="font-semibold text-[var(--shop-ink)]">
                        ${item.totalPrice.toFixed(2)} CAD
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProfileCard>

          <ProfileCard className="p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
              <MapPin className="h-4 w-4 text-[var(--shop-purple)]" />
              {t('orders.detail.shippingAddress')}
            </h2>
            <div className="rounded-lg bg-[var(--shop-canvas-muted)] p-4 text-sm">
              <p className="font-medium text-[var(--shop-ink)]">{order.shipping.recipientName}</p>
              <p className="text-[var(--shop-muted)]">{order.shipping.address}</p>
              <p className="text-[var(--shop-muted)]">
                {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
              </p>
              <p className="text-[var(--shop-muted)]">{order.shipping.country}</p>
              {order.shipping.phone ? (
                <p className="mt-2 text-[var(--shop-muted)]">
                  {t('orders.detail.phone')}: {order.shipping.phone}
                </p>
              ) : null}
            </div>
          </ProfileCard>

          {order.tracking ? (
            <ProfileCard className="p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
                <Truck className="h-4 w-4 text-[var(--shop-purple)]" />
                {t('orders.detail.shippingStatus')}
              </h2>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-[var(--shop-muted)]">{t('orders.detail.progress')}</span>
                <span className="font-medium text-[var(--shop-ink)]">{progress.toFixed(0)}%</span>
              </div>
              <div className="mb-4 h-2 w-full rounded-full bg-[var(--shop-canvas-muted)]">
                <div
                  className="h-2 rounded-full bg-[var(--shop-purple)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="space-y-3">
                {(
                  [
                    { key: 'orderPlaced', label: t('orders.detail.stages.orderPlaced'), icon: CheckCircle },
                    { key: 'paymentConfirmed', label: t('orders.detail.stages.paymentConfirmed'), icon: CreditCard },
                    { key: 'processing', label: t('orders.detail.stages.processing'), icon: RefreshCcw },
                    { key: 'shipped', label: t('orders.detail.stages.shipped'), icon: Truck },
                    { key: 'delivered', label: t('orders.detail.stages.delivered'), icon: Package },
                  ] as const
                ).map((stage) => {
                  const isCompleted = !!order.tracking?.[stage.key as keyof typeof order.tracking];
                  const Icon = stage.icon;
                  return (
                    <div key={stage.key} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'rounded-full p-2',
                          isCompleted
                            ? 'bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]'
                            : 'bg-[var(--shop-canvas-muted)] text-[var(--shop-muted)]'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={cn(
                          isCompleted ? 'font-medium text-[var(--shop-ink)]' : 'text-[var(--shop-muted)]'
                        )}
                      >
                        {stage.label}
                      </span>
                      {isCompleted && order.tracking?.[stage.key as keyof typeof order.tracking] ? (
                        <span className="ml-auto text-sm text-[var(--shop-muted)]">
                          {formatOrderDate(order.tracking[stage.key as keyof typeof order.tracking] as string)}
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </ProfileCard>
          ) : null}
        </div>

        <div className="space-y-6">
          <ProfileCard className="p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-[var(--shop-ink)]">
              <CreditCard className="h-4 w-4 text-[var(--shop-purple)]" />
              {t('orders.detail.summary')}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--shop-muted)]">{t('orders.detail.subtotal')}</span>
                <span>${order.pricing.subtotal.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--shop-muted)]">TPS</span>
                <span>${order.pricing.taxes.tps.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--shop-muted)]">TVQ</span>
                <span>${order.pricing.taxes.tvq.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--shop-muted)]">{t('orders.detail.shipping')}</span>
                <span>${order.pricing.shipping.toFixed(2)} CAD</span>
              </div>
              {order.pricing.discount > 0 ? (
                <div className="flex justify-between text-green-700">
                  <span>
                    {t('orders.detail.discount')}
                    {order.pricing.couponCode ? ` (${order.pricing.couponCode})` : ''}
                  </span>
                  <span>-${order.pricing.discount.toFixed(2)} CAD</span>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-[var(--shop-hairline)] pt-2 text-base font-semibold">
                <span>{t('orders.detail.total')}</span>
                <span>${order.pricing.finalTotal.toFixed(2)} CAD</span>
              </div>
            </div>
          </ProfileCard>

          <ProfileCard className="p-5 sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-[var(--shop-ink)]">
              {t('orders.detail.actionsTitle')}
            </h2>
            <Button
              onClick={() => router.push('/support')}
              className={cn('w-full', profileOutlineClass())}
              variant="outline"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {t('orders.detail.contactSupport')}
            </Button>
          </ProfileCard>

          {order.notes ? <OrderNotesCard notes={order.notes} /> : null}
        </div>
      </div>
    </div>
  );
}
