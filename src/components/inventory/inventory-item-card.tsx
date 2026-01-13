// File: src/components/inventory/inventory-item-card.tsx
'use client';

import React from 'react';
import type { InventoryItem } from './inventory-placeholder-data';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface InventoryItemCardProps {
  item: InventoryItem;
}

const statusStyles: Record<
  InventoryItem['status'],
  { bg: string; text: string }
> = {
  Stock: { bg: 'bg-stock-inventory-status', text: 'text-white' },
  Active: { bg: 'bg-active-inventory-status', text: 'text-white' },
  Ended: { bg: 'bg-ended-inventory-status', text: 'text-white' },
  Completed: { bg: 'bg-completed-inventory-status', text: 'text-white' },
};

export function InventoryItemCard({ item }: InventoryItemCardProps) {
  const { bg, text } = statusStyles[item.status];

  return (
    <div className="flex bg-card rounded-lg overflow-hidden shadow-md border border-white/10">
      <div
        className={cn(
          'flex items-center justify-center w-8 flex-shrink-0',
          bg
        )}
      >
        <span
          className={cn(
            'transform -rotate-90 whitespace-nowrap text-sm font-semibold tracking-wider',
            text
          )}
        >
          {item.status}
        </span>
      </div>
      <div className="p-4 flex-grow">
        <h3 className="text-white font-semibold text-base leading-tight">
          {item.title}
        </h3>
        <p className="text-muted-foreground text-xs mt-1.5">{item.details}</p>
        <Separator className="my-2 bg-white/10" />
        <div className="flex justify-between items-center">
          <span className="text-green-400 font-bold text-lg">{item.price}</span>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium underline"
          >
            {item.shipping}
          </a>
        </div>
      </div>
    </div>
  );
}
