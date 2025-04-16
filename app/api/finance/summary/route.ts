// app/api/finance/summary/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("personal-finance");
    const collection = db.collection("transactions");

    // Get total expenses
    const totalExpenses = await collection.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();

    // Get category breakdown
    const categoryBreakdown = await collection.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } }
    ]).toArray();

    // Get recent transactions (limit to 5)
    const recentTransactions = await collection.find().sort({ date: -1 }).limit(5).toArray();

    return NextResponse.json({
      data: {
        total: totalExpenses[0]?.total || 0,
        categoryBreakdown,
        recentTransactions,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch summary data" }, { status: 500 });
  }
}
