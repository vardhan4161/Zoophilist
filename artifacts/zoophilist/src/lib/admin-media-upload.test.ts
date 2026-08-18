import { describe, expect, it } from "vitest";
import { validateAdminGalleryFile } from "./admin-media-upload";

describe("administrator gallery media validation", () => {
  it("accepts supported files within their size limits", () => {
    expect(validateAdminGalleryFile({ type: "image/webp", size: 5 * 1024 * 1024 })).toBeNull();
    expect(validateAdminGalleryFile({ type: "video/mp4", size: 20 * 1024 * 1024 })).toBeNull();
  });

  it("rejects missing, unsupported, or oversized files before upload", () => {
    expect(validateAdminGalleryFile(null)).toContain("Choose an image or video");
    expect(validateAdminGalleryFile({ type: "application/pdf", size: 128 })).toContain("JPG, PNG, WebP, MP4, or WebM");
    expect(validateAdminGalleryFile({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toContain("5MB");
    expect(validateAdminGalleryFile({ type: "video/webm", size: 20 * 1024 * 1024 + 1 })).toContain("20MB");
  });
});
