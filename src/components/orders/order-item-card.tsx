// File: src/components/orders/order-item-card.tsx
'use client';

import React from 'react';
import type { OrderItem } from './orders-placeholder-data';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { StatusTimer } from './status-timer';
import { Lock, Flame, FilePenLine } from 'lucide-react';

interface OrderItemCardProps {
  item: OrderItem;
}

const statusStyles: Record<
  OrderItem['status'],
  { bg: string; text: string }
> = {
  Pending: { bg: 'bg-pending-order-status', text: 'text-white' },
  'Drop-Off': { bg: 'bg-dropOff-order-status', text: 'text-white' },
  'In Transit': { bg: 'bg-inTransit-order-status', text: 'text-white' },
  Delivered: { bg: 'bg-delivered-order-status', text: 'text-white' },
};

export function OrderItemCard({ item }: OrderItemCardProps) {
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
      <div className="p-4 flex-grow flex flex-col gap-2">
        <div>
            <h3 className="text-white font-semibold text-base leading-tight">
            {item.title}
            </h3>
            <p className="text-muted-foreground text-xs mt-1.5">{item.details}</p>
        </div>
        <Separator className="bg-white/10" />
        <div className="flex justify-between items-center h-8">
          <span className="text-green-400 font-bold text-lg w-1/4 text-left">{item.price}</span>
          <div className="flex-1 flex justify-center items-center gap-x-3">
              {item.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
              {item.isPromoted && <Flame className="w-4 h-4 text-muted-foreground" />}
              {item.hasComment && <FilePenLine className="w-4 h-4 text-muted-foreground" />}
          </div>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium underline w-1/4 text-right"
          >
            {item.shipping}
          </a>
        </div>
        <StatusTimer item={item} />
      </div>
    </div>
  );
}
