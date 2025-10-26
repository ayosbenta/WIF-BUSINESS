import { User, Product, Payment, PaymentMethod } from '../types';

// --- MOCK DATABASE ---
// This simulates a backend database. In a real application, these functions
// would make HTTP requests to a server-side API.

let users: User[] = [
    { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', planId: 'prod-1', status: 'active', joinDate: '2023-01-15' },
    { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', planId: 'prod-2', status: 'active', joinDate: '2023-02-20' },
    { id: 'user-3', name: 'Peter Jones', email: 'peter.jones@example.com', planId: 'prod-3', status: 'inactive', joinDate: '2023-03-10' },
];

let products: Product[] = [
    { id: 'prod-1', name: 'Starter Plan', speed: 10, price: 999, description: 'Perfect for browsing and social media. Enjoy seamless connectivity for your daily needs.' },
    { id: 'prod-2', name: 'Family Plan', speed: 50, price: 1499, description: 'Ideal for streaming HD movies and online gaming. Connect multiple devices without slowdowns.' },
    { id: 'prod-3', name: 'Pro Plan', speed: 100, price: 2499, description: 'Ultimate speed for professionals and gamers. Experience lightning-fast downloads and uploads.' },
];

let payments: Payment[] = [
    { id: 'pay-1', userId: 'user-1', amount: 999, date: '2024-05-01', method: PaymentMethod.GCASH },
    { id: 'pay-2', userId: 'user-2', amount: 1499, date: '2024-05-03', method: PaymentMethod.CASH },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- API FUNCTIONS ---

export const api = {
    // Fetch all data
    getInitialData: async () => {
        await simulateDelay(500);
        return {
            users: [...users],
            products: [...products],
            payments: [...payments],
        };
    },
    // User CRUD
    addUser: async (user: Omit<User, 'id' | 'joinDate'>): Promise<User> => {
        await simulateDelay(300);
        const newUser: User = {
            ...user,
            id: `user-${Date.now()}`,
            joinDate: new Date().toISOString().split('T')[0],
        };
        users.push(newUser);
        return newUser;
    },
    updateUser: async (user: User): Promise<User> => {
        await simulateDelay(300);
        users = users.map(u => u.id === user.id ? user : u);
        return user;
    },
    deleteUser: async (userId: string): Promise<string> => {
        await simulateDelay(300);
        users = users.filter(u => u.id !== userId);
        return userId;
    },
    // Product CRUD
    addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
        await simulateDelay(300);
        const newProduct: Product = { ...product, id: `prod-${Date.now()}` };
        products.push(newProduct);
        return newProduct;
    },
    updateProduct: async (product: Product): Promise<Product> => {
        await simulateDelay(300);
        products = products.map(p => p.id === product.id ? product : p);
        return product;
    },
    deleteProduct: async (productId: string): Promise<string> => {
        await simulateDelay(300);
        products = products.filter(p => p.id !== productId);
        return productId;
    },
    // Payment
    addPayment: async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
        await simulateDelay(300);
        const newPayment: Payment = { ...payment, id: `pay-${Date.now()}` };
        payments.push(newPayment);
        return newPayment;
    },
};
