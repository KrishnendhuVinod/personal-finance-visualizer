import { MongoClient } from "mongodb";

// Ensure MONGODB_URI is defined in .env.local
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {}; // Optional options for connection

// Declare a global variable to hold the MongoClient promise
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use the global MongoClient promise to avoid multiple connections
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri!, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new connection
  const client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

// Make sure to wait for the connection before accessing `db`
clientPromise.then((client) => {
  const db = client.db(); // Access the MongoDB db here
  
  if (db) {
    console.log("Connected to DB:", db.databaseName);
  } else {
    console.error("Database connection is undefined.");
  }
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

export default clientPromise;
