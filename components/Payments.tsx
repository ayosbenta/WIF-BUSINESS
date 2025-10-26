import React, { useState, useMemo, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Payment, PaymentMethod, User, Product } from '../types';
import Modal from './ui/Modal';
import { PlusIcon, PrintIcon, WifiIcon } from './icons';
import { api } from '../services/api';

const GcashModalContent: React.FC<{ amount: number; onConfirm: () => void }> = ({ amount, onConfirm }) => (
    <div className="text-center">
        <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Pay with GCash</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Scan the QR code below to pay ₱{amount.toLocaleString()}.</p>
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GCashPaymentForAmount${amount}`} alt="GCash QR Code" className="mx-auto my-4 rounded-lg" />
        <p className="text-xs text-slate-400">This is a simulated QR code for demonstration purposes.</p>
        <button onClick={onConfirm} className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Confirm Payment
        </button>
    </div>
);

const PaymentForm: React.FC<{ onSave: (payment: Omit<Payment, 'id'>) => Promise<void>; onCancel: () => void }> = ({ onSave, onCancel }) => {
    const { state } = useAppContext();
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [isGcashModalOpen, setIsGcashModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const selectedUser = useMemo(() => state.users.find(u => u.id === userId), [userId, state.users]);
    const userPlan = useMemo(() => state.products.find(p => p.id === selectedUser?.planId), [selectedUser, state.products]);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserId = e.target.value;
        setUserId(selectedUserId);
        const user = state.users.find(u => u.id === selectedUserId);
        const plan = state.products.find(p => p.id === user?.planId);
        setAmount(plan?.price || 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || amount <= 0) {
            alert('Please select a user and enter a valid amount.');
            return;
        }

        if (method === PaymentMethod.GCASH) {
            setIsGcashModalOpen(true);
        } else {
            confirmPayment();
        }
    };
    
    const confirmPayment = async () => {
        setIsProcessing(true);
        const newPayment = {
            userId,
            amount,
            method,
            date: new Date().toISOString().split('T')[0],
        };
        try {
            await onSave(newPayment);
            setIsGcashModalOpen(false);
        } catch(error) {
            console.error("Failed to save payment", error);
        } finally {
            setIsProcessing(false);
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">User</label>
                <select value={userId} onChange={handleUserChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="">Select a user</option>
                    {state.users.filter(u => u.status === 'active').map((user: User) => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Amount (₱)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                 {userPlan && <p className="text-xs text-slate-500 mt-1">Plan "{userPlan.name}" costs ₱{userPlan.price}.</p>}
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value={PaymentMethod.CASH}>Cash</option>
                    <option value={PaymentMethod.GCASH}>GCash</option>
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                    {isProcessing ? 'Processing...' : 'Process Payment'}
                </button>
            </div>
        </form>
        <Modal isOpen={isGcashModalOpen} onClose={() => setIsGcashModalOpen(false)} title="GCash Payment">
            <GcashModalContent amount={amount} onConfirm={confirmPayment} />
        </Modal>
        </>
    );
};

const ReceiptContent: React.FC<{ payment: Payment; user?: User; product?: Product; }> = ({ payment, user, product }) => (
    <div className="p-4 text-slate-800">
        <div className="text-center mb-6 pb-4 border-b">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center justify-center"><WifiIcon className="h-6 w-6 mr-2" /> WiFiNet</h1>
            <p className="text-sm text-slate-500">123 Internet Lane, Web City</p>
        </div>
        <h2 className="text-xl font-semibold uppercase text-center mb-4">Receipt</h2>
        
        <div className="flex flex-col sm:flex-row justify-between text-sm mb-6 space-y-4 sm:space-y-0">
            <div>
                <p className="font-bold">Billed To:</p>
                <p>{user?.name}</p>
                <p>{user?.email}</p>
            </div>
            <div className="text-left sm:text-right">
                <p><span className="font-bold">Receipt #:</span> {payment.id}</p>
                <p><span className="font-bold">Date:</span> {payment.date}</p>
            </div>
        </div>
        <table className="w-full text-left text-sm mb-6">
            <thead className="border-b bg-slate-50">
                <tr>
                    <th className="p-2">Description</th>
                    <th className="p-2 text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr className="border-b">
                    <td className="p-2">{product?.name || 'Service Payment'} ({product?.speed}Mbps)</td>
                    <td className="p-2 text-right">₱{payment.amount.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
        <div className="flex justify-end text-sm">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₱{payment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total Paid:</span>
                    <span>₱{payment.amount.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between text-xs">
                    <span>Payment Method:</span>
                    <span>{payment.method}</span>
                </div>
            </div>
        </div>
        <div className="text-center text-xs text-slate-500 mt-8">
            <p>Thank you for your business!</p>
        </div>
    </div>
);


const Payments: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
    const receiptRef = useRef<HTMLDivElement>(null);

    const handleSavePayment = async (paymentData: Omit<Payment, 'id'>) => {
        const newPayment = await api.addPayment(paymentData);
        dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
        setIsModalOpen(false);
    };

    const handlePrint = () => {
        const printContent = receiptRef.current?.innerHTML;
        if (printContent) {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);
            
            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write('<html><head><title>Print Receipt</title>');
                doc.write('<script src="https://cdn.tailwindcss.com"></script>');
                doc.write('</head><body style="font-family: sans-serif;" onload="window.focus(); window.print()">');
                doc.write(printContent);
                doc.write('</body></html>');
                doc.close();
            }

            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 500);
        }
    };

    const selectedUserForReceipt = useMemo(() => state.users.find(u => u.id === receiptPayment?.userId), [receiptPayment, state.users]);
    const selectedProductForReceipt = useMemo(() => state.products.find(p => p.id === selectedUserForReceipt?.planId), [selectedUserForReceipt, state.products]);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-lg">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    New Payment
                </button>
            </div>
            
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
                {state.payments.map(payment => {
                    const user = state.users.find(u => u.id === payment.userId);
                    return (
                    <div key={payment.id} className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-slate-900 dark:text-white">{user?.name || 'Unknown User'}</p>
                                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">₱{payment.amount.toLocaleString()}</p>
                            </div>
                             <button onClick={() => setReceiptPayment(payment)} className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full" aria-label="Print receipt">
                                <PrintIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-4 pt-4 border-t dark:border-slate-700 flex justify-between items-center text-sm">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${payment.method === PaymentMethod.GCASH ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                                {payment.method}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">{payment.date}</span>
                        </div>
                    </div>
                )})}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Amount</th>
                            <th scope="col" className="px-6 py-3">Method</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.payments.map(payment => {
                            const user = state.users.find(u => u.id === payment.userId);
                            return (
                                <tr key={payment.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{user?.name || 'Unknown User'}</td>
                                    <td className="px-6 py-4">₱{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${payment.method === PaymentMethod.GCASH ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                                            {payment.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{payment.date}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setReceiptPayment(payment)} className="p-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400" aria-label="Print receipt">
                                            <PrintIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Process New Payment">
                <PaymentForm onSave={handleSavePayment} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={!!receiptPayment} onClose={() => setReceiptPayment(null)} title="Payment Receipt">
                {receiptPayment && (
                    <div>
                        <div ref={receiptRef} className="bg-white">
                           <ReceiptContent payment={receiptPayment} user={selectedUserForReceipt} product={selectedProductForReceipt} />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                           <button type="button" onClick={() => setReceiptPayment(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500">Close</button>
                           <button type="button" onClick={handlePrint} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                <PrintIcon className="h-5 w-5 mr-2" />
                                Print Receipt
                           </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Payments;
