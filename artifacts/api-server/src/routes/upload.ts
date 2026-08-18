import { createHash } from "crypto";
import { Router, type IRouter } from "express";
import FormData from "form-data";
import multer from "multer";
import { requireAdmin } from "./admin";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024, files: 1 } });
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

type UploadedFile = Express.Multer.File;

function mediaKind(file: UploadedFile): "image" | "video" | null {
  if (IMAGE_TYPES.has(file.mimetype)) return "image";
  if (VIDEO_TYPES.has(file.mimetype)) return "video";
  return null;
}

function validateMedia(file: UploadedFile): string | null {
  const kind = mediaKind(file);
  if (!kind) return "Only JPG, PNG, WebP, MP4, and WebM media files are allowed";
  if (kind === "image" && file.size > 5 * 1024 * 1024) return "Images must be 5MB or smaller";
  if (kind === "video" && file.size > 20 * 1024 * 1024) return "Videos must be 20MB or smaller";
  return null;
}

async function uploadToCloudinary(file: UploadedFile, folder: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return { configured: false as const };

  const resourceType = mediaKind(file);
  if (!resourceType) throw new Error("Unsupported media type");
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex");
  const form = new FormData();
  form.append("file", file.buffer, { filename: file.originalname, contentType: file.mimetype });
  form.append("folder", folder);
  form.append("timestamp", String(timestamp));
  form.append("api_key", apiKey);
  form.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: "POST",
    headers: form.getHeaders(),
    body: form as any,
  });
  if (!response.ok) throw new Error(`Cloudinary rejected upload (${response.status})`);
  const result = await response.json() as { secure_url?: string; public_id?: string; resource_type?: "image" | "video" };
  if (!result.secure_url || !result.public_id) throw new Error("Cloudinary returned an incomplete upload response");
  return { configured: true as const, url: result.secure_url, public_id: result.public_id, type: result.resource_type ?? resourceType };
}

function handleUpload(folder: string) {
  return async (req: any, res: any): Promise<void> => {
    if (!req.file) return void res.status(400).json({ error: "No file provided" });
    const validationError = validateMedia(req.file);
    if (validationError) return void res.status(400).json({ error: validationError });
    try {
      const result = await uploadToCloudinary(req.file, folder);
      if (!result.configured) {
        req.log.warn("Cloudinary upload rejected because the server is not configured");
        return void res.status(503).json({ error: "Media uploads are not configured yet" });
      }
      res.status(201).json(result);
    } catch (error) {
      req.log.error({ error }, "Cloudinary upload failed");
      res.status(502).json({ error: "The media upload provider could not complete the upload. Please try again." });
    }
  };
}

router.post("/uploads/booking", upload.single("file"), handleUpload("zoophilist/booking-media"));
router.post("/upload", requireAdmin, upload.single("file"), handleUpload("zoophilist/gallery"));

router.use((error: unknown, _req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) return void res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "File exceeds the 20MB upload limit" : "Invalid upload request" });
  next(error);
});

export default router;
