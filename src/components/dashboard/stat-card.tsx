// File: src/components/dashboard/stat-card.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { pressAnimation } from '@/lib/pressAnimation';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  onClick: () => void;
}

const glowColors: Record<string, string> = {
  Inventory: 'shadow-glow-inventory',
  Listed: 'shadow-glow-active',
  Sold: 'shadow-glow-sold',
  Return: 'shadow-glow-return',
};

export function StatCard({
  title,
  value,
  change,
  isPositive,
  onClick,
}: StatCardProps) {
  const glowClass = glowColors[title] || '';

  return (
    <Card
      as="button"
      onClick={onClick}
      className={cn(
        'relative overflow-hidden aspect-square w-full',
        'bg-white/5 border border-white/10 backdrop-blur-md rounded-xl',
        pressAnimation(),
        glowClass
      )}
    >
      <CardHeader className="pb-2 pt-4 flex flex-col items-center">
        <CardTitle className="text-sm font-medium text-white/70">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold font-headline text-white">
          {value}
        </div>

        <div className="flex items-center text-xs mt-1">
          <span
            className={cn(
              'flex items-center gap-1',
              isPositive ? 'text-green-400' : 'text-red-400'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
