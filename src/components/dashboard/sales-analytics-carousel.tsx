// File: src/components/dashboard/sales-analytics-carousel.tsx
'use client';

import React, { useState, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ChartData } from '@/lib/placeholder-data';
import { SalesTrendChart } from './SalesTrendChart';
import { RevenueMiniChart } from './RevenueMiniChart';

interface SalesAnalyticsCarouselProps {
    carouselKey: number | string;
    chartData: ChartData[];
}

export function SalesAnalyticsCarousel({ carouselKey, chartData }: SalesAnalyticsCarouselProps) {
  const [isChartInteracting, setIsChartInteracting] = useState(false);
  
  const salesTrendData = chartData.find(d => d.title === 'Sales Trend');
  const revenueData = chartData.find(d => d.title === 'Revenue');

  const handleInteractionStart = useCallback(() => {
    setIsChartInteracting(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsChartInteracting(false);
  }, []);

  return (
    <Carousel
      key={carouselKey}
      opts={{
        align: 'center',
        loop: true,
        watchDrag: () => !isChartInteracting,
      }}
      className="w-full animate-in fade-in-50 duration-700"
    >
      <CarouselContent>
        {salesTrendData && (
          <CarouselItem>
            <Card className="relative w-full h-[250px] bg-background/50 border-white/10 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="flex-shrink-0 px-[15px] pt-[15px] pb-0">
                    <CardTitle className="text-white/90 font-headline">{salesTrendData.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-[10px]">
                    <SalesTrendChart 
                      data={salesTrendData.data}
                      onInteractionStart={handleInteractionStart}
                      onInteractionEnd={handleInteractionEnd}
                    />
                </CardContent>
            </Card>
          </CarouselItem>
        )}
         {revenueData && (
          <CarouselItem>
             <Card className="relative w-full h-[250px] bg-background/50 border-white/10 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                <CardHeader className="flex-shrink-0 px-[15px] pt-[15px] pb-0">
                    <CardTitle className="text-white/90 font-headline">{revenueData.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center p-[10px]">
                    <RevenueMiniChart 
                      data={revenueData.data}
                      onInteractionStart={handleInteractionStart}
                      onInteractionEnd={handleInteractionEnd}
                    />
                </CardContent>
            </Card>
          </CarouselItem>
        )}
      </CarouselContent>
    </Carousel>
  );
}
