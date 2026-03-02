import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string; // Add this in your `.env.local`
const options = {};

let client: MongoClient;

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
}

const getClientPromise = (): Promise<MongoClient> => {
    if (process.env.NODE_ENV === "development") {
        // Use global variable for the client in development to prevent multiple instances
        if (!(globalThis as any)._mongoClientPromise) {
            client = new MongoClient(uri, options);
            (globalThis as any)._mongoClientPromise = client.connect();
        }
        return (globalThis as any)._mongoClientPromise;
    } else {
        // In production, create a new client
        client = new MongoClient(uri, options);
        return client.connect();
    }
};

const clientPromise = getClientPromise();

export default clientPromise;
