import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, servicesTable } from "@workspace/db";
import {
  CreateServiceBody,
  GetServiceByIdParams,
  UpdateServiceParams,
  UpdateServiceBody,
  DeleteServiceParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const formatService = (s: typeof servicesTable.$inferSelect) => ({
  ...s,
  price: parseFloat(s.price),
  originalPrice: s.originalPrice ? parseFloat(s.originalPrice) : undefined,
  createdAt: s.createdAt.toISOString(),
});

router.get("/services", async (req, res): Promise<void> => {
  try {
    const services = await db.select().from(servicesTable).orderBy(servicesTable.createdAt);
    res.json(services.map(formatService));
  } catch (err) {
    req.log.error({ err }, "Failed to get services");
    res.status(500).json({ error: "Failed to get services" });
  }
});

router.post("/services", async (req, res): Promise<void> => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [service] = await db
      .insert(servicesTable)
      .values({
        ...parsed.data,
        price: String(parsed.data.price),
        originalPrice: parsed.data.originalPrice != null ? String(parsed.data.originalPrice) : null,
      })
      .returning();
    res.status(201).json(formatService(service));
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    res.status(500).json({ error: "Failed to create service" });
  }
});

router.get("/services/:id", async (req, res): Promise<void> => {
  const params = GetServiceByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [service] = await db
      .select()
      .from(servicesTable)
      .where(eq(servicesTable.id, params.data.id));

    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }

    res.json(formatService(service));
  } catch (err) {
    req.log.error({ err }, "Failed to get service");
    res.status(500).json({ error: "Failed to get service" });
  }
});

router.patch("/services/:id", async (req, res): Promise<void> => {
  const params = UpdateServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateServiceBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  try {
    const updateData: Record<string, unknown> = { ...body.data };
    if (body.data.price != null) updateData.price = String(body.data.price);
    if (body.data.originalPrice != null) updateData.originalPrice = String(body.data.originalPrice);

    const [service] = await db
      .update(servicesTable)
      .set(updateData)
      .where(eq(servicesTable.id, params.data.id))
      .returning();

    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }

    res.json(formatService(service));
  } catch (err) {
    req.log.error({ err }, "Failed to update service");
    res.status(500).json({ error: "Failed to update service" });
  }
});

router.delete("/services/:id", async (req, res): Promise<void> => {
  const params = DeleteServiceParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    await db.delete(servicesTable).where(eq(servicesTable.id, params.data.id));
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete service");
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;
