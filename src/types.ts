export type PhaseId = '01' | '02' | '03' | '04';
export type PhaseStatus = 'MVP Shipped' | 'In Progress' | 'Planned' | 'Vision';

export interface RoadmapItem {
  title: string;
  description: string;
  status: 'Shipped' | 'In progress' | 'Planned';
}

export interface RoadmapPhase {
  id: PhaseId;
  title: string;
  timeframe: string;
  status: PhaseStatus;
  items: RoadmapItem[];
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    condition: 'New' | 'Used' | 'Refurbished';
    conditionGrade?: string;
    image: string;
    rating: number;
    reviews: number;
}
