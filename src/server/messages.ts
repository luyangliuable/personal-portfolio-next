import { getCollection } from "./db";
import { COLLECTIONS, normalizeDocument, withoutId } from "./documents";
import { HttpError, insertOneResult } from "./http";

const DATE_FIELDS = ["date_created"];
const OID_FIELDS = ["_id"];

/** MessageType::UserMessage serializes to "USERMESSAGE" (serde UPPERCASE). */
export const USER_MESSAGE_TYPE = "USERMESSAGE";

export async function insertMessage(
    body: Record<string, unknown>,
): Promise<unknown> {
    const document = withoutId(
        normalizeDocument(body, {
            dateFields: DATE_FIELDS,
            oidFields: OID_FIELDS,
        }),
    );
    document.date_created = new Date();
    document.message_type = USER_MESSAGE_TYPE;
    const collection = await getCollection(COLLECTIONS.message);
    try {
        const result = await collection.insertOne(document);
        return insertOneResult(result);
    } catch {
        throw new HttpError(400);
    }
}
