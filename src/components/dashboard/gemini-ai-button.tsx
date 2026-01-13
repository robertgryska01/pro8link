// File: src/components/dashboard/gemini-ai-button.tsx
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GeminiAiButtonProps {
  onClick: () => void;
}

export function GeminiAiButton({ onClick }: GeminiAiButtonProps) {
  return (
    <div className="relative w-16 h-16">
      <div className="gemini-glow-ring" />
      <Button
        onClick={onClick}
        aria-label="Gemini AI"
        className={cn(
          'relative w-16 h-16 p-0 rounded-full overflow-hidden border-2 border-accent/30',
          'bg-gradient-to-br from-accent/20 to-primary/10'
        )}
      >
        <div
          className={cn(
            'gemini-button-gradient-element absolute inset-[-100%] w-[300%] h-[300%]',
            'bg-[conic-gradient(from_90deg_at_50%_50%,_#BE54F3_0%,_#4DA3FF_50%,_#BE54F3_100%)]'
          )}
        />
        <div className="relative z-10 w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full bg-background flex items-center justify-center">
          <Sparkles
            size={26}
            className="text-accent"
            strokeWidth={1.5}
          />
        </div>
      </Button>
    </div>
  );
}
