import { MongoClient } from "mongodb";
import { afterAll, describe, expect, it } from "vitest";

const uri = process.env.MONGODB_URI;
let client: MongoClient | undefined;

describe("MongoDB Atlas secret", () => {
  afterAll(async () => {
    await client?.close();
  });

  it("connects and responds to a ping without exposing the URI", async () => {
    expect(uri).toBeTruthy();

    client = new MongoClient(uri!, {
      serverSelectionTimeoutMS: 10_000,
    });

    await client.connect();
    const result = await client.db("admin").command({ ping: 1 });

    expect(result.ok).toBe(1);
  }, 20_000);
});
