'use client';

import { MessageCircle } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/common/ui/carousel';
import { useTranslation } from '@/hooks/useTranslation';

type Testimonial = {
  quote: string;
  name: string;
  place: string;
  kind: string;
};

export default function HomeTestimonials() {
  const { t } = useTranslation();
  const items = t<Testimonial[]>('landing.testimonials');
  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section id="testimonios" className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center justify-center mb-4">
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 mr-2 sm:mr-3" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {t('landing.sections.testimonials.title')}
            </h2>
          </div>
          <p className="mt-3 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('landing.sections.testimonials.description')}
          </p>
        </div>
        <Carousel opts={{ align: 'start', loop: true }} className="w-full px-8 sm:px-12">
          <CarouselContent>
            {items.map((item) => (
              <CarouselItem key={`${item.name}-${item.kind}`} className="md:basis-1/2 lg:basis-1/3">
                <blockquote className="h-full rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 shadow-sm flex flex-col">
                  <p className="text-sm font-medium text-indigo-600 mb-3">{item.kind}</p>
                  <p className="text-gray-800 leading-relaxed flex-1">“{item.quote}”</p>
                  <footer className="mt-4 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                    <span className="mx-1">·</span>
                    {item.place}
                  </footer>
                </blockquote>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
}
