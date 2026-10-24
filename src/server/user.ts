import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

/** bcrypt::DEFAULT_COST in the Rust `bcrypt` crate is 12. */
export const BCRYPT_COST = 12;

export const USER_ROLE_USER = "User";

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, BCRYPT_COST);
}

/** The Rust bcrypt crate rejects malformed hashes with an error (500). */
export function isBcryptHash(hash: unknown): hash is string {
    return (
        typeof hash === "string" &&
        /^\$2[abxy]\$\d{1,2}\$[./A-Za-z0-9]{53}$/.test(hash)
    );
}

export function verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}

export function newSessionToken(): string {
    return randomUUID();
}

export const UserError = {
    UserNotFound: 404,
    InvalidPassword: 401,
    InvalidEmail: 404,
    InternalServerError: 500,
    NotAuthorised: 401,
    InvalidUserId: 400,
} as const;

export type UserErrorName = keyof typeof UserError;

export function userErrorStatus(error: UserErrorName): number {
    return UserError[error];
}
