// File: src/components/dashboard/product-alerts-card.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ProductAlert } from '@/lib/placeholder-data';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BellRing,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';

interface ProductAlertsCardProps {
  alerts: ProductAlert[];
}

function InternalVerticalList({ alerts }: { alerts: ProductAlert[] }) {
  return (
    <ScrollArea className="h-full">
      <ul className="flex flex-col h-full">
        {[...alerts, ...alerts].map((alert, index) => (
          <li
            key={`${alert.id}-${index}`}
            className="flex items-start gap-4 p-2 min-h-0 flex-shrink-0"
          >
            <div className="flex-grow overflow-hidden">
              <p className="font-semibold text-sm text-white/80 truncate">
                {alert.title}
              </p>
              <p className="text-xs text-white/60 truncate">{alert.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}


export function ProductAlertsCard({ alerts }: ProductAlertsCardProps) {
  const alertTabs = [
    {
      id: '1-alert-card',
      title: 'Alerts',
      alerts: alerts.slice(0, 5),
      icon: AlertTriangle,
      glowClass: 'shadow-glow-return',
    },
    {
      id: '2-alert-card',
      title: 'Warnings',
      alerts: alerts.slice(1, 6),
      icon: ShieldAlert,
      glowClass: 'shadow-glow-active'
    },
    {
      id: '3-alert-card',
      title: 'Reminders',
      alerts: alerts.slice(2, 7),
      icon: BellRing,
      glowClass: 'shadow-glow-ended'
    },
    {
      id: '4-alert-card',
      title: 'Messages',
      alerts: alerts.slice(0, 5),
      icon: MessageSquare,
      glowClass: 'shadow-glow-inventory'
    },
  ];

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeTab, setActiveTab] = useState(alertTabs[0].id);

  const handleTabClick = useCallback((tabId: string) => {
    setActiveTab(tabId);
    const index = alertTabs.findIndex(tab => tab.id === tabId);
    if (carouselApi && index !== -1) {
      carouselApi.scrollTo(index);
    }
  }, [carouselApi, alertTabs]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = carouselApi.selectedScrollSnap();
      const newActiveTab = alertTabs[selectedIndex]?.id;
      if (newActiveTab) {
        setActiveTab(newActiveTab);
      }
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, alertTabs]);

  return (
    <div className="w-full animate-in fade-in-50 duration-700">
      <Tabs value={activeTab} onValueChange={handleTabClick}>
        <TabsList className="grid w-full grid-cols-4 gap-[6px] bg-transparent p-0 mb-4">
          {alertTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'relative w-full h-12 p-2 flex flex-col items-center justify-center',
                  'bg-white/5 border border-white/10 backdrop-blur-md rounded-xl',
                  'transition-all duration-150 ease-out active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                  'data-[state=active]:bg-white/10 data-[state=active]:border-white/20',
                  isActive ? 'opacity-100' : 'opacity-70',
                  tab.glowClass,
                  'm-0'
                )}
              >
                <span className={cn('relative z-10 text-xs font-medium', isActive ? 'text-white' : 'text-white/60')}>
                  {tab.title}
                </span>
                <Icon className={cn('absolute inset-0 m-auto w-9 h-9 opacity-20', isActive ? 'text-white' : 'text-white/60')} />
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      
      <Carousel 
        setApi={setCarouselApi} 
        opts={{loop: true}} 
        className="w-full mx-0 px-0"
      >
        <CarouselContent className="ml-0">
          {alertTabs.map((tab, index) => (
            <CarouselItem 
              key={tab.id} 
              className="py-1 px-1"
            >
              <div className={cn(
                "relative transition-all duration-150 ease-out rounded-xl w-full",
                activeTab === tab.id && tab.glowClass
              )}>
                <Card className="w-full h-[240px] bg-background/50 border-white/10 backdrop-blur-sm rounded-xl flex flex-col overflow-visible">
                  <CardContent className="flex-grow overflow-hidden relative p-4">
                    <div className='h-full overflow-hidden relative'>
                      <div className='animate-vertical-scroll'>
                        <InternalVerticalList alerts={tab.alerts} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
