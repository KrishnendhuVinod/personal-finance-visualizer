import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const expenses = await db.collection('transactions').aggregate([
      {
        $group: {
          _id: {
            month: { $month: { $toDate: '$date' } }, // converts to Date if needed
            year: { $year: { $toDate: '$date' } },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]).toArray();

    return NextResponse.json({ monthlyExpenses: expenses });
  } catch (error) {
    console.error('❌ Error getting monthly expenses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
