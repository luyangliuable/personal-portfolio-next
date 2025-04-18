import "dotenv/config";
import { db } from ".";
import { users } from "./schema";

async function seed() {
  // Create sample users
  const sampleUsers = [
    {
      id: crypto.randomUUID(),
      name: "John Doe",
      email: "john.doe@example.com",
      emailVerified: new Date(),
      image: "https://example.com/avatars/john.jpg",
    },
    {
      id: crypto.randomUUID(),
      name: "Jane Smith",
      email: "jane.smith@example.com",
      emailVerified: new Date(),
      image: "https://example.com/avatars/jane.jpg",
    },
    {
      id: crypto.randomUUID(),
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: new Date(),
      image: "https://example.com/avatars/admin.jpg",
    },
  ];

  try {
    // Insert users
    for (const user of sampleUsers) {
      await db.insert(users).values(user);
    }

    console.log(`Successfully seeded ${sampleUsers.length} users!`);

    // Verify the inserted data
    const allUsers = await db.select().from(users);
    console.log("All users in the database:", allUsers);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
