// File: src/components/ui/action-sheet.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function ActionSheet({ open, onOpenChange, children }: ActionSheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-[#1c283a] rounded-t-2xl p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
          {children}
        </div>
      </div>
    </>
  );
}

interface ActionSheetItemProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

export function ActionSheetItem({ onClick, icon, children, disabled }: ActionSheetItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-4 text-white rounded-lg transition-colors",
        "hover:bg-white/10 active:bg-white/20",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {icon && <span className="text-accent">{icon}</span>}
      <span className="text-base font-medium">{children}</span>
    </button>
  );
}
