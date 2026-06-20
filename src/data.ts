import { RoadmapPhase, Product } from './types';

export const phases: RoadmapPhase[] = [
  {
    id: '01',
    title: 'Foundation',
    timeframe: 'Month 1 (Weeks 1-2)',
    status: 'MVP Shipped',
    items: [
      {
        title: 'Marketplace core',
        description: 'Browse, search, filter with 12 product categories and sort options.',
        status: 'Shipped',
      },
      {
        title: 'Paystack payments',
        description: 'Secure backend API — card, bank transfer, USSD, QR code.',
        status: 'Shipped',
      },
      {
        title: 'Live order tracker',
        description: 'SSE real-time stage updates, animated delivery map, courier info.',
        status: 'Shipped',
      },
      {
        title: 'Security hardening',
        description: 'Helmet, rate limits, HMAC webhooks, input validation, no secret leakage.',
        status: 'Shipped',
      },
      {
        title: 'Sell a part',
        description: 'Full listing form with category, condition, pricing and photo upload.',
        status: 'Shipped',
      },
      {
        title: 'Idempotency & retry',
        description: 'Paystack retries with back-off, idempotency keys prevent double charges.',
        status: 'Shipped',
      },
    ],
  },
  {
    id: '02',
    title: 'Growth',
    timeframe: 'Month 1 (Weeks 3-4)',
    status: 'In Progress',
    items: [
      {
        title: 'User accounts',
        description: 'JWT auth, profiles, order history, saved addresses.',
        status: 'In progress',
      },
      {
        title: 'Wishlist',
        description: 'Save and revisit favourite parts across browser sessions.',
        status: 'In progress',
      },
      {
        title: 'Reviews & ratings',
        description: 'Verified buyer reviews per product with 1-5 star ratings.',
        status: 'Planned',
      },
      {
        title: 'Email notifications',
        description: 'Order confirmation, dispatch alerts and delivery receipt emails.',
        status: 'Planned',
      },
      {
        title: 'Photo uploads',
        description: 'S3-backed image storage for seller listing photos.',
        status: 'Planned',
      },
      {
        title: 'Database — MongoDB',
        description: 'Replace in-memory store with persistent, scalable storage.',
        status: 'Planned',
      },
    ],
  },
  {
    id: '03',
    title: 'Scale',
    timeframe: 'Month 2 (Weeks 1-2)',
    status: 'Planned',
    items: [
      {
        title: 'Mobile app',
        description: 'React Native iOS & Android with push notifications.',
        status: 'Planned',
      },
      {
        title: 'Seller dashboard',
        description: 'Sales analytics, inventory management and payout tracking.',
        status: 'Planned',
      },
      {
        title: 'AI part finder',
        description: 'Describe a part in plain text — AI matches compatible listings.',
        status: 'Planned',
      },
      {
        title: 'Courier integrations',
        description: 'GIG, DHL, Kwik webhooks for automatic real-time tracking updates.',
        status: 'Planned',
      },
      {
        title: 'Escrow payments',
        description: 'Funds held until buyer confirms delivery — fraud protection built in.',
        status: 'Planned',
      },
      {
        title: 'Mechanic marketplace',
        description: 'Book verified mechanics directly, pay in-app with tracking.',
        status: 'Planned',
      },
    ],
  },
  {
    id: '04',
    title: 'Expansion',
    timeframe: 'Month 2 (Weeks 3-4)',
    status: 'Vision',
    items: [
      {
        title: 'West Africa expansion',
        description: "Ghana, Kenya, Cote d'Ivoire — local currencies and logistics.",
        status: 'Planned',
      },
      {
        title: 'Part authenticity QR',
        description: 'Scan a part to verify origin and history on-chain.',
        status: 'Planned',
      },
      {
        title: 'Price intelligence',
        description: 'Market price tracking and alerts when part prices drop.',
        status: 'Planned',
      },
      {
        title: 'B2B wholesale',
        description: 'Bulk pricing, fleet accounts and net payment terms.',
        status: 'Planned',
      },
      {
        title: 'Open API',
        description: 'Third-party integrations for garages, fleet managers and insurers.',
        status: 'Planned',
      },
      {
        title: 'VIN / plate lookup',
        description: 'Enter a plate number — see all compatible parts instantly.',
        status: 'Planned',
      },
    ],
  }
];

export const categories = [
    'Engine', 'Brakes', 'Suspension', 'Electrical', 'Filters', 'Body Parts',
    'Lighting', 'Transmission', 'Exhaust', 'Cooling System',
    'Wheels & Tires', 'Interior Accessories'
];

export const mockProducts: Product[] = [
    {
        id: 'p0',
        name: 'V6 Engine Block (3.5L)',
        category: 'Engine',
        price: 850000,
        condition: 'Used',
        conditionGrade: 'Grade B (Good)',
        image: 'https://images.unsplash.com/photo-1590587754341-1185b3bd2a47?auto=format&fit=crop&q=80&w=400',
        rating: 4.8,
        reviews: 14
    },
    {
        id: 'p1',
        name: 'Premium Ceramic Brake Pads Set',
        category: 'Brakes',
        price: 25500,
        condition: 'New',
        conditionGrade: 'Premium Aftermarket',
        image: 'https://images.unsplash.com/photo-1627883216892-0b1a0ce3b7de?auto=format&fit=crop&q=80&w=400',
        rating: 4.8,
        reviews: 124
    },
    {
        id: 'p2',
        name: 'OEM Synthetic Oil Filter',
        category: 'Filters',
        price: 4500,
        condition: 'New',
        conditionGrade: 'OEM Equivalent',
        image: 'https://images.unsplash.com/photo-1635769747971-ce4cdfc9f3b5?auto=format&fit=crop&q=80&w=400',
        rating: 4.9,
        reviews: 310
    },
    {
        id: 'p3',
        name: 'High Output Alternator 130A',
        category: 'Electrical',
        price: 85000,
        condition: 'Refurbished',
        conditionGrade: 'Grade A (Excellent)',
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0545f1?auto=format&fit=crop&q=80&w=400',
        rating: 4.5,
        reviews: 42
    },
    {
        id: 'p4',
        name: 'Performance Ignition Coil',
        category: 'Electrical',
        price: 18000,
        condition: 'New',
        conditionGrade: 'Performance Aftermarket',
        image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=400',
        rating: 4.7,
        reviews: 89
    },
    {
        id: 'p5',
        name: 'Front Bumper Cover Assembly',
        category: 'Body Parts',
        price: 145000,
        condition: 'Used',
        conditionGrade: 'Grade C (Fair)',
        image: 'https://images.unsplash.com/photo-1577783935815-534ebd3cdec3?auto=format&fit=crop&q=80&w=400',
        rating: 4.1,
        reviews: 12
    },
    {
        id: 'p6',
        name: 'Halogen Headlight Bulb H11',
        category: 'Lighting',
        price: 6500,
        condition: 'New',
        conditionGrade: 'OEM Replacement',
        image: 'https://images.unsplash.com/photo-1615829671913-9a3d463d1ed5?auto=format&fit=crop&q=80&w=400',
        rating: 4.4,
        reviews: 215
    },
];
