import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { MailIcon } from './icons';

interface DueDateInfo {
    user: User;
    planName: string;
    amountDue: number;
    dueDate: string; // This will hold the calculated next due date
    dayDiff: number; // For sorting
}

const DueDates: React.FC = () => {
    const { state } = useAppContext();
    const { users, products, payments } = state;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day for accurate day difference calculation
    
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed, so add 1

    const usersWithDueDates: DueDateInfo[] = users
        .filter(user => user.status === 'active' && user.planId && user.joinDate)
        .map(user => {
            const plan = products.find(p => p.id === user.planId);

            // Calculate the user's next due date based on their joinDate's day of the month
            const joinDate = new Date(user.joinDate);
            const dueDay = joinDate.getDate();

            let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dueDay);
            nextDueDate.setHours(0, 0, 0, 0);

            // If this month's due date has already passed, the next one is next month
            if (today > nextDueDate) {
                nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            }
            
            const timeDiff = nextDueDate.getTime() - today.getTime();
            const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24)); // Use round for cleaner integer days

            return {
                user,
                planName: plan?.name || 'N/A',
                amountDue: plan?.price || 0,
                dueDate: nextDueDate.toISOString().split('T')[0],
                dayDiff: dayDiff,
            };
        })
        .filter(info => {
            // Condition 1: Is the payment due in the next 3 days?
            const isDueSoon = info.amountDue > 0 && info.dayDiff >= 0 && info.dayDiff <= 3;
            if (!isDueSoon) {
                return false;
            }

            // Condition 2: Has the user already paid this month?
            const hasPaidThisMonth = payments.some(payment => {
                if (payment.userId !== info.user.id) {
                    return false;
                }
                const paymentDate = new Date(payment.date);
                // Check if the payment was made in the current calendar month and year
                return paymentDate.getFullYear() === currentYear && (paymentDate.getMonth() + 1) === currentMonth;
            });
            
            // Only include users who are due soon AND have NOT paid this month.
            return !hasPaidThisMonth;
        })
        .sort((a, b) => a.dayDiff - b.dayDiff); // Sort by the soonest due date

    const handleSendReminder = (userInfo: DueDateInfo) => {
        const companyName = "WiFiNet";
        const { user, amountDue, dueDate } = userInfo;

        const subject = `Your ${companyName} Bill is Due Soon`;
        const body = `Hello ${user.name},\n\nThis is a friendly reminder from ${companyName} that your monthly payment of ₱${amountDue.toLocaleString()} is due on ${dueDate}.\n\nPlease make your payment on or before the due date to avoid service interruption.\n\nThank you,\nThe ${companyName} Team`;

        const mailtoLink = `mailto:${user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoLink;
    };

    if (usersWithDueDates.length === 0) {
        return (
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">No Due Dates Upcoming</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">All upcoming payments for the next 3 days have been settled.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">User</th>
                        <th scope="col" className="px-6 py-3">Plan</th>
                        <th scope="col" className="px-6 py-3">Amount Due</th>
                        <th scope="col" className="px-6 py-3">Due Date</th>
                        <th scope="col" className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {usersWithDueDates.map(userInfo => (
                        <tr key={userInfo.user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                {userInfo.user.name}
                                <div className="text-xs text-slate-500">{userInfo.user.email}</div>
                            </td>
                            <td className="px-6 py-4">{userInfo.planName}</td>
                            <td className="px-6 py-4">₱{userInfo.amountDue.toLocaleString()}</td>
                            <td className="px-6 py-4">{userInfo.dueDate}</td>
                            <td className="px-6 py-4 text-center">
                                <button 
                                    onClick={() => handleSendReminder(userInfo)} 
                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 dark:bg-slate-700 dark:text-indigo-400 dark:hover:bg-slate-600"
                                    aria-label={`Send reminder to ${userInfo.user.name}`}
                                >
                                    <MailIcon className="h-4 w-4 mr-1.5" />
                                    Send Reminder
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DueDates;