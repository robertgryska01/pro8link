// File: src/components/inventory/container-selector-screen.tsx
'use client';

import React from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { extractContainer } from '@/lib/google/sync';

// Type for products from sync
interface Product {
  sku: string;
  status: string;
  [key: string]: any;
}

interface ContainerSelectorScreenProps {
  products: Product[];
  onClose: () => void;
  onSelectContainer: (container: string) => void;
}

type ContainerStats = {
  total: number;
  stock: number;
  listed: number;
};

export function ContainerSelectorScreen({
  products,
  onClose,
  onSelectContainer,
}: ContainerSelectorScreenProps) {
  const containerStats = React.useMemo(() => {
    const stats: Record<string, ContainerStats> = {};

    // Filter products with status "Stock" or "Listed"
    const filteredProducts = products.filter(
      (product) => product.status === 'Stock' || product.status === 'Listed'
    );

    filteredProducts.forEach((product) => {
      const container = extractContainer(product.sku);
      if (!container) return;

      if (!stats[container]) {
        stats[container] = { total: 0, stock: 0, listed: 0 };
      }
      
      stats[container].total++;
      if (product.status === 'Stock') stats[container].stock++;
      if (product.status === 'Listed') stats[container].listed++;
    });

    return Object.entries(stats).sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);

  const StatCircle = ({ count, colorClass }: { count: number; colorClass: string }) => (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${colorClass}`}>
      {count}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0 h-16">
        <h2 className="text-xl font-headline font-semibold text-white">
          Select Container
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
      </header>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-2">
          {containerStats.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              No containers with Stock or Listed items
            </div>
          ) : (
            containerStats.map(([container, stats]) => (
              <button
                key={container}
                onClick={() => onSelectContainer(container)}
                className="w-full flex items-center p-3 rounded-lg transition-colors bg-card/50 hover:bg-card/80"
              >
                <span className="flex-grow text-left font-medium text-white/90">
                  {container}
                </span>
                <div className="flex items-center gap-2">
                  <StatCircle count={stats.stock} colorClass="bg-gray-500 text-white" />
                  <StatCircle count={stats.listed} colorClass="bg-orange-500 text-white" />
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
