
export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
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

interface AppState {
  users: User[];
  products: Product[];
  payments: Payment[];
}


export type Action =
  | { type: 'LOAD_DATA'; payload: AppState }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: Payment };