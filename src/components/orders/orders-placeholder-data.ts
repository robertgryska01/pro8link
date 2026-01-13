// File: src/components/orders/orders-placeholder-data.ts
export type OrderItem = {
  id: string;
  status: 'Pending' | 'Drop-Off' | 'In Transit' | 'Delivered';
  title: string;
  details: string;
  price: string;
  shipping: string;
  startTime: string; // ISO 8601 date string
  isPrivate?: boolean;
  isPromoted?: boolean;
  hasComment?: boolean;
  urgency?: 'low';
};

const now = new Date();

export const orderItems: OrderItem[] = [
  {
    id: '1',
    status: 'In Transit',
    title: 'Erbauer Saw Wood Circular, Mitre & Table Saw Blade 210mm x 30mm 40T',
    details: 'B14-0157-2 | 19-14031-02497 | 1/1/2026 | mark310_2',
    price: '£10',
    shipping: 'Royal Mail',
    startTime: new Date(now.getTime() - 7 * 3600 * 1000 - 47 * 60 * 1000).toISOString(),
    isPromoted: true,
  },
  {
    id: '2',
    status: 'Pending',
    title: 'Korkmaz Exclusive Stainless Steel Tea Kettle Coffee Pot Used Good',
    details: 'B18-0166-2 | 11-14048-45442 | 03/01/2026 | didimajd',
    price: '£12.00',
    shipping: 'Evri',
    startTime: new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString(),
    isPrivate: true,
    hasComment: true,
  },
  {
    id: '3',
    status: 'Drop-Off',
    title: 'Vintage Leatherbound Journal - 200 Pages, Lined',
    details: 'C01-2234-1 | 08-11234-55432 | 12/05/2025 | vintageco',
    price: '£25.50',
    shipping: 'Royal Mail',
    startTime: new Date(now.getTime() - (24 * 3600 * 1000 - (1 * 3600 * 1000 + 2 * 60 * 1000 + 15 * 1000))).toISOString(), // Ends in 1h 2m 15s
    hasComment: true,
    urgency: 'low'
  },
  {
    id: '4',
    status: 'Delivered',
    title: 'Professional Camera Drone with 4K Video',
    details: 'D99-0012-5 | 22-98765-12345 | 02/11/2027 | techfly',
    price: '£299.99',
    shipping: 'DPD',
    startTime: new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString(),
    isPrivate: true,
    isPromoted: true,
    hasComment: true,
  },
];
