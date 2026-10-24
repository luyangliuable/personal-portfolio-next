import { readFile } from "node:fs/promises";
import sharp from "sharp";

export function imageStoreLocation(): string | null {
    return process.env.IMAGE_STORE_LOCATION ?? null;
}

/** Mirrors the Rust LocalImageController content-type switch. */
export function contentTypeFor(imageType: string): string | null {
    switch (imageType) {
        case "png":
            return "image/png";
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "gif":
            return "image/gif";
        case "pdf":
            return "application/pdf";
        default:
            return null;
    }
}

/** util::path_combiner: `{root}/{file_name}.{image_type}`. */
export async function readImageFile(
    root: string,
    imageType: string,
    fileName: string,
): Promise<Buffer> {
    return readFile(`${root}/${fileName}.${imageType}`);
}

/** Rocket's `Option<u8>` query field: unparsable values fall back to 100. */
export function parseCompression(value: string | null): number {
    if (value === null || !/^\+?\d+$/.test(value)) return 100;
    const parsed = Number(value);
    return parsed <= 255 ? parsed : 100;
}

/**
 * PNG is resized by the compression percentage (Lanczos3); JPEG is re-encoded
 * at that quality; GIF/PDF are returned untouched by the caller.
 */
export async function compressImage(
    buffer: Buffer,
    imageType: string,
    compression: number,
): Promise<Buffer> {
    if (imageType === "png") {
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const ratio = compression / 100;
        const width = Math.max(1, Math.floor((metadata.width ?? 1) * ratio));
        const height = Math.max(1, Math.floor((metadata.height ?? 1) * ratio));
        return image
            .resize(width, height, { kernel: "lanczos3" })
            .png()
            .toBuffer();
    }

    if (imageType === "jpg" || imageType === "jpeg") {
        const quality = Math.min(100, Math.max(1, compression));
        return sharp(buffer).jpeg({ quality }).toBuffer();
    }

    return buffer;
}
