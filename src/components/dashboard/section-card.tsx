// File: src/components/dashboard/section-card.tsx
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type DataType = {
  id: string;
  [key: string]: any;
};

interface SectionCardProps {
  title: string;
  data: DataType[];
  type: 'orders' | 'products' | 'categories';
}

export function SectionCard({ title, data, type }: SectionCardProps) {
  const renderContent = () => {
    switch (type) {
      case 'orders':
        return (
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">Order ID</TableHead>
                <TableHead className="text-white/70">Product</TableHead>
                <TableHead className="text-right text-white/70">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id} className="border-white/10">
                  <TableCell className="font-medium text-white/60">{item.id}</TableCell>
                  <TableCell className="text-white/90">{item.product}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.status === 'Shipped' ? 'default' : 'secondary'} className={item.status === 'Shipped' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case 'products':
      case 'categories':
        return (
          <ul className="space-y-3">
            {data.map((item, index) => (
              <li key={item.id} className="flex items-center gap-4">
                 <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={item.imageHint}/>
                <span className="flex-grow text-white/90">{item.name}</span>
                <span className="text-sm font-semibold text-white/70">{item.value}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full min-h-[300px] bg-background/50 border-white/10 backdrop-blur-sm rounded-xl">
      <CardHeader>
        <CardTitle className="text-white/90 font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
