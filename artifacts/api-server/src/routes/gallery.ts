import { Router, type IRouter } from "express";
import { mongoCollections, newId, type GalleryDocument } from "@workspace/db";
import {
  CreateGalleryItemBody,
  GetGalleryQueryParams,
  DeleteGalleryItemParams,
} from "@workspace/api-zod";
import { requireAdmin } from "./admin";

const router: IRouter = Router();

const formatItem = (item: any) => {
  const { _id, ...data } = item;
  return { ...data, createdAt: new Date(data.createdAt).toISOString(), updatedAt: new Date(data.updatedAt).toISOString() };
};

router.get("/gallery", async (req, res): Promise<void> => {
  const parsed = GetGalleryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const { gallery } = await mongoCollections();
    const filter = parsed.data.category && parsed.data.category !== "all" ? { category: parsed.data.category } : {};
    const filtered = await gallery.find(filter).sort({ featured: -1, createdAt: -1 }).toArray();
    res.json(filtered.map(formatItem));
  } catch (err) {
    req.log.error({ err }, "Failed to get gallery");
    res.status(500).json({ error: "Failed to get gallery" });
  }
});

router.post("/gallery", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const { gallery } = await mongoCollections();
    const now = new Date();
    const item: GalleryDocument = { id: newId(), url: parsed.data.url, type: parsed.data.type, category: parsed.data.category ?? undefined, caption: parsed.data.caption ?? undefined, featured: false, createdAt: now, updatedAt: now };
    await gallery.insertOne(item);
    res.status(201).json(formatItem(item));
  } catch (err) {
    req.log.error({ err }, "Failed to create gallery item");
    res.status(500).json({ error: "Failed to create gallery item" });
  }
});

router.delete("/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const { gallery } = await mongoCollections();
    await gallery.deleteOne({ id: params.data.id });
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery item");
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;
