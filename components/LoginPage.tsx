import React, { useState } from 'react';
import { WifiIcon } from './icons';
import { UserRole } from '../App';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setError('');
      onLoginSuccess('admin');
    } else if (username === 'collector' && password === 'collector') {
        setError('');
        onLoginSuccess('collector');
    }
    else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl dark:bg-slate-800 transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
                <WifiIcon className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h1 className="ml-3 text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    WiFiNet
                </h1>
            </div>
          <h2 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Dashboard Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username-address" className="sr-only">
                Username
              </label>
              <input
                id="username-address"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username (admin/collector)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-500 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (admin/collector)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;