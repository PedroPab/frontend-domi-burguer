export interface PointsTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'redeemed';
  description: string;
  createdAt: string;
}

export interface PointsSummary {
  total: number;
  transactions: PointsTransaction[];
}
