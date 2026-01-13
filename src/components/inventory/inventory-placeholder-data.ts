// File: src/components/inventory/inventory-placeholder-data.ts
export type InventoryItem = {
  id: string;
  status: 'Stock' | 'Active' | 'Ended' | 'Completed';
  title: string;
  details: string;
  price: string;
  shipping: string;
  container: string;
};

export const inventoryItems: InventoryItem[] = [
  {
    id: '1',
    status: 'Active',
    title: 'Erbauer Saw Wood Circular, Mitre & Table Saw Blade 210mm x 30mm 40T',
    details: 'B14-0157-2 | 19-14031-02497 | 1/1/2026 | mark310_2',
    price: '£10',
    shipping: 'Royal Mail',
    container: 'B01',
  },
  {
    id: '2',
    status: 'Ended',
    title: 'Korkmaz Exclusive Stainless Steel Tea Kettle Coffee Pot Used Good',
    details: 'B18-0166-2 | 11-14048-45442 | 03/01/2026 | didimajd',
    price: '£12.00',
    shipping: 'Evri',
    container: 'B02',
  },
  {
    id: '3',
    status: 'Stock',
    title: 'Vintage Leatherbound Journal - 200 Pages, Lined',
    details: 'C01-2234-1 | 08-11234-55432 | 12/05/2025 | vintageco',
    price: '£25.50',
    shipping: 'Royal Mail',
    container: 'B01',
  },
  {
    id: '4',
    status: 'Completed',
    title: 'Professional Camera Drone with 4K Video',
    details: 'D99-0012-5 | 22-98765-12345 | 02/11/2027 | techfly',
    price: '£299.99',
    shipping: 'DPD',
    container: 'B02',
  },
  {
    id: '5',
    status: 'Active',
    title: 'Handmade Ceramic Mug',
    details: 'E05-1111-8 | 01-23456-78901 | 06/15/2025 | potteryart',
    price: '£18.00',
    shipping: 'Evri',
    container: 'C03',
  },
  {
    id: '6',
    status: 'Stock',
    title: 'Gaming Mouse with RGB Lighting',
    details: 'F12-3321-9 | 99-87654-32109 | 09/20/2026 | gamergear',
    price: '£45.00',
    shipping: 'DPD',
    container: 'B01',
  },
];
