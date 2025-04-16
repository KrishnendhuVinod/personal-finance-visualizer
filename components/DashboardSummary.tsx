"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryPieChart from "./CategoryPieChart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


export default function DashboardSummary() {
  const [summary, setSummary] = useState<any>(null);
  const [monthlyExpenses, setMonthlyExpenses] = useState<any[]>([]);


  useEffect(() => {
    fetch("/api/finance/summary")
      .then(res => res.json())
      .then(data => setSummary(data.data));

      fetch("/api/finance/monthly-expenses")
      .then((res) => res.json())
      .then((data) => setMonthlyExpenses(data.monthlyExpenses));
  }, []);

  if (!summary) return <p>Loading...</p>;
  console.log("Category Breakdown:", summary.categoryBreakdown);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold">₹{summary.total}</p>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent>
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
          <CategoryPieChart
          data={summary.categoryBreakdown.map((item: any) => ({
            category: item._id,
            amount: item.total,
          }))}
        />
      </CardContent>
    </Card>

      <Card className="col-span-3">
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
          <ul className="space-y-2">
            {summary.recentTransactions.map((t: any) => (
              <li key={t._id} className="border p-2 rounded-md">
                <strong>{t.title}</strong>: ₹{t.amount} ({t.category})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
