// File: src/components/inventory/container-selector-screen.tsx
'use client';

import React from 'react';
import type { InventoryItem } from './inventory-placeholder-data';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface ContainerSelectorScreenProps {
  inventoryItems: InventoryItem[];
  onClose: () => void;
  onSelectContainer: (container: string) => void;
}

type ContainerStats = {
  total: number;
  stock: number;
  active: number;
  ended: number;
};

export function ContainerSelectorScreen({
  inventoryItems,
  onClose,
  onSelectContainer,
}: ContainerSelectorScreenProps) {
  const containerStats = React.useMemo(() => {
    const stats: Record<string, ContainerStats> = {};

    inventoryItems.forEach((item) => {
      if (!stats[item.container]) {
        stats[item.container] = { total: 0, stock: 0, active: 0, ended: 0 };
      }
      stats[item.container].total++;
      if (item.status === 'Stock') stats[item.container].stock++;
      if (item.status === 'Active') stats[item.container].active++;
      if (item.status === 'Ended') stats[item.container].ended++;
    });

    return Object.entries(stats).sort((a, b) => a[0].localeCompare(b[0]));
  }, [inventoryItems]);

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
          {containerStats.map(([container, stats]) => (
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
                <StatCircle count={stats.active} colorClass="bg-orange-500 text-white" />
                <StatCircle count={stats.ended} colorClass="bg-gray-500 text-white" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
