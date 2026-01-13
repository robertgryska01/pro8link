// File: src/components/inventory/inventory-screen.tsx
'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { inventoryItems } from './inventory-placeholder-data';
import { InventoryItemCard } from './inventory-item-card';

interface InventoryScreenProps {
  onScroll: (scrollY: number, top: number) => void;
  searchQuery: string;
  activeFilters: Set<string>;
  setActiveFilters: (filters: Set<string>) => void;
}

export function InventoryScreen({ onScroll, searchQuery, activeFilters, setActiveFilters }: InventoryScreenProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Adjust the top offset to account for the header + search + filters height
      const top = contentRef.current?.offsetTop ? contentRef.current.offsetTop - (64 + 44 + 48) : 100;
      onScroll(scrollY, top);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScroll]);

  const filteredItems = useMemo(() => {
    let items = inventoryItems;
    
    if(activeFilters.size > 0) {
        items = items.filter(item => activeFilters.has(item.status));
    }

    if (!searchQuery) {
      return items;
    }
    
    const lowercasedQuery = searchQuery.toLowerCase();

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercasedQuery) ||
        item.details.toLowerCase().includes(lowercasedQuery) ||
        item.container.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, activeFilters]);

  return (
    <main ref={contentRef} className="relative z-10 pt-48 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <InventoryItemCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
