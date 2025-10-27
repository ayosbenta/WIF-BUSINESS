
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { UsersIcon, WifiIcon, PaymentIcon } from './icons';
import { Product } from '../types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);


const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { users, products, payments } = state;

  const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);
  const activeUsers = users.filter(user => user.status === 'active').length;

  const data = products.map((product: Product) => ({
    name: product.name,
    users: users.filter(user => user.planId === product.id && user.status === 'active').length,
  }));

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`₱${totalRevenue.toLocaleString()}`} icon={<PaymentIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />} />
        <StatCard title="Active Subscribers" value={activeUsers} icon={<UsersIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />} />
        <StatCard title="Available Plans" value={products.length} icon={<WifiIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />} />
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Subscribers per Plan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-xs" />
            <YAxis tick={{ fill: 'currentColor' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                borderColor: '#4f46e5',
                color: 'white'
              }}
            />
            <Legend />
            <Bar dataKey="users" fill="#4f46e5" name="Active Subscribers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;