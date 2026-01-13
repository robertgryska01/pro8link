// File: src/components/dashboard/notification-card.tsx
'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquareText,
  Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/lib/placeholder-data';

interface NotificationCardProps {
  notification: Notification;
}

const iconMap = {
  new_order: {
    icon: CheckCircle2,
    className: 'bg-green-500/20 text-green-400',
  },
  inventory_alert: {
    icon: AlertTriangle,
    className: 'bg-orange-500/20 text-orange-400',
  },
  shipping_update: {
    icon: Truck,
    className: 'bg-blue-500/20 text-blue-400',
  },
  message_received: {
    icon: MessageSquareText,
    className: 'bg-purple-500/20 text-purple-400',
  },
};

export function NotificationCard({ notification }: NotificationCardProps) {
  const { icon: Icon, className } = iconMap[notification.type];

  return (
    <div className="bg-card/50 p-4 rounded-lg flex gap-4 items-start">
      <div
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          className
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-white/90">{notification.title}</h3>
        <p className="text-sm text-white/70 mt-1">{notification.description}</p>
        <p className="text-xs text-white/50 mt-2">{notification.timestamp}</p>
      </div>
    </div>
  );
}
