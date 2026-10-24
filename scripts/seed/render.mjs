import { createHash } from "node:crypto";
import sharp from "sharp";

const SIZES = { banner: [960, 540], avatar: [400, 400] };

/** Stable 24-hex ObjectId for seeded content so reruns upsert in place. */
export function seedId(key) {
    return createHash("md5").update(key).digest("hex").slice(0, 24);
}

function hueFor(id) {
    return Number.parseInt(id.slice(-6), 16) % 360;
}

function escapeXml(value) {
    return value.replace(/[<>&"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function svgFor({ id, group, label, kind }) {
    const [width, height] = SIZES[kind] ?? SIZES.banner;
    const hue = hueFor(id);
    // Shrink long labels so they stay inside the image.
    const size = Math.round(
        Math.min(
            width / (kind === "avatar" ? 9 : 16),
            (width * 1.6) / label.length,
        ),
    );
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue},65%,42%)"/>
<stop offset="1" stop-color="hsl(${(hue + 50) % 360},70%,22%)"/>
</linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<g font-family="Helvetica, Arial, sans-serif" fill="#fff" text-anchor="middle">
<text x="50%" y="42%" font-size="${size * 0.6}" opacity="0.75">${escapeXml(group.toUpperCase())}</text>
<text x="50%" y="56%" font-size="${size}" font-weight="bold">${escapeXml(label)}</text>
<text x="50%" y="90%" font-size="${size * 0.4}" opacity="0.5">${id}</text>
</g></svg>`;
}

export function renderPng(image) {
    return sharp(Buffer.from(svgFor(image)))
        .png()
        .toBuffer();
}

/** Single A4 page with a few lines of Helvetica, xref offsets computed. */
export function renderPdf(lines) {
    const text = lines
        .map(
            (line, index) =>
                `BT /F1 ${index ? 12 : 24} Tf 72 ${770 - index * 28} Td (${line.replace(/[()\\]/g, "\\$&")}) Tj ET`,
        )
        .join("\n");
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${Buffer.byteLength(text)} >>\nstream\n${text}\nendstream`,
    ];
    let output = "%PDF-1.4\n";
    const offsets = objects.map((body, index) => {
        const offset = Buffer.byteLength(output);
        output += `${index + 1} 0 obj\n${body}\nendobj\n`;
        return offset;
    });
    const xref = Buffer.byteLength(output);
    output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    output += offsets
        .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
        .join("");
    output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return Buffer.from(output);
}
