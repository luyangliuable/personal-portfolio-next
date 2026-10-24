import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";
import { memoryCache } from "@/server/cache";
import { compressImage } from "@/server/image";
import { getImage, getImages, insertImage, updateImage } from "@/server/images";
import { fakeStore } from "./fakeMongo";

vi.mock("@/server/db", async () => (await import("./fakeMongo")).fakeDb);

let root: string;

async function addImage(imageType: string, fileName: string): Promise<string> {
    const result = (await insertImage({
        image_type: imageType,
        file_name: fileName,
    })) as {
        insertedId: { $oid: string };
    };
    return result.insertedId.$oid;
}

async function statusOf(promise: Promise<unknown>): Promise<number> {
    return promise.then(
        () => 200,
        (error) => error.status,
    );
}

beforeAll(async () => {
    root = await mkdtemp(path.join(tmpdir(), "images-"));
    const png = await sharp({
        create: { width: 4, height: 2, channels: 3, background: "#f00" },
    })
        .png()
        .toBuffer();
    await writeFile(path.join(root, "red.png"), png);
    await writeFile(path.join(root, "anim.gif"), "GIF89a");
});

afterAll(async () => {
    await rm(root, { recursive: true, force: true });
});

beforeEach(() => {
    memoryCache.clear();
    fakeStore.clear();
    vi.stubEnv("IMAGE_STORE_LOCATION", root);
});

describe("image service", () => {
    it("keeps the real content type on cache hits.", async () => {
        const pngId = await addImage("png", "red");
        const first = await getImage(pngId, 50);
        const second = await getImage(pngId, 50);
        expect(first.contentType).toBe("image/png");
        expect(second.contentType).toBe("image/png");
        expect(second).toBe(first);
        expect((await sharp(first.buffer).metadata()).width).toBe(2);

        const gifId = await addImage("gif", "anim");
        await getImage(gifId, 100);
        expect((await getImage(gifId, 100)).contentType).toBe("image/gif");
    });

    it("maps failures to the Rust status codes.", async () => {
        const pngId = await addImage("png", "red");
        expect(await statusOf(getImage("not-an-id", 100))).toBe(500);
        expect(await statusOf(getImage("0".repeat(24), 100))).toBe(404);
        expect(
            await statusOf(getImage(await addImage("png", "missing"), 100)),
        ).toBe(500);
        expect(
            await statusOf(getImage(await addImage("bmp", "red"), 100)),
        ).toBe(500);

        vi.stubEnv("IMAGE_STORE_LOCATION", undefined);
        expect(await statusOf(getImage(pngId, 100))).toBe(404);
    });

    it("answers 415 for unsupported types once the file exists.", async () => {
        await writeFile(path.join(root, "red.bmp"), "BM");
        expect(
            await statusOf(getImage(await addImage("bmp", "red"), 100)),
        ).toBe(415);
    });

    it("answers 500 when a stored image cannot be compressed.", async () => {
        await writeFile(path.join(root, "broken.png"), "not a png");
        expect(
            await statusOf(getImage(await addImage("png", "broken"), 50)),
        ).toBe(500);
    });

    it("lists images and replaces image metadata by id.", async () => {
        const id = await addImage("png", "red");
        const result = await updateImage(id, {
            image_type: "png",
            file_name: "red",
            description: "updated",
        });
        expect(result).toMatchObject({ matchedCount: 1 });
        const images = (await getImages()) as { description: string }[];
        expect(images.map((image) => image.description)).toEqual(["updated"]);
        expect(fakeStore.get("LocalImage")![0].date_last_modified).toBeTruthy();
    });

    it("re-encodes JPEGs at a clamped quality and passes other types through.", async () => {
        const jpeg = await sharp({
            create: { width: 2, height: 2, channels: 3, background: "#00f" },
        })
            .jpeg()
            .toBuffer();
        for (const compression of [0, 150]) {
            const output = await compressImage(jpeg, "jpeg", compression);
            expect((await sharp(output).metadata()).format).toBe("jpeg");
        }
        const pdf = Buffer.from("%PDF");
        expect(await compressImage(pdf, "pdf", 30)).toBe(pdf);
    });
});
