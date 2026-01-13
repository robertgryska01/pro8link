// File: src/components/inventory/inventory-search.tsx
'use client';

import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

interface InventorySearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelectorClick?: () => void;
  placeholder?: string;
}

export function InventorySearch({ value, onChange, onSelectorClick, placeholder = "Search inventory..." }: InventorySearchProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto flex items-center gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1e2d50] border-none text-white rounded-lg pl-10 h-11 focus:ring-2 focus:ring-accent focus:ring-offset-0 focus:ring-offset-background"
        />
      </div>
       {onSelectorClick && (
        <Button variant="ghost" size="icon" onClick={onSelectorClick} className="bg-[#1e2d50] hover:bg-[#2a3f6b] text-white rounded-lg h-11 w-11">
          <ChevronDown className="w-5 h-5" />
        </Button>
       )}
    </div>
  );
}
