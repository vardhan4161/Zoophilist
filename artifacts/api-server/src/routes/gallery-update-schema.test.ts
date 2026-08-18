import { describe, expect, it } from "vitest";
import { UpdateGalleryItemBody, UpdateGalleryItemParams } from "@workspace/api-zod";

describe("gallery update validation", () => {
  it("accepts validated administrator gallery metadata changes", () => {
    expect(UpdateGalleryItemParams.parse({ id: "gallery-1" })).toEqual({ id: "gallery-1" });
    expect(UpdateGalleryItemBody.parse({ category: "bath", caption: "Freshly groomed", featured: true })).toEqual({
      category: "bath",
      caption: "Freshly groomed",
      featured: true,
    });
  });

  it("rejects empty updates and captions that exceed the safe bound", () => {
    expect(() => UpdateGalleryItemBody.parse({})).toThrow("At least one gallery field must be updated");
    expect(() => UpdateGalleryItemBody.parse({ caption: "x".repeat(301) })).toThrow();
  });
});
