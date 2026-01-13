// File: src/components/orders/orders-filters.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterType = 'Pending' | 'Drop-Off' | 'In Transit' | 'Delivered';

const FILTERS: { label: FilterType; systemName: string }[] = [
  { label: 'Pending', systemName: 'pending-order-filter' },
  { label: 'Drop-Off', systemName: 'drop-off-order-filter' },
  { label: 'In Transit', systemName: 'in-transit-order-filter' },
  { label: 'Delivered', systemName: 'delivered-order-filter' },
];

const activeFilterStyles: Record<FilterType, { border: string, text: string }> = {
    Pending: { border: 'border-pending-order-status', text: 'text-pending-order-status' },
    'Drop-Off': { border: 'border-dropOff-order-status', text: 'text-dropOff-order-status' },
    'In Transit': { border: 'border-inTransit-order-status', text: 'text-inTransit-order-status' },
    Delivered: { border: 'border-delivered-order-status', text: 'text-delivered-order-status' },
};

interface OrdersFiltersProps {
    activeFilters: Set<string>;
    onFilterChange: (filters: Set<string>) => void;
}

export function OrdersFilters({ activeFilters, onFilterChange }: OrdersFiltersProps) {

  const toggleFilter = (filter: FilterType) => {
    onFilterChange((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  return (
    <div className="flex w-full justify-center items-center gap-2">
      {FILTERS.map(({ label, systemName }) => {
        const isActive = activeFilters.has(label);
        const activeStyle = isActive ? activeFilterStyles[label] : { border: '', text: '' };
        return (
          <Button
            key={systemName}
            size="sm"
            data-system-name={systemName}
            data-state={isActive ? 'active' : 'inactive'}
            onClick={() => toggleFilter(label)}
            className={cn(
              'border bg-transparent text-white/70 h-8 px-4 text-xs rounded-lg transition-all duration-200 border-[#304057] focus:ring-0',
              'hover:bg-transparent hover:border-[#4a5a73] hover:text-white', // Desktop hover
              'data-[state=active]:bg-transparent',
              isActive && `${activeStyle.border} ${activeStyle.text}`,
              'active:scale-95' // Press animation
            )}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
