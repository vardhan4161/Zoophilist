import { Router, type IRouter } from "express";
import { mongoCollections } from "@workspace/db";
import { requireAdmin } from "./admin";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULTS: Record<string, string> = {
  phone: "+91 9515247704",
  email: "zoophilistpetservice@gmail.com",
  address: "Doorstep service across major cities in India",
  workingHoursStart: "08:00",
  workingHoursEnd: "20:00",
  workingDays: "Monday–Sunday",
  instagramUrl: "https://instagram.com/zoophilist",
  facebookUrl: "https://facebook.com/zoophilist",
  youtubeUrl: "https://youtube.com/zoophilist",
  whatsappNumber: "+919515247704",
  seoTitle: "Zoophilist — Premium Doorstep Pet Grooming",
  seoDescription: "India's #1 premium doorstep pet grooming platform. Certified groomers at your home.",
  telegramBotToken: "",
  telegramChatId: "",
  resendApiKey: "",
  cloudinaryCloudName: "",
  cloudinaryApiKey: "",
  adminEmail: "zoophilistpetservice@gmail.com",
};

// In-memory cache (loaded from DB on first request)
let cache: Record<string, string> | null = null;

async function loadSettings(): Promise<Record<string, string>> {
  if (cache) return cache;
  try {
    const { settings } = await mongoCollections();
    const rows = await settings.find({}).toArray();
    const fromDb: Record<string, string> = {};
    rows.forEach((r: { key: string; value: string }) => { fromDb[r.key] = r.value; });
    // Merge: DB values override defaults; env vars override everything at read time
    cache = { ...DEFAULTS, ...fromDb };
    logger.info("Settings loaded from DB");
  } catch (err) {
    logger.error({ err }, "Failed to load settings from DB — using defaults");
    cache = { ...DEFAULTS };
  }
  return cache;
}

// Exported so booking route can read live config without a full HTTP round-trip
export const businessSettings = new Proxy({} as Record<string, string>, {
  get(_target, key: string) {
    // Return from cache synchronously; falls back to DEFAULTS if not yet loaded
    return (cache ?? DEFAULTS)[key] ?? "";
  },
});

const SENSITIVE_KEYS = new Set(["telegramBotToken", "resendApiKey", "cloudinaryApiKey"]);

function maskSensitive(settings: Record<string, string>): Record<string, string> {
  const masked = { ...settings };
  for (const key of SENSITIVE_KEYS) {
    if (masked[key]) masked[key] = "••••••••";
  }
  return masked;
}

const ALLOWED_KEYS = new Set(Object.keys(DEFAULTS));

// ─── Routes ───────────────────────────────────────────────────────────────────

router.get("/settings", requireAdmin, async (_req, res): Promise<void> => {
  const settings = await loadSettings();
  res.json(maskSensitive(settings));
});

router.put("/settings", requireAdmin, async (req, res): Promise<void> => {
  const settings = await loadSettings();
  const updates: Record<string, string> = {};

  for (const [key, val] of Object.entries(req.body)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    if (typeof val !== "string") continue;
    if (val === "••••••••") continue; // Don't overwrite with masked placeholder
    updates[key] = val;
  }

  if (Object.keys(updates).length === 0) {
    res.json({ success: true, message: "No changes" });
    return;
  }

  try {
    // Upsert each changed key into the DB
    await Promise.all(
      Object.entries(updates).map(async ([key, value]) => {
        const { settings } = await mongoCollections();
        return settings.updateOne({ key }, { $set: { value, updatedAt: new Date() } }, { upsert: true });
      }),
    );

    // Update cache
    Object.assign(settings, updates);

    res.json({ success: true, message: "Settings saved" });
  } catch (err) {
    logger.error({ err }, "Failed to save settings");
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
