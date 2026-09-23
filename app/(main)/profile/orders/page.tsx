"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  MapPin,
  Eye,
  Filter,
  RefreshCcw,
  ChevronRight,
  CheckCircle,
  Truck,
  AlertCircle,
  Clock,
  Search,
} from 'lucide-react';
import { Button } from '@/components/common/ui/button';
import { Badge } from '@/components/common/ui/badge';
import { Input } from '@/components/common/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useOrderStats } from '@/hooks/useOrders';
import { useTranslation } from '@/hooks/useTranslation';
import { Order, getOrderStatusText, getOrderStatusColor, formatOrderDate, canTrackOrder } from '@/lib/services/orders';
import { loginPath } from '@/lib/shop-auth';
import { PROFILE, orderPath } from '@/lib/shop-profile';
import {
  ProfileCard,
  ProfilePageHeader,
  ProfileOrdersSkeleton,
  profileCtaClass,
  profileOutlineClass,
} from '@/components/features/profile/ProfileChrome';
import { shopChrome } from '@/lib/shop-theme';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { orders, loading: ordersLoading, error, refetch, fetchMore, hasMore } = useOrders({
    page,
    limit: 10,
    status: statusFilter || undefined,
  });
  const { stats, loading: statsLoading } = useOrderStats();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(loginPath(PROFILE.orders));
    }
  }, [user, isLoading, router]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.itemsPreview.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [orders, searchTerm]);

  const getStatusIcon = (status: Order['status']) => {
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

  if (isLoading || (ordersLoading && page === 1) || !user) {
    return <ProfileOrdersSkeleton />;
  }

  return (
    <div>
      <ProfilePageHeader
        title={t('profile.sections.orders.title')}
        description={t('profile.sections.orders.description')}
      />

      {stats && !statsLoading ? (
        <ProfileCard className="mb-6 p-4">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-[var(--shop-purple)]" />
            <div>
              <p className="text-lg font-semibold text-[var(--shop-ink)]">{stats.totalOrders}</p>
              <p className="text-xs text-[var(--shop-muted)]">{t('orders.totalOrders')}</p>
            </div>
          </div>
        </ProfileCard>
      ) : null}

      <ProfileCard className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--shop-muted)]" />
            <Input
              placeholder={t('orders.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn('h-11 pl-10', shopChrome.focus)}
            />
          </div>
          <Select value={statusFilter || 'all'} onValueChange={(value) => {
            setStatusFilter(value === 'all' ? '' : value);
            setPage(1);
          }}>
            <SelectTrigger className={cn('h-11 w-full sm:w-48', shopChrome.focus)}>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t('orders.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('orders.allStatuses')}</SelectItem>
              <SelectItem value="pendiente">{t('orders.statuses.pendiente')}</SelectItem>
              <SelectItem value="pagado">{t('orders.statuses.pagado')}</SelectItem>
              <SelectItem value="procesando">{t('orders.statuses.procesando')}</SelectItem>
              <SelectItem value="enviado">{t('orders.statuses.enviado')}</SelectItem>
              <SelectItem value="entregado">{t('orders.statuses.entregado')}</SelectItem>
              <SelectItem value="cancelado">{t('orders.statuses.cancelado')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refetch} disabled={ordersLoading} className={profileOutlineClass()}>
            <RefreshCcw className={cn('mr-2 h-4 w-4', ordersLoading && 'animate-spin')} />
            {t('orders.actions.refresh')}
          </Button>
        </div>
      </ProfileCard>

      <div className="space-y-4">
        {error ? (
          <ProfileCard className="p-6 text-center">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="mb-4 text-sm text-red-700">{error}</p>
            <Button onClick={refetch} variant="outline" className={profileOutlineClass()}>
              {t('orders.actions.retry')}
            </Button>
          </ProfileCard>
        ) : null}

        {!error && filteredOrders.length === 0 && !ordersLoading ? (
          <ProfileCard className="px-5 py-12 text-center sm:px-8">
            <Package className="mx-auto h-10 w-10 text-[var(--shop-muted)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--shop-ink)]">
              {searchTerm ? t('orders.empty.noResults') : t('orders.empty.noOrders')}
            </h3>
            <p className="mt-1 text-sm text-[var(--shop-muted)]">
              {searchTerm ? t('orders.empty.noResultsDescription') : t('orders.empty.noOrdersDescription')}
            </p>
            {!searchTerm ? (
              <Button className={cn('mt-6', profileCtaClass())} onClick={() => router.push('/productos')}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                {t('orders.actions.exploreProducts')}
              </Button>
            ) : null}
          </ProfileCard>
        ) : null}

        {filteredOrders.map((order) => (
          <ProfileCard key={order.id} className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--shop-purple-wash)] text-[var(--shop-purple)]">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <h3 className="font-medium text-[var(--shop-ink)]">{order.orderNumber}</h3>
                  <p className="text-sm text-[var(--shop-muted)]">{formatOrderDate(order.orderDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${getOrderStatusColor(order.status)} border font-medium`}>
                  {getOrderStatusText(order.status)}
                </Badge>
                <div className="text-right">
                  <p className="font-semibold text-[var(--shop-ink)]">${order.total.toFixed(2)} CAD</p>
                  <p className="text-sm text-[var(--shop-muted)]">
                    {order.summary.totalItems} {t('orders.products')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              {order.itemsPreview.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--shop-canvas-muted)]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={48} height={48} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-5 w-5 text-[var(--shop-muted)]" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--shop-ink)]">{item.name}</p>
                    <p className="text-sm text-[var(--shop-muted)]">
                      {t('orders.productQuantity')}: {item.quantity} • ${item.unitPrice.toFixed(2)} CAD
                    </p>
                  </div>
                </div>
              ))}
              {order.itemsPreview.length > 3 ? (
                <p className="text-sm text-[var(--shop-muted)]">
                  +{order.itemsPreview.length - 3} {t('orders.moreProducts')}
                </p>
              ) : null}
            </div>

            <div className="mb-4 rounded-lg bg-[var(--shop-canvas-muted)] p-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--shop-muted)]" />
                <div className="text-sm">
                  <p className="font-medium text-[var(--shop-ink)]">{order.shipping.recipientName}</p>
                  <p className="text-[var(--shop-muted)]">
                    {order.shipping.address}, {order.shipping.city}
                  </p>
                  <p className="text-[var(--shop-muted)]">
                    {order.shipping.state} {order.shipping.postalCode}, {order.shipping.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className={cn('flex-1', profileOutlineClass())}
                onClick={() => router.push(orderPath(String(order.id)))}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('orders.actions.viewDetails')}
              </Button>
              {canTrackOrder(order) ? (
                <Button
                  variant="outline"
                  className={cn('flex-1', profileOutlineClass())}
                  onClick={() => toast.info(t('orders.detail.trackOrder'))}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  {t('orders.actions.trackShipping')}
                </Button>
              ) : null}
            </div>
          </ProfileCard>
        ))}

        {hasMore && !error ? (
          <div className="py-4 text-center">
            <Button
              onClick={() => {
                if (hasMore && !ordersLoading) fetchMore();
              }}
              disabled={ordersLoading}
              variant="outline"
              className={profileOutlineClass()}
            >
              {ordersLoading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  {t('orders.loadingText')}
                </>
              ) : (
                <>
                  {t('orders.actions.loadMore')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>

      <ProfileCard className="mt-8 p-5 sm:p-6">
        <h3 className="mb-4 font-semibold text-[var(--shop-ink)]">{t('orders.quickLinks.title')}</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/productos">
            <Button variant="outline" className={cn('w-full justify-start', profileOutlineClass())}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              {t('orders.actions.continueShopping')}
            </Button>
          </Link>
          <Link href={PROFILE.addresses}>
            <Button variant="outline" className={cn('w-full justify-start', profileOutlineClass())}>
              <MapPin className="mr-2 h-4 w-4" />
              {t('orders.quickLinks.myAddresses')}
            </Button>
          </Link>
          <Link href="/support">
            <Button variant="outline" className={cn('w-full justify-start', profileOutlineClass())}>
              <AlertCircle className="mr-2 h-4 w-4" />
              {t('orders.quickLinks.support')}
            </Button>
          </Link>
        </div>
      </ProfileCard>
    </div>
  );
}
