// File: src/components/tab-headers/tab-header.tsx
'use client';

import React from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationsScreen } from '../dashboard/notifications-screen';
import { Button } from '../ui/button';

interface TabHeaderProps {
  title?: string;
  children?: React.ReactNode;
  opacity: number;
  onAddClick?: () => void;
}

export function TabHeader({ title, children, opacity, onAddClick }: TabHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-colors duration-300'
      )}
      style={{
        backgroundColor: `rgba(15, 27, 46, ${opacity * 0.95})`,
        backdropFilter: `blur(${opacity * 6}px)`,
        WebkitBackdropFilter: `blur(${opacity * 6}px)`,
      }}
    >
      <div className='h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
        <div className="flex-1 flex justify-start">
          {onAddClick && (
            <Button variant="ghost" onClick={onAddClick} className="text-white/80 hover:text-white hover:bg-transparent hover:border-white/40 border border-white/20 rounded-md">Add</Button>
          )}
        </div>
        <div className="flex-1 flex justify-center">
          {title && (
            <h1 className="text-xl font-headline font-semibold text-white/90">
              {title}
            </h1>
          )}
        </div>
        <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-4">
            <button className="relative text-[#9aa4b2] hover:text-[#4da3ff] transition-colors">
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                3
                </span>
            </button>
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
            </div>
        </div>
      </div>
      
      {children && (
        <div className="px-4 sm:px-6 lg:px-8 pb-4 flex flex-col items-center gap-4">
          {children}
        </div>
      )}

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
