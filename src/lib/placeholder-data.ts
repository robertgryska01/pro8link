// File: src/lib/placeholder-data.ts

export type StatCardData = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
};

export type ChartData = {
  title: string;
  data: { label: string; value: number }[];
};

export type ProductAlert = {
    id: string;
    title:string;
    message: string;
    image: string;
    imageHint: string;
    timestamp: string;
}

export type Order = {
    id: string;
    product: string;
    status: 'Shipped' | 'Pending';
}

export type Product = {
    id: string;
    name: string;
    value: string;
    image: string;
    imageHint: string;
}

export type Category = {
    id: string;
    name: string;
    value: string;
    image: string;
    imageHint: string;
}

export type Notification = {
  id: string;
  type: 'new_order' | 'inventory_alert' | 'shipping_update' | 'message_received';
  title: string;
  description: string;
  timestamp: string;
};

// Simple pseudo-random number generator for consistent values
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const generateRandomValue = (rng: () => number, base: number, factor: number) => {
    return Math.round(base + (rng() - 0.5) * factor);
};

const generateRandomChange = (rng: () => number, factor: number) => {
    const value = (rng() * factor).toFixed(1);
    return rng() > 0.5 ? `+${value}%` : `-${value}%`;
}

const getChartData = (rng: () => number, range: string, valueBase: number, valueFactor: number) => {
    switch (range) {
        case 'Today':
        case 'Yesterday': {
            // Generate 25 points for 0-24h range
            return Array.from({ length: 25 }, (_, i) => ({
                label: i % 2 === 0 ? String(i) : '',
                value: i === 0 ? 0 : (rng() > 0.1 ? generateRandomValue(rng, valueBase / 24, valueFactor / 24) : 0),
            }));
        }
        case 'This Week':
        case 'Last Week': {
             const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
             return days.map(d => ({
                label: d,
                value: generateRandomValue(rng, valueBase / 7, valueFactor / 7),
            }));
        }
        case 'This Month':
        case 'Last Month': {
            const now = new Date();
            const year = now.getFullYear();
            const month = range === 'This Month' ? now.getMonth() : now.getMonth() - 1;
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            return Array.from({ length: daysInMonth }, (_, i) => ({
                label: (i + 1) % 3 === 1 ? String(i + 1) : '',
                value: generateRandomValue(rng, valueBase / daysInMonth, valueFactor / daysInMonth),
            }));
        }
        case 'This Year': {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months.map(m => ({
                label: m,
                value: generateRandomValue(rng, valueBase / 12, valueFactor / 12),
            }));
        }
        default:
            return [];
    }
};

