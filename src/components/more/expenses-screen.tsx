// File: src/components/more/expenses-screen.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';

const mockExpenses = [
  {
    id: '1',
    name: 'Shipping Supplies',
    category: 'Business',
    amount: '£45.50',
    date: '2024-07-21',
    image: 'https://picsum.photos/seed/exp1/100/100',
    imageHint: 'shipping boxes',
  },
  {
    id: '2',
    name: 'Inventory Purchase',
    category: 'Inventory',
    amount: '£210.00',
    date: '2024-07-20',
    image: 'https://picsum.photos/seed/exp2/100/100',
    imageHint: 'vintage items',
  },
  {
    id: '3',
    name: 'Software Subscription',
    category: 'Tools',
    amount: '£25.00',
    date: '2024-07-15',
    image: 'https://picsum.photos/seed/exp3/100/100',
    imageHint: 'laptop code',
  },
];

interface ExpensesScreenProps {
  onAddExpenseClick: () => void;
}

export function ExpensesScreen({ onAddExpenseClick }: ExpensesScreenProps) {
  return (
    <main className="relative z-10 pt-20 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        <Button onClick={onAddExpenseClick} className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>

        <Card className="bg-card/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white/80">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {mockExpenses.map((expense) => (
                <li key={expense.id} className="flex items-center gap-4 p-2 rounded-lg bg-background/50">
                  <Image
                    src={expense.image}
                    alt={expense.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                    data-ai-hint={expense.imageHint}
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-white/90">{expense.name}</p>
                    <p className="text-sm text-white/60">{expense.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white/90">{expense.amount}</p>
                    <p className="text-xs text-white/60">{expense.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
