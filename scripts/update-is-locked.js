const { MongoClient, ObjectId } = require("mongodb");

const uri =
    "mongodb+srv://luyangliuable:NHcVyBIF7Dnz2uSF@serverlessinstance0.z8d7qnv.mongodb.net/rustDB";

async function main() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("rustDB");
        const collection = db.collection("Post");

        // Task 1: Add is_locked: true to all posts
        const allResult = await collection.updateMany(
            {},
            { $set: { is_locked: true } },
        );
        console.log(
            `Updated ${allResult.modifiedCount} posts with is_locked: true`,
        );

        // Task 2: Unlock the DigitalOcean post
        const unlockResult = await collection.updateOne(
            { _id: new ObjectId("69b508bfb5f2e4c8ed281698") },
            { $set: { is_locked: false } },
        );
        console.log(
            `Unlocked DigitalOcean post: ${unlockResult.modifiedCount} document modified`,
        );

        // Task 3: Verify
        const lockedCount = await collection.countDocuments({
            is_locked: true,
        });
        const unlockedCount = await collection.countDocuments({
            is_locked: false,
        });
        const digitalOceanPost = await collection.findOne({
            _id: new ObjectId("69b508bfb5f2e4c8ed281698"),
        });

        console.log(`\nVerification:`);
        console.log(`  Posts with is_locked: true - ${lockedCount}`);
        console.log(`  Posts with is_locked: false - ${unlockedCount}`);
        console.log(
            `  DigitalOcean post is_locked: ${digitalOceanPost?.is_locked}`,
        );
        console.log(
            `  DigitalOcean post file_name: ${digitalOceanPost?.file_name}`,
        );
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await client.close();
        console.log("\nDisconnected from MongoDB");
    }
}

main();
