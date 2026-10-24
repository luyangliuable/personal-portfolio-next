import { ObjectId } from "mongodb";
import { getCollection } from "./db";
import { COLLECTIONS } from "./documents";
import { HttpError, requireObjectId } from "./http";
import { USER, USER_LOGIN, USER_SESSION_TOKEN } from "./models";
import { fromJson, fromStorage, type Model } from "./schema";
import { rustDateNow } from "./rustDate";
import {
    USER_ROLE_USER,
    hashPassword,
    isBcryptHash,
    newSessionToken,
    verifyPassword,
} from "./user";

export interface SessionToken {
    userid: string;
    session_token: string;
}

/** user_util::get_id_out_of_bson: hex for ObjectIds, empty otherwise. */
function idString(id: unknown): string {
    return id instanceof ObjectId ? id.toHexString() : "";
}

/** MongoRepo::get: missing is 404, an undecodable document panics (500). */
async function getUserById(objectId: ObjectId): Promise<Model> {
    const collection = await getCollection(COLLECTIONS.user);
    const document = await collection.findOne({ _id: objectId });
    if (!document) throw new HttpError(404);
    const user = fromStorage(document, USER);
    if (!user) throw new HttpError(500);
    return user;
}

/** UserRepo::find_one: driver and decode errors both read as "not found". */
async function findLoginUser(filter: Record<string, unknown>) {
    const collection = await getCollection(COLLECTIONS.user);
    return fromStorage(await collection.findOne(filter), USER);
}

export async function getUserFromCookie(
    userId: string | undefined,
): Promise<{ username: string }> {
    if (userId === undefined) throw new HttpError(404);
    const user = await getUserById(requireObjectId(userId, 400));
    return { username: user.username as string };
}

export async function createUser(body: unknown): Promise<SessionToken> {
    const user = fromJson(body, USER);
    user.password = hashPassword(user.password as string);
    user.role = USER_ROLE_USER;
    const sessionToken = newSessionToken();
    user.session_token = sessionToken;
    user.session_token_created_date = rustDateNow();

    const collection = await getCollection(COLLECTIONS.user);
    const result = await collection.insertOne(user);
    return { userid: idString(result.insertedId), session_token: sessionToken };
}

async function updateSessionToken(userid: string): Promise<SessionToken> {
    const objectId = requireObjectId(userid, 500);
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

/** UserRepo::perform_user_login: email wins whenever it is present. */
export async function login(body: unknown): Promise<SessionToken> {
    const credentials = fromJson(body, USER_LOGIN);
    let user: Model | null;
    if (credentials.email !== null) {
        user = await findLoginUser({ email: credentials.email });
    } else if (credentials.username !== null) {
        user = await findLoginUser({ username: credentials.username });
    } else {
        throw new HttpError(500);
    }

    if (!user) throw new HttpError(401);
    if (!isBcryptHash(user.password)) throw new HttpError(500);
    if (!verifyPassword(credentials.password as string, user.password)) {
        throw new HttpError(401);
    }

    return updateSessionToken(idString(user._id));
}

export async function verifySession(body: unknown): Promise<string> {
    const token = fromJson(body, USER_SESSION_TOKEN);
    const user = await getUserById(
        requireObjectId(token.userid as string, 400),
    );
    if (
        user.session_token === null ||
        user.session_token !== token.session_token
    ) {
        throw new HttpError(401);
    }
    return "Session token is valid";
}
