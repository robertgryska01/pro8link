// File: src/components/ui/simple-calendar.tsx
'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimpleCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}

export function SimpleCalendar({ selected, onSelect, disabled }: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectDay = (day: number) => {
    const newDate = new Date(year, month, day);
    if (disabled && disabled(newDate)) {
      return;
    }
    onSelect?.(newDate);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;
  };

  return (
    <div className="p-4 w-full max-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full hover:bg-transparent hover:text-accent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {monthNames[month]} {year}
        </div>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full hover:bg-transparent hover:text-accent">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) {
            return <div key={i} className="w-9 h-9" />;
          }

          const date = new Date(year, month, day);
          const isDisabled = !!(disabled && disabled(date));

          return (
            <div key={i}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectDay(day)}
                  disabled={isDisabled}
                  className={cn(
                    'w-9 h-9 p-0 rounded-full hover:bg-accent/20 bg-transparent',
                    isSelected(day) && 'border-2 border-pink-500 hover:bg-transparent',
                    isToday(day) && !isSelected(day) && 'border-2 border-pink-400/60',
                    isDisabled && 'text-muted-foreground opacity-50 cursor-not-allowed',
                  )}
                >
                  {day}
                </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
