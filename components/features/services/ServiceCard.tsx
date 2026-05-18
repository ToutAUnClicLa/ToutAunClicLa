import React from 'react';
import Image from 'next/image';
import { ArrowRight, ImageIcon } from 'lucide-react';

interface ServiceCardProps {
    icon?: React.ElementType;
    title: string;
    description: string;
    subServices: string[];
    comingSoonText: string;
    subServicesText: string;
    viewMoreText: string;
    image?: string;
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
}) => {
    return (
        <div className="group flex flex-col bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full overflow-hidden">
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden">
                {image ? (
                    <>
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                        <div className="text-center">
                            <ImageIcon className="w-10 h-10 text-gray-300 dark:text-slate-500 mx-auto mb-2" />
                            <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">
                                Coming soon
                            </span>
                        </div>
                    </div>
                )}
                {/* Coming Soon badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className="px-2.5 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-300 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm">
                        {comingSoonText}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-[#00875A] transition-colors">
                    {title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 flex-grow leading-relaxed">
                    {description}
                </p>

                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                        {subServicesText}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {subServices.map((sub, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-full text-xs text-emerald-700 dark:text-emerald-300 font-medium"
                            >
                                {sub}
                            </span>
                        ))}
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-[#00875A] text-gray-600 dark:text-gray-300 hover:text-white font-medium text-sm transition-all duration-300 group-hover:bg-[#00875A] group-hover:text-white">
                        {viewMoreText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
