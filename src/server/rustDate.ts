const RFC3339 =
    /^(\d{4})-(\d{2})-(\d{2})[Tt](\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(?:[Zz]|([+-])(\d{2}):(\d{2}))$/;

interface Instant {
    seconds: number;
    nanos: number;
}

/** chrono's `parse_from_rfc3339`, keeping up to nanosecond precision. */
function parseRfc3339(value: string): Instant | null {
    const match = RFC3339.exec(value);
    if (!match) return null;
    const [, y, mo, d, h, mi, s, fraction, sign, oh, om] = match;
    const [year, month, day] = [Number(y), Number(mo), Number(d)];
    if (Number(h) > 23 || Number(mi) > 59 || Number(s) > 59) return null;
    if (sign && (Number(oh) > 23 || Number(om) > 59)) return null;

    const millis = Date.UTC(
        year,
        month - 1,
        day,
        Number(h),
        Number(mi),
        Number(s),
    );
    const check = new Date(millis);
    if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
        return null;
    }

    const offset = sign
        ? (sign === "-" ? -1 : 1) * (Number(oh) * 3600 + Number(om) * 60)
        : 0;
    const nanos = Number((fraction ?? "").slice(0, 9).padEnd(9, "0"));
    return { seconds: millis / 1000 - offset, nanos };
}

/** chrono `%Y-%m-%dT%H:%M:%S%.fZ`: 0, 3, 6 or 9 fractional digits. */
function formatInstant({ seconds, nanos }: Instant): string {
    const base = new Date(seconds * 1000).toISOString().slice(0, 19);
    let fraction = "";
    if (nanos % 1_000_000 === 0 && nanos !== 0) {
        fraction = `.${String(nanos / 1_000_000).padStart(3, "0")}`;
    } else if (nanos % 1_000 === 0 && nanos !== 0) {
        fraction = `.${String(nanos / 1_000).padStart(6, "0")}`;
    } else if (nanos !== 0) {
        fraction = `.${String(nanos).padStart(9, "0")}`;
    }
    return `${base}${fraction}Z`;
}

export function formatRustDate(date: Date): string {
    const millis = date.getTime();
    const seconds = Math.floor(millis / 1000);
    return formatInstant({
        seconds,
        nanos: (millis - seconds * 1000) * 1_000_000,
    });
}

export function rustDateNow(): string {
    return formatRustDate(new Date());
}

/** Parses an RFC3339 string and re-emits it in the Rust output format. */
export function normalizeRustDate(value: string): string | null {
    const instant = parseRfc3339(value);
    return instant ? formatInstant(instant) : null;
}
