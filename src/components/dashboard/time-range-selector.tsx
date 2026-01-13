// File: src/components/dashboard/time-range-selector.tsx
'use client';

import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface TimeRangeSelectorProps {
  onValueChange: (value: string) => void;
  options?: string[];
  defaultOption?: string;
  placeholder?: string;
}

export function TimeRangeSelector({ 
  onValueChange,
  options,
  defaultOption,
  placeholder = "Select an option"
}: TimeRangeSelectorProps) {
  const [width, setWidth] = useState<number | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tempLongestTextRef = useRef<HTMLSpanElement>(null);

  const timeRanges = options || [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'This Year',
  ];
  
  const longestText = timeRanges.reduce((a, b) => (a.length > b.length ? a : b), '');

  useLayoutEffect(() => {
    if (tempLongestTextRef.current) {
      const textWidth = tempLongestTextRef.current.offsetWidth;
      // Consider padding (px-3.5) and icon space
      const totalWidth = textWidth + 52; 
      setWidth(totalWidth);
    }
  }, [longestText]);

  return (
    <>
      {/* This span is used only for width calculation and is not visible */}
      <span ref={tempLongestTextRef} className="invisible absolute -z-10 text-sm font-medium">{longestText}</span>
      
      <Select defaultValue={defaultOption || timeRanges[0]} onValueChange={onValueChange}>
        <SelectTrigger
          ref={triggerRef}
          className={cn(
            "relative -top-[5px] w-auto bg-[#1e2d50] border-none text-white rounded-[10px] px-3.5 py-2.5 h-auto",
            "focus:ring-2 focus:ring-accent focus:ring-offset-0 focus:ring-offset-background"
          )}
          style={{ width: width ? `${width}px` : 'auto' }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#1e2d50] text-white border-white/10">
          {timeRanges.map((range) => (
            <SelectItem
              key={range}
              value={range}
              className="focus:bg-accent/30"
            >
              {range}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
