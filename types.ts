
export interface User {
  id: string;
  name: string;
  email: string;
  planId: string | null;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

export interface Product {
  id: string;
  name: string;
  speed: number; // in MBPS
  price: number; // in local currency
  description: string;
}

export enum PaymentMethod {
  CASH = 'Cash',
  GCASH = 'GCash',
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}
