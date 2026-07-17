import { Router, type IRouter } from "express";
import multer from "multer";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

router.post("/upload", upload.single("file"), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    // Return a placeholder URL if Cloudinary is not configured
    req.log.warn("Cloudinary not configured — returning placeholder URL");
    res.json({
      url: `https://placehold.co/600x400?text=${encodeURIComponent(req.file.originalname)}`,
      public_id: `placeholder_${Date.now()}`,
      configured: false,
    });
    return;
  }

  try {
    // Build Cloudinary upload URL
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "zoophilist";

    // Create signature
    const crypto = await import("crypto");
    const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    // Build form data for Cloudinary
    const FormData = (await import("form-data")).default;
    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    form.append("folder", folder);
    form.append("timestamp", String(timestamp));
    form.append("api_key", CLOUDINARY_API_KEY);
    form.append("signature", signature);

    const resourceType = req.file.mimetype.startsWith("video/") ? "video" : "image";
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      // @ts-ignore
      headers: form.getHeaders(),
      body: form as any,
    });

    if (!response.ok) {
      const err = await response.text();
      req.log.error({ err }, "Cloudinary upload failed");
      res.status(500).json({ error: "Upload failed", details: err });
      return;
    }

    const result = await response.json() as any;
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      configured: true,
    });
  } catch (err) {
    req.log.error({ err }, "Upload error");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
