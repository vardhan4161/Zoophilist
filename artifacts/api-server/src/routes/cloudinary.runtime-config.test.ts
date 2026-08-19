import { describe, expect, it } from "vitest";

describe("configured Cloudinary media uploads", () => {
  it("validates the configured server credentials with a read-only media listing", async () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    expect(cloudName).toMatch(/^[a-z0-9_-]{3,}$/i);
    expect(apiKey).toMatch(/^\d{6,}$/);
    expect(apiSecret).toMatch(/^.{16,}$/);

    const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=1`,
      {
        headers: { authorization: `Basic ${authorization}` },
        signal: AbortSignal.timeout(15_000),
      },
    );

    expect(response.ok).toBe(true);
  }, 20_000);
});
