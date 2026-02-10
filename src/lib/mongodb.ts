import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI && process.env.NODE_ENV !== "test") {
    console.warn("MongoDB URI not found in environment variables");
}

if (process.env.NODE_ENV === "development") {
    // Use global variable for the client in development to prevent multiple instances
    if (!(globalThis as any)._mongoClientPromise) {
        client = new MongoClient(uri, options);
        (globalThis as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (globalThis as any)._mongoClientPromise;
} else {
    // In production, create a new client
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
