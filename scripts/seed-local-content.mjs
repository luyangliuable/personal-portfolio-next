import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGOURI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);
const imageDir = path.resolve(
    process.env.IMAGE_STORE_LOCATION ?? ".local/images",
);

const imageIds = [
    "650502c8f9b642fb30be5999",
    "650516c6f9b642fb30be599a",
    "65051a29f9b642fb30be599b",
    "65052756f9b642fb30be599d",
    "6505281ef9b642fb30be599e",
    "65052952f9b642fb30be599f",
    "650529b6f9b642fb30be59a0",
    "65052a6af9b642fb30be59a1",
    "65052edef9b642fb30be59a2",
    "650532f2f9b642fb30be59a3",
    "65053681f9b642fb30be59a4",
    "65053754f9b642fb30be59a5",
    "650539f6f9b642fb30be59a6",
    "65053cb4f9b642fb30be59a7",
    "65053d94f9b642fb30be59a8",
    "651942aaf9b642fb30be59ae",
    "65817ae96c73ceb16ba51731",
    "65920a4af1f0fe657dc4683b",
    "65920b85f1f0fe657dc4683c",
    "6599eebc58701a6b8fe5908a",
    "65c3629e98a82efb52729772",
    "667cfff15f03f0355e1fc35f",
    "667d02115f03f0355e1fc363",
    "667d043b5f03f0355e1fc366",
    "667d05f65f03f0355e1fc367",
    "667d085d5f03f0355e1fc369",
    "667d0b605f03f0355e1fc36b",
    "667d0e585f03f0355e1fc36f",
    "668c946aa8e1db1f839dba56",
    "66ab67bd8803e8c20005c32e",
    "66e588c918eb5f86ea13b531",
    "6725884d18eb5f86ea13b53e",
    "6725894618eb5f86ea13b53f",
    "6725e5bd18eb5f86ea13b542",
    "677a5f3618eb5f86ea13b55a",
];

const crcTable = Array.from({ length: 256 }, (_, index) => {
    let c = index;
    for (let bit = 0; bit < 8; bit += 1)
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
});

function crc32(buffer) {
    let c = 0xffffffff;
    for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
    const name = Buffer.from(type);
    const body = Buffer.concat([name, data]);
    const output = Buffer.alloc(data.length + 12);
    output.writeUInt32BE(data.length, 0);
    name.copy(output, 4);
    data.copy(output, 8);
    output.writeUInt32BE(crc32(body), data.length + 8);
    return output;
}

function hashId(id) {
    let hash = 2166136261;
    for (const char of id) {
        hash ^= char.charCodeAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}

function hslToRgb(hue, saturation, lightness) {
    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness - chroma / 2;
    const [r, g, b] =
        hue < 60
            ? [chroma, x, 0]
            : hue < 120
              ? [x, chroma, 0]
              : hue < 180
                ? [0, chroma, x]
                : hue < 240
                  ? [0, x, chroma]
                  : hue < 300
                    ? [x, 0, chroma]
                    : [chroma, 0, x];
    return [r, g, b].map((value) => Math.round((value + m) * 255));
}

function colorFromId(id) {
    const hash = hashId(id);
    return hslToRgb(hash % 360, 0.72 + ((hash >>> 8) % 16) / 100, 0.48);
}

function pngForId(id) {
    const width = 320;
    const height = 180;
    const [r, g, b] = colorFromId(id);
    const raw = Buffer.alloc((width * 3 + 1) * height);
    for (let y = 0, offset = 0; y < height; y += 1) {
        raw[offset++] = 0;
        for (let x = 0; x < width; x += 1) {
            const accent =
                (x + y + Number.parseInt(id[(x + y) % id.length], 16)) % 37 ===
                0;
            raw[offset++] = accent ? 255 - r : r;
            raw[offset++] = accent ? 255 - g : g;
            raw[offset++] = accent ? 255 - b : b;
        }
    }
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr.set([8, 2, 0, 0, 0], 8);
    return Buffer.concat([
        Buffer.from("89504e470d0a1a0a", "hex"),
        chunk("IHDR", ihdr),
        chunk("IDAT", deflateSync(raw)),
        chunk("IEND", Buffer.alloc(0)),
    ]);
}

function assertUnique(values, label) {
    if (new Set(values).size !== values.length)
        throw new Error(`Seed ${label} must be unique.`);
}

assertUnique(imageIds, "image ids");
assertUnique(
    imageIds.map((id) => colorFromId(id).join(",")),
    "image colours",
);

function post(id, heading, tags, featured = false) {
    const fileName = heading.toLowerCase().replaceAll(" ", "-");
    return {
        _id: new ObjectId(id),
        heading,
        author: "Luyang Liu",
        description: `Local seeded content for ${heading}.`,
        post_type: "blog",
        year: 2026,
        month: 6,
        date_created: "2026-06-20T00:00:00Z",
        date_last_modified: "2026-06-20T00:00:00Z",
        file_name: fileName,
        tags,
        reading_time_minutes: 3,
        is_featured: featured,
        in_progress: false,
        active: true,
        image: new ObjectId("65817ae96c73ceb16ba51731"),
        checksum: "local-seed",
        is_locked: false,
        body: `# ${heading}`,
    };
}

await mkdir(imageDir, { recursive: true });
await client.connect();
const db = client.db("rustDB");
for (const id of imageIds) {
    await writeFile(path.join(imageDir, `${id}.png`), pngForId(id));
    await db.collection("LocalImage").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                image_type: "png",
                file_name: id,
                description: `Local generated image for ${id}`,
                source: "local seed",
            },
        },
        { upsert: true },
    );
}
const posts = [
    post("658180006c73ceb16ba51732", "Local Blog Smoke Test", ["local"], true),
    post(
        "658180016c73ceb16ba51733",
        "Algorithms Local Post",
        ["algorithms"],
        true,
    ),
    post("658180026c73ceb16ba51734", "Projects Local Post", ["projects"]),
    post("66ab67bd8803e8c20005c32e", "Local Tool Post", ["tools"]),
    post("66e588c918eb5f86ea13b531", "Local Experience Post", ["experience"]),
];
for (const item of posts) {
    await db
        .collection("Post")
        .updateOne({ _id: item._id }, { $set: item }, { upsert: true });
}
console.log(
    `Seeded ${imageIds.length} images in ${imageDir} and ${posts.length} posts.`,
);
await client.close();