const createConsistentStatData = (seed: number, timeRange: string): { statCardsData: StatCardData[], chartData: ChartData[], recentOrders: Order[], topProducts: Product[], bestCategories: Category[] } => {
    const rng = seededRandom(seed);
    const valueBase = 1200;
    const changeFactor = 15;
    const revenueBase = 50000;
    const salesTrendBase = 300;
    
    const revenueData = getChartData(rng, timeRange, revenueBase, revenueBase * 0.4);
    const salesTrendData = getChartData(rng, timeRange, salesTrendBase, salesTrendBase * 0.5);

    return {
        statCardsData: [
            { title: 'Listed', value: generateRandomValue(rng, valueBase, 500).toLocaleString(), change: generateRandomChange(rng, changeFactor), isPositive: rng() > 0.3 },
            { title: 'Sold', value: generateRandomValue(rng, valueBase * 0.75, 300).toLocaleString(), change: generateRandomChange(rng, changeFactor), isPositive: rng() > 0.5 },
            { title: 'Return', value: generateRandomValue(rng, valueBase * 0.25, 200).toLocaleString(), change: generateRandomChange(rng, changeFactor), isPositive: rng() > 0.3 },
            { title: 'Inventory', value: generateRandomValue(rng, valueBase * 0.02, 20).toLocaleString(), change: generateRandomChange(rng, changeFactor), isPositive: rng() < 0.5 },
        ],
        chartData: [
            {
              title: "Sales Trend",
              data: salesTrendData,
            },
            {
              title: "Revenue",
              data: revenueData,
            },
        ],
        recentOrders: [
            { id: '#8432', product: 'Running Shoes X1', status: 'Shipped' as const },
            { id: '#8431', product: 'Wireless Headphones', status: 'Pending' as const },
            { id: '#8430', product: 'Smart Watch 2.0', status: 'Shipped' as const },
            { id: '#8429', product: 'Organic Coffee Beans', status: 'Shipped' as const },
        ],
        topProducts: [
            { id: '1', name: 'Wireless Headphones', value: '150 sold', image: 'https://picsum.photos/seed/2/100/100', imageHint: 'headphones' },
            { id: '2', name: 'Running Shoes X1', value: '120 sold', image: 'https://picsum.photos/seed/1/100/100', imageHint: 'running shoes' },
            { id: '3', name: 'Smart Watch 2.0', value: '95 sold', image: 'https://picsum.photos/seed/4/100/100', imageHint: 'smart watch' },
        ],
        bestCategories: [
            { id: '1', name: 'Electronics', value: '45% of sales', image: 'https://picsum.photos/seed/6/100/100', imageHint: 'electronic circuit' },
            { id: '2', name: 'Sportswear', value: '30% of sales', image: 'https://picsum.photos/seed/7/100/100', imageHint: 'sportswear' },
            { id: '3', name: 'Home Goods', value: '15% of sales', image: 'https://picsum.photos/seed/8/100/100', imageHint: 'living room' },
        ]
    };
};

const timeRanges = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'This Year',
];

export const dashboardData: Record<string, Omit<typeof allTimeData, 'productAlertsData'>> =
    timeRanges.reduce((acc, range, index) => {
        acc[range] = createConsistentStatData(index + 1, range);
        return acc;
    }, {} as Record<string, Omit<typeof allTimeData, 'productAlertsData'>>);


export const notificationsData: Notification[] = [
  {
    id: '1',
    type: 'new_order',
    title: 'New Order',
    description:
      'Order #2023358996 from Customer Name has been paid. Total: 4 120 PLN',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'inventory_alert',
    title: 'Inventory Alert',
    description: "'Manon Waits Orientnay Pediuns' is low on stock (3 left).",
    timestamp: 'Yesterday',
  },
  {
    id: '3',
    type: 'shipping_update',
    title: 'Shipping Update',
    description: 'Order #20233596876 for Customer Ravs has been shipped.',
    timestamp: 'Yesterday',
  },
  {
    id: '4',
    type: 'message_received',
    title: 'Message Received',
    description: "New message from buyer regarding 'Welconing fiitishe ...",
    timestamp: '2 days ago',
  },
];

const allTimeData = {
    ...createConsistentStatData(1, 'This Year'),
    productAlertsData: [
        { id: '1', title: 'Running Shoes X1', message: 'Low stock: 5 units remaining', image: 'https://picsum.photos/seed/1/100/100', imageHint: 'running shoes', timestamp: '2 minutes ago' },
        { id: '2', title: 'Wireless Headphones', message: 'Price drop alert: now $99', image: 'https://picsum.photos/seed/2/100/100', imageHint: 'headphones', timestamp: '1 hour ago' },
        { id: '3', title: 'Organic Coffee Beans', message: 'Back in stock', image: 'https://picsum.photos/seed/3/100/100', imageHint: 'coffee beans', timestamp: '3 hours ago' },
        { id: '4', title: 'Smart Watch 2.0', message: 'New review posted', image: 'https://picsum.photos/seed/4/100/100', imageHint: 'smart watch', timestamp: '5 hours ago' },
        { id: '5', title: 'Yoga Mat Pro', message: 'Low stock: 8 units remaining', image: 'https://picsum.photos/seed/5/100/100', imageHint: 'yoga mat', timestamp: '1 day ago' },
    ],
};
// Legacy exports for existing components that might not be updated immediately.
export const {
    productAlertsData,
} = allTimeData;
