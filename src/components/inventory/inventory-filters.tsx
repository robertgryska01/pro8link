// File: src/components/inventory/inventory-filters.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterType = 'Stock' | 'Active' | 'Ended' | 'Completed';

const FILTERS: { label: FilterType; systemName: string }[] = [
  { label: 'Stock', systemName: 'stock-inventory-filter' },
  { label: 'Active', systemName: 'active-inventory-filter' },
  { label: 'Ended', systemName: 'ended-inventory-filter' },
  { label: 'Completed', systemName: 'complete-inventory-filter' },
];

const activeFilterStyles: Record<FilterType, { border: string, text: string }> = {
    Stock: { border: 'border-stock-inventory-status', text: 'text-stock-inventory-status' },
    Active: { border: 'border-active-inventory-status', text: 'text-active-inventory-status' },
    Ended: { border: 'border-ended-inventory-status', text: 'text-ended-inventory-status' },
    Completed: { border: 'border-completed-inventory-status', text: 'text-completed-inventory-status' },
};


interface InventoryFiltersProps {
    activeFilters: Set<string>;
    onFilterChange: (filters: Set<string>) => void;
}

export function InventoryFilters({ activeFilters, onFilterChange }: InventoryFiltersProps) {

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
