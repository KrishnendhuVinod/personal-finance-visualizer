import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


// GET - Get all transactions
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("personal-finance");
    const collection = db.collection("transactions");

    const transactions = await collection.find({}).toArray();
    return NextResponse.json({ transactions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }
}

// POST - Add a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, date, description } = body;

    const client = await clientPromise;
    const db = client.db("personal-finance");
    const collection = db.collection("transactions");

    const result = await collection.insertOne({ amount, date, description });
    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to insert transaction" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
      const { id } = await request.json();
  
      const client = await clientPromise;
      const db = client.db("personal-finance");
      const collection = db.collection("transactions");
  
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
  
      return NextResponse.json({ success: result.deletedCount === 1 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
  }

  export async function PUT(request: Request) {
    try {
      const { id, amount, date, description } = await request.json();
  
      const client = await clientPromise;
      const db = client.db("personal-finance");
      const collection = db.collection("transactions");
  
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { amount, date, description } }
      );
  
      return NextResponse.json({ success: result.modifiedCount === 1 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
  }

  export async function GET_SUMMARY() {
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

  