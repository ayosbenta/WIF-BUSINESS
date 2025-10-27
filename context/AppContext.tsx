import React, { createContext, useReducer, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { User, Product, Payment } from '../types';
import { api } from '../services/api';

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

const initialState: AppState = {
  users: [],
  products: [],
  payments: [],
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
        return {
            ...state,
            products: state.products.map((product) => (product.id === action.payload.id ? action.payload : product)),
        };
    case 'DELETE_PRODUCT':
        return {
            ...state,
            products: state.products.filter((product) => product.id !== action.payload),
        };
    case 'ADD_PAYMENT':
        return { ...state, payments: [action.payload, ...state.payments] };
    default:
      return state;
  }
};

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
    isLoading: boolean;
    error: string | null;
    reloadData: () => void;
}

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
  isLoading: true,
  error: null,
  reloadData: () => {},
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const data = await api.getAllData();
        dispatch({ type: 'LOAD_DATA', payload: data });
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <AppContext.Provider value={{ state, dispatch, isLoading, error, reloadData: fetchData }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);