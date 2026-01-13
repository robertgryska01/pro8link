// File: src/components/dashboard/bottom-navigation.tsx
'use client';

import React from 'react';
import {
  LayoutDashboard,
  Archive,
  Package,
  Settings,
} from 'lucide-react';
import { GeminiAiButton } from './gemini-ai-button';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export function BottomNavigation({
  activeItem,
  setActiveItem,
}: BottomNavigationProps) {
  const navItems = [
    { name: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { name: 'listings', icon: Archive, label: 'Inventory' },
    { name: 'gemini', icon: null, label: 'Gemini AI' },
    { name: 'orders', icon: Package, label: 'Orders' },
    { name: 'more', icon: Settings, label: 'More' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex justify-center items-center h-full mx-auto">
        {navItems.map((item) => {
          const isActive = activeItem === item.name;
          if (item.name === 'gemini') {
            return (
              <div key={item.name} className="relative -top-6 w-24 flex justify-center">
                <GeminiAiButton onClick={() => setActiveItem(item.name)} />
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className="group flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-300 w-24 h-full"
            >
              {Icon && (
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform duration-75 group-active:scale-90',
                    isActive ? 'text-[#4DA3FF]' : 'text-muted-foreground'
                  )}
                />
              )}
              <span
                className={cn(
                  'transition-transform duration-75 group-active:scale-90',
                  isActive ? 'text-[#4DA3FF]' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
