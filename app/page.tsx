'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import "./globals.css";
import TimeComponent from '@/components/TimeComponent';
import MonthlyBarChart from '@/components/MonthlyBarChart';

type Transaction = {
  _id?: string;
  amount: number;
  date: string;
  description: string;
};

type MonthlyExpense = {
  _id: {
    month: number;
    year: number;
  };
  totalAmount: number;
};

type MonthlyChartData = {
  monthLabel: string;
  totalAmount: number;
};

const categoryOptions = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Other'];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyChartData[]>([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [category, setCategory] = useState('');


  useEffect(() => {
    setHasMounted(true);
    fetchTransactions();
    fetchMonthlyExpenses();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/finance');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
  
      if (!Array.isArray(data.transactions)) {
        throw new Error('Fetched data is not an array');
      }
  
      setTransactions(data.transactions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const fetchMonthlyExpenses = async () => {
    try {
      const res = await fetch('/api/finance/monthly-expenses');
      if (!res.ok) throw new Error('Failed to fetch monthly expenses');
  
      const data = await res.json();
      console.log("Full API Response:", data);
  
      // Handle both cases: either data is an object with 'monthlyExpenses', or directly the array
      const monthlyData = Array.isArray(data) ? data : data.monthlyExpenses;
  
      if (!monthlyData || !Array.isArray(monthlyData)) {
        console.error("Invalid monthly expenses format:", data);
        setIsLoading(false);
        return;
      }
  
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
      const withLabels: MonthlyChartData[] = monthlyData.map((item: MonthlyExpense) => ({
        monthLabel: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        totalAmount: item.totalAmount,
      }));
  
      console.log("Parsed Monthly Chart Data:", withLabels);
      setMonthlyExpenses(withLabels);
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!date) {
      alert('Please enter a valid date');
      return;
    }
    if (!description || description.length < 3) {
      alert('Description must be at least 3 characters long');
      return;
    }

    const res = await fetch('/api/finance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), date, description, category, }),
    });

    if (res.ok) {
      setAmount('');
      setDate('');
      setDescription('');
      fetchTransactions();
      fetchMonthlyExpenses(); // Refresh chart
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      const res = await fetch('/api/finance', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(transactions.filter((t) => t._id !== id));
        fetchMonthlyExpenses(); // Refresh chart
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleEdit = (id: string | undefined) => {
    if (!id) return;
    const tx = transactions.find((t) => t._id === id);
    if (tx) {
      setEditTransaction(tx);
      setAmount(tx.amount.toString());
      setDate(tx.date);
      setDescription(tx.description);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTransaction?._id) {
      const res = await fetch('/api/finance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editTransaction._id,
          amount: Number(amount),
          date,
          description,
          category, 
        }),
      });

      if (res.ok) {
        setAmount('');
        setDate('');
        setDescription('');
        setEditTransaction(null);
        fetchTransactions();
        fetchMonthlyExpenses(); // Refresh chart
      }
    }
  };

  if (!hasMounted || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          style={{ width: 'auto', height: 'auto' }}
          priority
        />

        {/* Add/Edit Form */}
        <div className="w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">{editTransaction ? '✏️ Edit Transaction' : '💸 Add Transaction'}</h1>
          <form onSubmit={editTransaction ? handleUpdate : handleSubmit} className="space-y-4 mb-6">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editTransaction ? 'Update' : 'Add'}
            </button>
          </form>

          <h2 className="text-lg font-semibold mb-2">📜 Transactions</h2>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((tx) => (
                <li key={tx._id} className="border p-2 rounded shadow">
                  <div>💰 ₹{tx.amount}</div>
                  <div>📅 {tx.date}</div>
                  <div>📝 {tx.description}</div>
                  <button className="text-yellow-500 underline mt-2" onClick={() => handleEdit(tx._id)}>Edit</button>
                  <button className="text-red-500 underline mt-2 ml-2" onClick={() => handleDelete(tx._id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Monthly Expense Chart */}
        <h2 className="text-lg font-semibold mb-2">📊 Monthly Expenses</h2>
        <div style={{ width: '100%', height: 400 }}>
          <MonthlyBarChart data={monthlyExpenses} />
        </div>
        <TimeComponent />
      </main>
    </div>
  );
}
