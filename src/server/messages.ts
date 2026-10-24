import { getCollection } from "./db";
import { COLLECTIONS } from "./documents";
import { insertOneResult } from "./http";
import { MESSAGE, USER_MESSAGE_TYPE } from "./models";
import { fromJson } from "./schema";
import { rustDateNow } from "./rustDate";

export async function insertMessage(body: unknown): Promise<unknown> {
    const message = fromJson(body, MESSAGE);
    message.date_created = rustDateNow();
    message.message_type = USER_MESSAGE_TYPE;
    const collection = await getCollection(COLLECTIONS.message);
    return insertOneResult(await collection.insertOne(message));
}
