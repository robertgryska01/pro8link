// File: src/components/dashboard/stat-cards-carousel.tsx
'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { StatCard } from './stat-card';
import type { StatCardData } from '@/lib/placeholder-data';

interface StatCardsCarouselProps {
  carouselKey: number;
  statCardsData: StatCardData[];
  onStatCardClick: (cardTitle: string) => void;
}

export function StatCardsCarousel({
  carouselKey,
  statCardsData,
  onStatCardClick,
}: StatCardsCarouselProps) {
  const sortedStatCards = React.useMemo(() => {
    const order = ['Inventory', 'Listed', 'Sold', 'Return'];
    return [...statCardsData].sort(
      (a, b) => order.indexOf(a.title) - order.indexOf(b.title)
    );
  }, [statCardsData]);

  const startIndex = React.useMemo(() => {
    return sortedStatCards.findIndex(
      (item) => item.title === 'Listed'
    );
  }, [sortedStatCards]);

  return (
    <Carousel
      key={carouselKey}
      opts={{
        align: 'center',
        loop: true,
        startIndex: startIndex >= 0 ? startIndex : 0,
        skipSnaps: false,
        dragFree: false,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-[14px]">
        {sortedStatCards.map((item) => (
          <CarouselItem
            key={item.title}
            className="basis-1/3 pl-[14px] pb-2"
          >
            <StatCard {...item} onClick={() => onStatCardClick(item.title)} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
