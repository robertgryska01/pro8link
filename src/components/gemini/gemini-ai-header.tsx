// File: src/components/gemini/gemini-ai-header.tsx
'use client';

import React from 'react';
import { CircleHelp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function GeminiAiHeader() {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-colors duration-300',
        'bg-transparent'
      )}
    >
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="w-10" />
        <Button variant="ghost" size="icon">
          <CircleHelp className="text-white/80" />
        </Button>
      </div>
    </header>
  );
}
