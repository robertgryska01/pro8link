// File: src/components/dashboard/notifications-screen.tsx
'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { notificationsData } from '@/lib/placeholder-data';
import { NotificationCard } from './notification-card';
import { SheetClose, SheetTitle } from '../ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '../ui/button';

export function NotificationsScreen() {
  return (
    <div className="h-full flex flex-col">
      <SheetTitle asChild>
        <VisuallyHidden>
          <h2>Notifications</h2>
        </VisuallyHidden>
      </SheetTitle>
      <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        <h2 className="text-xl font-headline font-semibold text-white">
          Notifications
        </h2>
        <div className='flex items-center gap-4'>
            <button className="text-muted-foreground hover:text-white transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <SheetClose asChild>
                <Button variant='ghost' className='text-muted-foreground hover:text-white'>Done</Button>
            </SheetClose>
        </div>
      </header>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          {notificationsData.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
