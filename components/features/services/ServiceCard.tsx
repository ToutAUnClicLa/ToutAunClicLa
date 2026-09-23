import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shopChrome } from '@/lib/shop-theme';

interface ServiceCardProps {
    icon?: React.ElementType;
    title: string;
    description: string;
    subServices: string[];
    comingSoonText: string;
    subServicesText: string;
    viewMoreText: string;
    image?: string;
    /** Home landing only. Default stays emerald for `/servicios`. */
    variant?: 'default' | 'pro';
    /** Catalog `/servicios`: keep description + chips on mobile. */
    showMeta?: boolean;
    /** Detail route. Required for working “ver más detalle”. */
    href?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    icon: _Icon,
    title,
    description,
    subServices,
    comingSoonText,
    subServicesText,
    viewMoreText,
    image,
    variant = 'default',
    showMeta = false,
    href,
}) => {
    const isPro = variant === 'pro';
    const hideMetaOnMobile = isPro && !showMeta;
    const ctaClass = isPro
        ? "mt-3 inline-flex min-h-11 w-fit max-w-full items-center gap-1.5 bg-transparent p-0 text-xs font-medium text-[var(--shop-purple)] whitespace-nowrap sm:text-sm"
        : "w-full flex items-center justify-center min-h-11 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 font-medium text-sm group-hover:bg-[#00875A] group-hover:text-white";

    const card = (
        <div className={isPro
            ? "group flex h-full flex-col overflow-hidden rounded-xl border border-[var(--shop-hairline)] bg-white"
            : "group flex flex-col bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 h-full overflow-hidden"
        }>
            <div className={cn(
                "relative w-full overflow-hidden",
                isPro ? "aspect-[16/10]" : "aspect-[16/10] max-h-40",
            )}>
                {image ? (
                    <>
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                            loading={isPro ? 'eager' : undefined}
                        />
                        {!isPro && <div className="absolute inset-0 bg-black/40" />}
                    </>
                ) : (
                    <div className={`absolute inset-0 flex items-center justify-center ${isPro ? 'bg-[var(--svc-wash)]' : 'bg-gray-100 dark:bg-slate-700'}`}>
                        <div className="text-center">
                            <ImageIcon className="w-10 h-10 text-gray-300 dark:text-slate-500 mx-auto mb-2" />
                        </div>
                    </div>
                )}
                {!isPro && comingSoonText && (
                    <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium shadow-sm">
                            {comingSoonText}
                        </span>
                    </div>
                )}
            </div>

            <div className={cn("flex flex-col flex-grow", isPro ? "p-4 sm:p-5" : "p-5")}>
                <h3 className={cn(
                    "mb-1.5 font-semibold tracking-tight sm:mb-2",
                    isPro ? "text-lg leading-snug text-[var(--shop-ink)]" : "text-xl font-bold text-slate-900 dark:text-slate-100",
                    isPro ? "group-hover:text-[var(--shop-purple)]" : "group-hover:text-[#00875A]",
                )}>
                    {title}
                </h3>

                <p className={cn(
                    "mb-4 flex-grow text-sm leading-relaxed",
                    isPro ? "text-[var(--shop-muted)]" : "text-slate-600 dark:text-slate-400",
                    hideMetaOnMobile && "hidden sm:block",
                )}>
                    {description}
                </p>

                <div className={cn(isPro ? "mt-auto" : "mt-auto border-t border-gray-100 dark:border-gray-700 pt-3 sm:pt-4")}>
                    {!isPro && (
                    <p className="mb-3 text-xs font-medium text-gray-500">
                        {subServicesText}
                    </p>
                    )}
                    <div className={cn(
                        "mb-1 flex flex-wrap gap-1.5",
                        isPro ? "sm:mb-2" : "mb-3 sm:mb-4",
                        hideMetaOnMobile && "hidden sm:flex",
                    )}>
                        {subServices.map((sub, idx) => (
                            <span
                                key={idx}
                                className={isPro
                                    ? "rounded-full border border-[var(--shop-hairline)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--shop-muted)]"
                                    : "px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full text-xs text-emerald-700 dark:text-emerald-300 font-medium"
                                }
                            >
                                {sub}
                            </span>
                        ))}
                    </div>

                    {href ? (
                        <span className={ctaClass}>
                            {viewMoreText}
                            {isPro && <ArrowRight className="h-4 w-4" aria-hidden />}
                        </span>
                    ) : (
                        <span className={ctaClass}>
                            {viewMoreText}
                            {isPro && <ArrowRight className="h-4 w-4" aria-hidden />}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    if (!href) return card;

    return (
        <Link
            href={href}
            className={cn('block h-full rounded-xl', shopChrome.focus)}
        >
            {card}
        </Link>
    );
};

export default ServiceCard;
