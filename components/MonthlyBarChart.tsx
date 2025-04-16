// components/MonthlyBarChart.tsx
'use client';
import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

type Props = {
  data: { monthLabel: string; totalAmount: number }[];
};

export default function MonthlyBarChart({ data }: Props) {
    console.log("📊 MonthlyBarChart Data:", data);
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthLabel" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalAmount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
