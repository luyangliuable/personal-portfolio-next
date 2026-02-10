import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {};

const clientPromise: Promise<MongoClient> = (() => {
    if (process.env.NODE_ENV === "development") {
        // Use global variable for the client in development to prevent multiple instances
        if (!(globalThis as any)._mongoClientPromise) {
            const client = new MongoClient(uri, options);
            (globalThis as any)._mongoClientPromise = client.connect();
        }
        return (globalThis as any)._mongoClientPromise;
    } else {
        // In production, create a new client
        const client = new MongoClient(uri, options);
        return client.connect();
    }
})();

export default clientPromise;
