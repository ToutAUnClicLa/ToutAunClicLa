import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    subServices: string[];
    comingSoonText: string;
    subServicesText: string;
    viewMoreText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    icon: Icon,
    title,
    description,
    subServices,
    comingSoonText,
    subServicesText,
    viewMoreText,
}) => {
    return (
        <div className="group flex flex-col bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
            <div className="flex justify-between items-start mb-5">
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-[#00875A] group-hover:bg-[#00875A] group-hover:text-white transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                </div>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded text-[10px] font-bold uppercase tracking-wide">
                    {comingSoonText}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-[#00875A] transition-colors">
                {title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 flex-grow leading-relaxed">
                {description}
            </p>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-5 mt-auto">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    {subServicesText}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                    {subServices.map((sub, idx) => (
                        <span
                            key={idx}
                            className="px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded text-xs text-gray-600 dark:text-gray-300"
                        >
                            {sub}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex space-x-2 text-xs font-bold text-gray-400">
                        <span className="text-[#00875A]">ES</span>
                        <span>EN</span>
                        <span>FR</span>
                    </div>
                    <button className="text-[#00875A] hover:text-green-700 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {viewMoreText} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
