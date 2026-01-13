// File: src/components/more/more-screen.tsx
'use client';

import React from 'react';
import {
  User,
  Receipt,
  BarChart3,
  Settings,
  Power,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type MoreItem = {
  icon: React.ElementType;
  label: string;
  isDestructive?: boolean;
};

const moreItems: MoreItem[] = [
  { icon: User, label: 'Account' },
  { icon: Receipt, label: 'Expenses' },
  { icon: BarChart3, label: 'Reports' },
  { icon: Settings, label: 'Setup' },
  { icon: Power, label: 'Log Out', isDestructive: true },
];

interface MoreScreenProps {
  onMoreItemClick: (item: string) => void;
}

export function MoreScreen({ onMoreItemClick }: MoreScreenProps) {
  return (
    <main className="relative z-10 pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-3">
        {moreItems.map((item, index) => (
          <button
            key={index}
            onClick={() => onMoreItemClick(item.label)}
            className={cn(
              'w-full flex items-center p-4 rounded-lg transition-colors',
              'bg-card/50 hover:bg-card/80'
            )}
          >
            <item.icon
              className={cn(
                'w-6 h-6 mr-4',
                item.isDestructive ? 'text-orange-400' : 'text-white/70'
              )}
            />
            <span
              className={cn(
                'flex-grow text-left font-medium',
                item.isDestructive ? 'text-orange-400' : 'text-white/90'
              )}
            >
              {item.label}
            </span>
            <ChevronRight
              className={cn(
                'w-5 h-5',
                item.isDestructive ? 'text-orange-400' : 'text-white/50'
              )}
            />
          </button>
        ))}
      </div>
    </main>
  );
}
