import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  CreateGalleryItemBody,
  GetGalleryQueryParams,
  DeleteGalleryItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const formatItem = (item: typeof galleryTable.$inferSelect) => ({
  ...item,
  createdAt: item.createdAt.toISOString(),
});

router.get("/gallery", async (req, res): Promise<void> => {
  const parsed = GetGalleryQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const all = await db.select().from(galleryTable).orderBy(galleryTable.createdAt);
    const filtered =
      parsed.data.category && parsed.data.category !== "all"
        ? all.filter((i) => i.category === parsed.data.category)
        : all;
    res.json(filtered.map(formatItem));
  } catch (err) {
    req.log.error({ err }, "Failed to get gallery");
    res.status(500).json({ error: "Failed to get gallery" });
  }
});

router.post("/gallery", async (req, res): Promise<void> => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [item] = await db.insert(galleryTable).values(parsed.data).returning();
    res.status(201).json(formatItem(item));
  } catch (err) {
    req.log.error({ err }, "Failed to create gallery item");
    res.status(500).json({ error: "Failed to create gallery item" });
  }
});

router.delete("/gallery/:id", async (req, res): Promise<void> => {
  const params = DeleteGalleryItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery item");
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
});

export default router;
