// File: src/components/dashboard/main-sections-carousel.tsx
'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { SectionCard } from './section-card';
import type { Order, Product, Category } from '@/lib/placeholder-data';

interface MainSectionsCarouselProps {
    carouselKey: number;
    currentData: {
        recentOrders: Order[];
        topProducts: Product[];
        bestCategories: Category[];
    };
}

export function MainSectionsCarousel({ carouselKey, currentData }: MainSectionsCarouselProps) {
    const sectionCards = React.useMemo(
        () => [
          { title: 'Recent Orders', data: currentData.recentOrders, type: 'orders' as const },
          { title: 'Top Products', data: currentData.topProducts, type: 'products' as const },
          { title: 'Best Categories', data: currentData.bestCategories, type: 'categories' as const },
        ],
        [currentData]
      );

  return (
    <Carousel
      key={carouselKey}
      className="w-full animate-in fade-in-50 duration-700"
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {sectionCards.map((section, index) => (
          <CarouselItem key={index}>
            <SectionCard
              title={section.title}
              data={section.data}
              type={section.type}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
