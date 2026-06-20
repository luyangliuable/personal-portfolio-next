import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGOURI ?? "mongodb://localhost:27017";
const client = new MongoClient(uri);

const imageIds = [
  "651942aaf9b642fb30be59ae",
  "650502c8f9b642fb30be5999", "650516c6f9b642fb30be599a",
  "65051a29f9b642fb30be599b", "65052756f9b642fb30be599d",
  "6505281ef9b642fb30be599e", "65052952f9b642fb30be599f",
  "650529b6f9b642fb30be59a0", "65052a6af9b642fb30be59a1",
  "65052edef9b642fb30be59a2", "650532f2f9b642fb30be59a3",
  "65053681f9b642fb30be59a4", "65053754f9b642fb30be59a5",
  "650539f6f9b642fb30be59a6", "65053cb4f9b642fb30be59a7",
  "65053d94f9b642fb30be59a8", "65817ae96c73ceb16ba51731",
  "65920a4af1f0fe657dc4683b", "65920b85f1f0fe657dc4683c",
  "6599eebc58701a6b8fe5908a", "65c3629e98a82efb52729772",
  "667cfff15f03f0355e1fc35f", "667d02115f03f0355e1fc363",
  "667d043b5f03f0355e1fc366", "667d05f65f03f0355e1fc367",
  "667d085d5f03f0355e1fc369", "667d0b605f03f0355e1fc36b",
  "667d0e585f03f0355e1fc36f", "668c946aa8e1db1f839dba56",
  "66ab67bd8803e8c20005c32e", "66e588c918eb5f86ea13b531",
  "6725884d18eb5f86ea13b53e", "6725894618eb5f86ea13b53f",
  "6725e5bd18eb5f86ea13b542", "677a5f3618eb5f86ea13b55a",
];

function post(id, heading, tags, featured = false) {
  return {
    _id: new ObjectId(id), heading, author: "Luyang Liu",
    description: `Local seeded content for ${heading}.`, post_type: "blog",
    year: 2026, month: 6, date_created: "2026-06-20T00:00:00Z",
    date_last_modified: "2026-06-20T00:00:00Z",
    file_name: heading.toLowerCase().replaceAll(" ", "-"), tags,
    reading_time_minutes: 3, is_featured: featured, in_progress: false,
    active: true, image: new ObjectId("65817ae96c73ceb16ba51731"),
    checksum: "local-seed", is_locked: false,
    body: `# ${heading}\n\nThis post is seeded locally for frontend testing.\n\n## Images\n\n![Local image](65817ae96c73ceb16ba51731)\n\n## Code\n\n\`\`\`ts\nconsole.log("local backend ready");\n\`\`\``,
  };
}

await client.connect();
const db = client.db("rustDB");
for (const id of imageIds) {
  await db.collection("LocalImage").updateOne(
    { _id: new ObjectId(id) },
    { $set: { image_type: "jpg", file_name: "placeholder",
      description: "Local placeholder image", source: "local seed" } },
    { upsert: true },
  );
}
const posts = [
  post("658180006c73ceb16ba51732", "Local Blog Smoke Test", ["local", "test"], true),
  post("658180016c73ceb16ba51733", "Algorithms Local Post", ["algorithms"], true),
  post("658180026c73ceb16ba51734", "Projects Local Post", ["projects"]),
  post("66ab67bd8803e8c20005c32e", "Local Tool Post", ["tools"]),
  post("66e588c918eb5f86ea13b531", "Local Experience Post", ["experience"]),
];
for (const item of posts) {
  await db.collection("Post").updateOne({ _id: item._id }, { $set: item }, { upsert: true });
}
await db.collection("BlogPost").updateOne(
  { heading: "Deprecated Local Blog" },
  { $set: { heading: "Deprecated Local Blog", author: "Luyang Liu",
    date_created: "2026-06-20", body: ["Local deprecated blog content"] } },
  { upsert: true },
);
console.log(`Seeded ${imageIds.length} images and ${posts.length} posts.`);
await client.close();
