// File: src/lib/pressAnimation.ts
import { cn } from '@/lib/utils';

export function pressAnimation(extra?: string) {
  return cn(
    'transition-all duration-150 ease-out',
    'active:scale-[0.96] active:shadow-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
    extra
  );
}
