import { User, Product, Payment } from '../types';

// IMPORTANT: Replace this with your own deployed Google Apps Script URL.
// FIX: Widened the type to string to resolve comparison error on line 14.
const APPS_SCRIPT_URL: string = 'https://script.google.com/macros/s/AKfycbzinXgRPFJzzoa7bPOOiq6YLV552hdimavf34ALMcQYaSL-0bxTr7FPJ5FdYifMC2LIog/exec';

interface AppData {
    users: User[];
    products: Product[];
    payments: Payment[];
}

// Helper function to handle API requests
async function performRequest(action: string, payload?: any) {
    if (APPS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' || !APPS_SCRIPT_URL) {
        throw new Error("Please replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' in services/api.ts with your actual Google Apps Script URL.");
    }

    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Required for Apps Script
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    if (result.status === 'error') {
        throw new Error(result.message);
    }
    return result.data;
}


export const api = {
    /**
     * Fetches all initial data from the Google Sheet.
     */
    getAllData: (): Promise<AppData> => {
        return performRequest('GET_ALL_DATA');
    },

    /**
     * Sends a command to add a new user to the sheet.
     * @param userPayload The new user data (without id and joinDate).
     * @returns The newly created user with id and joinDate from the backend.
     */
    addUser: (userPayload: Omit<User, 'id' | 'joinDate'>): Promise<User> => {
        return performRequest('ADD_USER', userPayload);
    },

    /**
     * Sends a command to update an existing user.
     * @param user The full user object with updated data.
     */
    updateUser: (user: User): Promise<User> => {
        return performRequest('UPDATE_USER', user);
    },

    /**
     * Sends a command to delete a user by their ID.
     * @param userId The ID of the user to delete.
     */
    deleteUser: (userId: string): Promise<{ id: string }> => {
        return performRequest('DELETE_USER', { id: userId });
    },

    /**
     * Sends a command to add a new product.
     * @param productPayload The new product data (without id).
     * @returns The newly created product with an id from the backend.
     */
    addProduct: (productPayload: Omit<Product, 'id'>): Promise<Product> => {
        return performRequest('ADD_PRODUCT', productPayload);
    },

    /**
     * Sends a command to update an existing product.
     * @param product The full product object with updated data.
     */
    updateProduct: (product: Product): Promise<Product> => {
        return performRequest('UPDATE_PRODUCT', product);
    },

    /**
     * Sends a command to delete a product by its ID.
     * @param productId The ID of the product to delete.
     */
    deleteProduct: (productId: string): Promise<{ id: string }> => {
        return performRequest('DELETE_PRODUCT', { id: productId });
    },

    /**
     * Sends a command to add a new payment.
     * @param paymentPayload The new payment data (without id and date).
     * @returns The newly created payment with id and date from the backend.
     */
    addPayment: (paymentPayload: Omit<Payment, 'id' | 'date'>): Promise<Payment> => {
        return performRequest('ADD_PAYMENT', paymentPayload);
    },
};

// Keep export functionality for local backups
declare var XLSX: any;
export const dataService = {
    exportToFile: (data: AppData, filename: string = 'wifi_business_data.xlsx'): void => {
        try {
            const usersSheet = XLSX.utils.json_to_sheet(data.users);
            const productsSheet = XLSX.utils.json_to_sheet(data.products);
            const paymentsSheet = XLSX.utils.json_to_sheet(data.payments);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');
            XLSX.utils.book_append_sheet(workbook, productsSheet, 'Products');
            XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Payments');

            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error("Error exporting data to Excel:", error);
            alert("An error occurred while trying to export the data.");
        }
    }
};