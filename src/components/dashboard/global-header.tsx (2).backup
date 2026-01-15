// File: src/components/dashboard/global-header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Bell, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationsScreen } from './notifications-screen';
import { Button } from '../ui/button';

interface GlobalHeaderProps {
  opacity: number;
}

// Custom Link Icon with Gradient (matching icon.png)
const GradientLinkIcon = ({ className }: { className?: string }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <defs>
        <linearGradient id="iconGradientHeader" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#3B9CFF" />
           <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>
      </defs>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="url(#iconGradientHeader)"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="url(#iconGradientHeader)" />
    </svg>
  );

export function GlobalHeader({ opacity }: GlobalHeaderProps) {
  const [isClient, setIsClient] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
    }, 2000); // Simulate a 2-second sync process
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-40 transition-colors duration-300'
      )}
      style={{
        backgroundColor: `rgba(15, 27, 46, ${opacity * 0.8})`,
        backdropFilter: `blur(${opacity * 6}px)`,
        WebkitBackdropFilter: `blur(${opacity * 6}px)`,
      }}
    >
      {/* Left Sync Button */}
      <div className="flex-1 flex justify-start">
        <Button
            variant="ghost"
            onClick={handleSync}
            disabled={isSyncing}
            className="relative text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-md px-4 border border-green-400/50"
        >
            {isSyncing ? (
                <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <RefreshCw className="w-4 h-4 animate-spin-reverse absolute opacity-50" />
                </>
            ) : (
                'Sync'
            )}
        </Button>
      </div>

      {/* Centered Logo */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center justify-center">
          <span 
            className="font-headline text-xl font-semibold tracking-wider bg-clip-text text-transparent mr-px"
            style={{ backgroundImage: 'linear-gradient(to right, #3B9CFF, #4DA3FF)'}}
          >
            Pro
          </span>
          <GradientLinkIcon />
          <span 
            className="font-headline text-xl font-semibold tracking-wider bg-clip-text text-transparent ml-px"
            style={{ backgroundImage: 'linear-gradient(to right, #34D399, #4ADE80)'}}
            >
            Link
          </span>
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-4">
          <button className="relative text-[#9aa4b2] hover:text-[#4da3ff] transition-colors">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </button>
          {isClient && (
            <Sheet>
              <SheetTrigger asChild>
                <button className="relative text-[#9aa4b2] hover:text-[#4da3ff] transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    5
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 border-l-white/10 backdrop-blur-lg p-0 w-full sm:max-w-full">
                <NotificationsScreen />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          opacity: opacity,
        }}
      />
    </header>
  );
}
