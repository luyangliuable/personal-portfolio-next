import type { Document, ObjectId } from "mongodb";
import { ObjectId as MongoObjectId } from "mongodb";
import { getCollection } from "./db";
import { COLLECTIONS, normalizeDocument, withoutId } from "./documents";
import { HttpError, requireObjectId } from "./http";
import {
    USER_ROLE_USER,
    hashPassword,
    newSessionToken,
    verifyPassword,
} from "./user";

export interface SessionToken {
    userid: string;
    session_token: string;
}

async function findUser(
    filter: Record<string, unknown>,
): Promise<Document | null> {
    const collection = await getCollection(COLLECTIONS.user);
    return collection.findOne(filter);
}

export async function getUserFromCookie(
    userId: string | undefined,
): Promise<{ username: string }> {
    if (!userId) throw new HttpError(404);
    const objectId = requireObjectId(userId, 400);
    const user = await findUser({ _id: objectId });
    if (!user) throw new HttpError(404);
    return { username: user.username as string };
}

export async function createUser(
    body: Record<string, unknown>,
): Promise<SessionToken> {
    const document = withoutId(
        normalizeDocument(body, {
            dateFields: ["session_token_created_date"],
            oidFields: ["_id"],
        }),
    );
    document.password = hashPassword(String(document.password ?? ""));
    document.role = USER_ROLE_USER;
    const sessionToken = newSessionToken();
    document.session_token = sessionToken;
    document.session_token_created_date = new Date();

    const collection = await getCollection(COLLECTIONS.user);
    try {
        const result = await collection.insertOne(document);
        return {
            userid: String(result.insertedId),
            session_token: sessionToken,
        };
    } catch {
        throw new HttpError(500);
    }
}

async function updateSessionToken(userid: string): Promise<SessionToken> {
    const objectId: ObjectId = requireObjectId(userid, 500);
    const sessionToken = newSessionToken();
    const collection = await getCollection(COLLECTIONS.user);
    try {
        await collection.updateOne(
            { _id: objectId },
            { $set: { session_token: sessionToken } },
            { upsert: true },
        );
    } catch {
        throw new HttpError(500);
    }
    return { userid, session_token: sessionToken };
}

export async function login(
    body: Record<string, unknown>,
): Promise<SessionToken> {
    const email = body.email;
    const username = body.username;
    const password = String(body.password ?? "");

    let user: Document | null = null;
    if (typeof email === "string" && email.length > 0) {
        user = await findUser({ email });
    } else if (typeof username === "string" && username.length > 0) {
        user = await findUser({ username });
    } else {
        throw new HttpError(500);
    }

    if (!user) throw new HttpError(401);

    let valid: boolean;
    try {
        valid = verifyPassword(password, String(user.password));
    } catch {
        throw new HttpError(500);
    }
    if (!valid) throw new HttpError(401);

    return updateSessionToken(String(user._id));
}

export async function verifySession(
    body: Record<string, unknown>,
): Promise<string> {
    const userid = body.userid;
    if (typeof userid !== "string" || !MongoObjectId.isValid(userid)) {
        throw new HttpError(400);
    }
    const user = await findUser({ _id: new MongoObjectId(userid) });
    if (!user) throw new HttpError(404);
    if (String(user.session_token) !== String(body.session_token)) {
        throw new HttpError(401);
    }
    return "Session token is valid";
}
