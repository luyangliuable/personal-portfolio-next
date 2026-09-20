import type { Db } from "mongodb";
import clientPromise from "@/lib/mongodb";

export const RUST_DB_NAME = "rustDB";

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(RUST_DB_NAME);
}

export async function getCollection(name: string) {
    const db = await getDb();
    return db.collection(name);
}
