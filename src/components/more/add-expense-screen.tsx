// File: src/components/more/add-expense-screen.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Plus,
  Camera,
  Calendar as CalendarIcon,
  Asterisk,
  Loader2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { format } from 'date-fns';
import { SimpleCalendar } from '../ui/simple-calendar';
import { Card } from '../ui/card';
import Image from 'next/image';
import { ActionSheet, ActionSheetItem } from '../ui/action-sheet';

interface AddExpenseScreenProps {
  onClose: () => void;
}

export function AddExpenseScreen({ onClose }: AddExpenseScreenProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [opacity, setOpacity] = useState(0);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const value = Math.min(el.scrollTop / 80, 1);
      setOpacity(value);
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleDateSelect = (newDate: Date | undefined) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (newDate && newDate > today) {
      setDateError('Expense date cannot be in the future.');
    } else {
      setDateError(null);
    }
    setDate(newDate);
    setIsCalendarOpen(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const handlePhotoSlotClick = () => {
    if (isSubmitting) return;
    if (image) {
      setImage(null);
    } else {
      setIsActionSheetOpen(true);
    }
  };

  const handleTakePhoto = () => {
    setIsActionSheetOpen(false);
    cameraInputRef.current?.click();
  };

  const handleChooseFromGallery = () => {
    setIsActionSheetOpen(false);
    galleryInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const RequiredAsterisk = () => (
    <span className="inline-block relative -top-1 pl-0.5">
      <Asterisk className="w-3 h-3 text-muted-foreground" />
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1b2e] overflow-hidden flex flex-col">
      {/* HEADER */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-colors duration-300'
        )}
        style={{
          backgroundColor: `rgba(15, 27, 46, ${opacity * 0.8})`,
          backdropFilter: `blur(${opacity * 6}px)`,
          WebkitBackdropFilter: `blur(${opacity * 6}px)`,
        }}
      >
        <div className="h-16 px-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <ArrowLeft />
          </Button>
          <h2 className="text-xl font-headline font-semibold text-white/90">
            Add Expense
          </h2>
          <div className="w-10" />
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            opacity: opacity,
          }}
        />
      </header>

      {/* CONTENT */}
      <div ref={scrollRef} className="pt-16 flex-grow overflow-y-auto pb-24">
        <div className="px-4 py-4 space-y-4 max-w-md mx-auto">
          <div className="space-y-1">
            <Label htmlFor="expense-name">
              Expense Name
              <RequiredAsterisk />
            </Label>
            <Input
              id="expense-name"
              type="text"
              className="focus-glow bg-[#1e2d50] border-none text-white rounded-lg"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="expense-category">
              Category
              <RequiredAsterisk />
            </Label>
            <Select disabled={isSubmitting}>
              <SelectTrigger
                id="expense-category"
                className="focus-glow w-full bg-[#1e2d50] border-none text-white rounded-lg"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#1e2d50] text-white border-white/10">
                <SelectItem value="inventory" className="focus:bg-accent/30">Inventory</SelectItem>
                <SelectItem value="shipping" className="focus:bg-accent/30">Shipping Supplies</SelectItem>
                <SelectItem value="software" className="focus:bg-accent/30">Software/Tools</SelectItem>
                <SelectItem value="other" className="focus:bg-accent/30">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="expense-amount">
              Amount
              <RequiredAsterisk />
            </Label>
            <Input
              id="expense-amount"
              type="number"
              placeholder="0.00"
              className="focus-glow bg-[#1e2d50] border-none text-white rounded-lg"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="expense-date">
              Expense Date
              <RequiredAsterisk />
            </Label>
            <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'focus-glow w-full justify-start text-left font-normal bg-[#1e2d50] border-none text-white rounded-lg hover:bg-[#1e2d50] hover:text-white',
                    !date && 'text-muted-foreground',
                    dateError && 'border-red-500'
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background/90 backdrop-blur-xl border-white/20 text-white p-0 w-[calc(100vw-2rem)] max-w-[340px]">
                <DialogHeader>
                  <VisuallyHidden>
                    <DialogTitle>Select an expense date</DialogTitle>
                  </VisuallyHidden>
                </DialogHeader>
                <SimpleCalendar
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(day) => day > new Date()}
                />
              </DialogContent>
            </Dialog>
            {dateError && (
              <p className="text-sm text-red-500 mt-1">{dateError}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <Label>Photo of Receipt/Expense</Label>
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileChange}
              accept="image/*"
              capture="environment"
              className="hidden"
              disabled={isSubmitting}
            />
            <input
              type="file"
              ref={galleryInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isSubmitting}
            />
            <div className="flex justify-center">
              <button
                onClick={handlePhotoSlotClick}
                disabled={isSubmitting}
                className="w-32 h-32 bg-[#1e2d50]/80 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
              >
                {image ? (
                  <>
                    <Image src={image} alt="Selected expense" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X className="w-8 h-8 text-white" />
                    </div>
                  </>
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Card
              as="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-card/80 text-white/90 hover:bg-card/100 active:scale-[0.98] transition-all"
            >
              <div className="h-12 flex items-center justify-center font-semibold">
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Add Expense'
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ActionSheet open={isActionSheetOpen} onOpenChange={setIsActionSheetOpen}>
        <div className="space-y-2 pb-4">
          <ActionSheetItem onClick={handleTakePhoto} icon={<Camera className="w-5 h-5" />}>
            Take Photo
          </ActionSheetItem>
          <ActionSheetItem onClick={handleChooseFromGallery} icon={<ImageIcon className="w-5 h-5" />}>
            Choose from Gallery
          </ActionSheetItem>
          <button
            onClick={() => setIsActionSheetOpen(false)}
            className="w-full px-4 py-4 text-white/60 rounded-lg hover:bg-white/5 transition-colors mt-2"
          >
            Cancel
          </button>
        </div>
      </ActionSheet>
    </div>
  );
}
