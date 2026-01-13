// File: src/components/dashboard/product-alerts-section.tsx
'use client';

import React from 'react';
import { ProductAlertsCard } from './product-alerts-card';
import type { ProductAlert } from '@/lib/placeholder-data';

interface ProductAlertsSectionProps {
    alerts: ProductAlert[];
}

export function ProductAlertsSection({ alerts }: ProductAlertsSectionProps) {
    return <ProductAlertsCard alerts={alerts} />;
}
