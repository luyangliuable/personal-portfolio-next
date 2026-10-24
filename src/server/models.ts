import type { Schema } from "./schema";

const str = { type: "string", required: true } as const;
const optStr = { type: "string" } as const;
const optI32 = { type: "i32" } as const;
const optBool = { type: "bool" } as const;
const oid = { type: "oid" } as const;
const date = { type: "date" } as const;
const tags = { type: "strings" } as const;

/** Field lists mirror the Rust structs in src/models/*.rs on origin/deploy. */
export const POST: Schema = {
    _id: oid,
    heading: str,
    author: str,
    description: optStr,
    post_type: str,
    year: { type: "i32", required: true },
    month: { type: "i32", required: true },
    date_created: date,
    date_last_modified: date,
    file_name: str,
    tags,
    reading_time_minutes: optI32,
    is_featured: optBool,
    in_progress: optBool,
    active: optBool,
    image: oid,
    checksum: optStr,
    body: str,
};

export const NOTE: Schema = {
    _id: oid,
    heading: str,
    author: str,
    description: optStr,
    date_created: date,
    date_last_modified: date,
    file_path: str,
    tags,
    reading_time_minutes: optI32,
    active: optBool,
    image: oid,
    checksum: optStr,
    body: str,
};

export const LOCAL_IMAGE: Schema = {
    _id: oid,
    image_type: str,
    year: optI32,
    month: optI32,
    date_created: date,
    date_last_modified: date,
    file_name: str,
    description: optStr,
    source: optStr,
};

/** MessageType serializes with serde `rename_all = "UPPERCASE"`. */
export const USER_MESSAGE_TYPE = "USERMESSAGE";

export const MESSAGE: Schema = {
    _id: oid,
    name: str,
    description: optStr,
    message_type: { type: { enum: [USER_MESSAGE_TYPE, "CONSULTINGMESSAGE"] } },
    date_created: date,
};

export const CONFIG: Schema = { _id: oid, key: str, value: str };

export const USER: Schema = {
    _id: { type: "bson" },
    username: str,
    password: str,
    email: str,
    first_name: str,
    middle_name: optStr,
    last_name: str,
    role: optStr,
    session_token: optStr,
    session_token_created_date: date,
};

export const USER_LOGIN: Schema = {
    username: optStr,
    password: str,
    email: optStr,
};

export const USER_SESSION_TOKEN: Schema = { userid: str, session_token: str };
