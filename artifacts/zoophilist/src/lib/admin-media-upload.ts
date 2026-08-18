export type MediaFileLike = Pick<File, "size" | "type">;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;

export function validateAdminGalleryFile(file: MediaFileLike | null): string | null {
  if (!file) return "Choose an image or video to add to the gallery.";
  if (!IMAGE_TYPES.has(file.type) && !VIDEO_TYPES.has(file.type)) {
    return "Choose a JPG, PNG, WebP, MP4, or WebM file.";
  }
  if (IMAGE_TYPES.has(file.type) && file.size > MAX_IMAGE_BYTES) {
    return "Images must be 5MB or smaller.";
  }
  if (VIDEO_TYPES.has(file.type) && file.size > MAX_VIDEO_BYTES) {
    return "Videos must be 20MB or smaller.";
  }
  return null;
}
