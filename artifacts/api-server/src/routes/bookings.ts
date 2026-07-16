import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import {
  CreateBookingBody,
  GetBookingsQueryParams,
  GetBookingByIdParams,
  UpdateBookingStatusParams,
  UpdateBookingStatusBody,
  DeleteBookingParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/bookings/stats", async (req, res): Promise<void> => {
  try {
    const allBookings = await db.select().from(bookingsTable);
    const total = allBookings.length;
    const pending = allBookings.filter((b) => b.status === "pending").length;
    const confirmed = allBookings.filter((b) => b.status === "confirmed").length;
    const completed = allBookings.filter((b) => b.status === "completed").length;
    const cancelled = allBookings.filter((b) => b.status === "cancelled").length;

    // Service prices for revenue calc
    const servicePrices: Record<string, number> = {
      "Spa Bath": 899,
      Grooming: 1599,
      "Hair Cut": 1199,
      "Medical Bath": 1699,
      Subscription: 3899,
    };

    const totalRevenue = allBookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (servicePrices[b.serviceName] ?? 0), 0);

    // Weekly requests (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyRequests = allBookings.filter(
      (b) => new Date(b.createdAt) >= oneWeekAgo,
    ).length;

    // Popular services
    const serviceCountMap: Record<string, number> = {};
    allBookings.forEach((b) => {
      serviceCountMap[b.serviceName] = (serviceCountMap[b.serviceName] ?? 0) + 1;
    });
    const popularServices = Object.entries(serviceCountMap)
      .map(([serviceName, count]) => ({
        serviceName,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent bookings
    const recentBookings = allBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((b) => ({
        ...b,
        photoUrls: b.photoUrls ?? [],
        videoUrls: b.videoUrls ?? [],
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
      }));

    res.json({
      totalRequests: total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
      weeklyRequests,
      popularServices,
      recentBookings,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get booking stats");
    res.status(500).json({ error: "Failed to get booking stats" });
  }
});

router.get("/bookings", async (req, res): Promise<void> => {
  const parsed = GetBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, page = 1, limit = 20 } = parsed.data;
  const offset = (page - 1) * limit;

  try {
    let query = db.select().from(bookingsTable);

    const allRows = await db.select().from(bookingsTable);
    const filtered = status
      ? allRows.filter((b) => b.status === status)
      : allRows;

    const sorted = filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const paginated = sorted.slice(offset, offset + limit).map((b) => ({
      ...b,
      photoUrls: b.photoUrls ?? [],
      videoUrls: b.videoUrls ?? [],
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));

    res.json({
      bookings: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get bookings");
    res.status(500).json({ error: "Failed to get bookings" });
  }
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [booking] = await db
      .insert(bookingsTable)
      .values({
        ...parsed.data,
        status: "pending",
      })
      .returning();

    res.status(201).json({
      ...booking,
      photoUrls: booking.photoUrls ?? [],
      videoUrls: booking.videoUrls ?? [],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const params = GetBookingByIdParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    const [booking] = await db
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, params.data.id));

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({
      ...booking,
      photoUrls: booking.photoUrls ?? [],
      videoUrls: booking.videoUrls ?? [],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get booking");
    res.status(500).json({ error: "Failed to get booking" });
  }
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const params = UpdateBookingStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateBookingStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  try {
    const [booking] = await db
      .update(bookingsTable)
      .set({ status: body.data.status, updatedAt: new Date() })
      .where(eq(bookingsTable.id, params.data.id))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({
      ...booking,
      photoUrls: booking.photoUrls ?? [],
      videoUrls: booking.videoUrls ?? [],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update booking");
    res.status(500).json({ error: "Failed to update booking" });
  }
});

router.delete("/bookings/:id", async (req, res): Promise<void> => {
  const params = DeleteBookingParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  try {
    await db.delete(bookingsTable).where(eq(bookingsTable.id, params.data.id));
    res.sendStatus(204);
  } catch (err) {
    req.log.error({ err }, "Failed to delete booking");
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

export default router;
