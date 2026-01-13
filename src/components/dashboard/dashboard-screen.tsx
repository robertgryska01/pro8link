// File: src/components/dashboard/dashboard-screen.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  dashboardData,
  productAlertsData,
  type StatCardData,
  type ChartData,
  type Order,
  type Product,
  type Category,
} from '@/lib/placeholder-data';
import { StatCardsCarousel } from './stat-cards-carousel';
import { SalesAnalyticsCarousel } from './sales-analytics-carousel';
import { ProductAlertsSection } from './product-alerts-section';
import { MainSectionsCarousel } from './main-sections-carousel';
import { TimeRangeSelector } from './time-range-selector';

type DashboardData = {
  statCardsData: StatCardData[];
  chartData: ChartData[];
  recentOrders: Order[];
  topProducts: Product[];
  bestCategories: Category[];
};

interface DashboardScreenProps {
    onScroll: (scrollY: number, top: number) => void;
    onStatCardClick: (cardTitle: string) => void;
}

export function DashboardScreen({ onScroll, onStatCardClick }: DashboardScreenProps) {
  const [timeRange, setTimeRange] = useState('Today');
  const [isClient, setIsClient] = useState(false);

  const statCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Static data for StatCardsCarousel, independent of timeRange
  const staticStatCardsData = useMemo(() => {
    if (!isClient) return [];
    return dashboardData['Today']?.statCardsData || [];
  }, [isClient]);

  const currentData = useMemo(() => {
    if (!isClient) {
      return {
        statCardsData: [], // This won't be used for StatCardsCarousel anymore
        chartData: [],
        recentOrders: [],
        topProducts: [],
        bestCategories: [],
      };
    }
    return dashboardData[timeRange] || dashboardData['Today'];
  }, [timeRange, isClient]);

  useEffect(() => {
    const handleScroll = () => {
      if (!statCardRef.current) return;
      const scrollY = window.scrollY;
      const elementTop = statCardRef.current.offsetTop - 64; // Adjust for header height
      onScroll(scrollY, elementTop);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScroll, isClient]);

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  const carouselKey = useMemo(() => timeRange + isClient, [timeRange, isClient]);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <main className="relative z-10 pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section ref={statCardRef} id="stat-card-section" className="animate-in fade-in duration-700">
            <StatCardsCarousel 
                carouselKey={Date.now()}
                statCardsData={staticStatCardsData}
                onStatCardClick={onStatCardClick}
            />
        </section>
        <section>
          <div className="flex justify-between items-center mb-4">
              <TimeRangeSelector onValueChange={handleTimeRangeChange} />
              <TimeRangeSelector 
                onValueChange={() => {}} 
                options={['All Sales', 'Promoted Sales', 'Offer Sales']}
                defaultOption="All Sales"
                placeholder="Select sale type"
              />
          </div>
            <SalesAnalyticsCarousel
                carouselKey={carouselKey}
                chartData={currentData.chartData}
            />
        </section>
        <section>
            <ProductAlertsSection alerts={productAlertsData} />
        </section>
        <section>
            <MainSectionsCarousel
                carouselKey={carouselKey}
                currentData={currentData}
            />
        </section>
      </div>
    </main>
  );
}
