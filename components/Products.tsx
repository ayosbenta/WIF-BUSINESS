import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import Modal from './ui/Modal';
import { PlusIcon, EditIcon, DeleteIcon, SparklesIcon, WifiIcon } from './icons';
import { generatePlanDescription } from '../services/geminiService';
import { api } from '../services/api';

const ProductForm: React.FC<{ product?: Product; onSave: (product: Product | Omit<Product, 'id'>) => void; onCancel: () => void; isSaving: boolean; }> = ({ product, onSave, onCancel, isSaving }) => {
    const [name, setName] = useState(product?.name || '');
    const [speed, setSpeed] = useState(product?.speed || 0);
    const [price, setPrice] = useState(product?.price || 0);
    const [description, setDescription] = useState(product?.description || '');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateDescription = async () => {
        if (!name || !speed || !price) {
            alert('Please fill in Plan Name, Speed, and Price first.');
            return;
        }
        setIsGenerating(true);
        try {
            const generatedDesc = await generatePlanDescription(name, speed, price);
            setDescription(generatedDesc);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            id: product?.id,
            name,
            speed,
            price,
            description,
        };
        if (product) {
            onSave(productData as Product);
        } else {
            const { id, ...newProductPayload } = productData;
            onSave(newProductPayload);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Plan Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Speed (Mbps)</label>
                    <input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Price (₱)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                 <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="mt-2 flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 disabled:opacity-50">
                    <SparklesIcon className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? 'Saving...' : 'Save Plan'}
                </button>
            </div>
        </form>
    );
};

const Products: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const handleOpenModal = (product?: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(false);
    };

    const handleSaveProduct = async (productData: Product | Omit<Product, 'id'>) => {
        setIsSaving(true);
        try {
            if ('id' in productData && productData.id) {
                const updatedProduct = await api.updateProduct(productData as Product);
                dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
            } else {
                const newProduct = await api.addProduct(productData as Omit<Product, 'id'>);
                dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save product:", error);
            alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this plan? This will not affect existing users on this plan.')) {
            try {
                await api.deleteProduct(productId);
                dispatch({ type: 'DELETE_PRODUCT', payload: productId });
            } catch (error) {
                console.error("Failed to delete product:", error);
                alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`);
            }
        }
    };
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                 <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-lg">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Plan
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.products.map(product => (
                    <div key={product.id} className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center mb-2">
                                <WifiIcon className="h-6 w-6 text-indigo-500 mr-2"/>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{product.name}</h3>
                            </div>
                            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">
                                {product.speed}<span className="text-sm font-medium text-slate-500 dark:text-slate-400">Mbps</span>
                            </p>
                             <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm h-12">{product.description}</p>
                            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">₱{product.price.toLocaleString()}/month</p>
                        </div>
                        <div className="flex justify-end items-center space-x-2 border-t dark:border-slate-700 pt-4 mt-4">
                            <button onClick={() => handleOpenModal(product)} className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-full"><EditIcon className="h-5 w-5" /></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-slate-700 rounded-full"><DeleteIcon className="h-5 w-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Edit Plan' : 'Add New Plan'}>
                <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={handleCloseModal} isSaving={isSaving} />
            </Modal>
        </div>
    );
};

export default Products;