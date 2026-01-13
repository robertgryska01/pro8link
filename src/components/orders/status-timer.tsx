// File: src/components/orders/status-timer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { OrderItem } from './orders-placeholder-data';

interface StatusTimerProps {
  item: OrderItem;
}

const timerColors: Record<OrderItem['status'], string> = {
  Pending: 'rgba(148, 156, 177, 0.5)', 
  'Drop-Off': 'rgba(71, 156, 255, 0.5)', 
  'In Transit': 'rgba(243, 164, 84, 0.5)',
  Delivered: 'rgba(54, 138, 123, 0.5)', 
};

const urgentColor = 'rgba(255, 0, 0, 0.6)';

const formatDuration = (milliseconds: number) => {
  if (milliseconds < 0) milliseconds = 0;
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  return `${hours}h ${minutes}m ${seconds}s`;
};

export function StatusTimer({ item }: StatusTimerProps) {
  const { startTime, status, urgency } = item;
  const [timeLeft, setTimeLeft] = useState('');
  
  const isUrgent = status === 'Drop-Off' && urgency === 'low';

  useEffect(() => {
    // This is the place for future logic regarding delivery time countdown.
    // For now, it calculates elapsed time or a fixed countdown for urgent items.
    const start = new Date(startTime).getTime();
    
    const interval = setInterval(() => {
      if (isUrgent) {
         // This is a temporary logic for demonstration purposes.
        const oneDay = 24 * 60 * 60 * 1000;
        const endTime = start + oneDay;
        const now = Date.now();
        setTimeLeft(formatDuration(endTime - now));
      } else {
        const now = Date.now();
        setTimeLeft(formatDuration(now - start));
      }
    }, 1000);

    // Initial call
    if (isUrgent) {
      const oneDay = 24 * 60 * 60 * 1000;
      const endTime = start + oneDay;
      const now = Date.now();
      setTimeLeft(formatDuration(endTime - now));
    } else {
      const now = Date.now();
      setTimeLeft(formatDuration(now - start));
    }

    return () => clearInterval(interval);
  }, [startTime, isUrgent]);

  const color = isUrgent ? urgentColor : timerColors[status];
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${color}, transparent)`,
  };

  return (
    <div
      className={cn(
        'w-full rounded-full p-1 text-center text-xs font-medium',
        isUrgent ? 'text-red-400 animate-urgent-pulse' : 'text-white/90',
      )}
      style={gradientStyle}
    >
      {timeLeft}
    </div>
  );
}
