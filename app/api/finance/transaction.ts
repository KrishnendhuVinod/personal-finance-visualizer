import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb"; // import the client connection

// Define the Transaction interface (adjust fields as per your needs)
interface Transaction {
  amount: number;
  date: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(); // Access the database

  if (req.method === "POST") {
    // Add a new transaction
    const { amount, date, description }: Transaction = req.body;

    try {
      // Insert the new transaction into the 'transactions' collection
      const result = await db.collection("transactions").insertOne({
        amount,
        date,
        description,
      });

      res.status(201).json({ message: "Transaction added", transactionId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add transaction" });
    }
  } else if (req.method === "GET") {
    // Fetch all transactions
    try {
      const transactions = await db.collection("transactions").find({}).toArray();
      res.status(200).json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  } else {
    // Handle any other HTTP methods
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
