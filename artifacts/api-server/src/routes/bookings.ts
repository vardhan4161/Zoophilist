import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import {
  CreateBookingBody,
  GetBookingsQueryParams,
  GetBookingByIdParams,
  UpdateBookingStatusParams,
  UpdateBookingStatusBody,
  DeleteBookingParams,
} from "@workspace/api-zod";
import { sendBookingEmails, sendTelegramNotification } from "../lib/notifications";
import { businessSettings } from "./settings";

const router: IRouter = Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a human-readable booking ID: ZOO-YYYY-XXXXXX */
async function generateBookingId(): Promise<string> {
  const year = new Date().getFullYear();
  // Count total bookings to make a sequential number
  const result = await db.select({ count: sql<number>`count(*)::int` }).from(bookingsTable);
  const count = result[0]?.count ?? 0;
  const seq = String(count + 1).padStart(6, "0");
  return `ZOO-${year}-${seq}`;
}

function serializeBooking(b: typeof bookingsTable.$inferSelect) {
  return {
    ...b,
    photoUrls: b.photoUrls ?? [],
    videoUrls: b.videoUrls ?? [],
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  };
}

// ─── Stats ────────────────────────────────────────────────────────────────────

router.get("/bookings/stats", async (req, res): Promise<void> => {
  try {
    const allBookings = await db.select().from(bookingsTable);
    const total = allBookings.length;
    const pending = allBookings.filter((b) => b.status === "pending").length;
    const confirmed = allBookings.filter((b) => b.status === "confirmed").length;
    const scheduled = allBookings.filter((b) => b.status === "scheduled").length;
    const completed = allBookings.filter((b) => b.status === "completed").length;
    const cancelled = allBookings.filter((b) => b.status === "cancelled").length;

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

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyRequests = allBookings.filter(
      (b) => new Date(b.createdAt) >= oneWeekAgo,
    ).length;

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

    const recentBookings = allBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(serializeBooking);

    res.json({
      totalRequests: total,
      pending,
      confirmed,
      scheduled,
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

// ─── List ─────────────────────────────────────────────────────────────────────

router.get("/bookings", async (req, res): Promise<void> => {
  const parsed = GetBookingsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { status, page = 1, limit = 20 } = parsed.data;
  const offset = (page - 1) * limit;

  try {
    const allRows = await db.select().from(bookingsTable);
    const filtered = status
      ? allRows.filter((b) => b.status === status)
      : allRows;

    const sorted = filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    res.json({
      bookings: sorted.slice(offset, offset + limit).map(serializeBooking),
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

// ─── Create ───────────────────────────────────────────────────────────────────

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const bookingId = await generateBookingId();

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        ...parsed.data,
        bookingId,
        status: "pending",
      })
      .returning();

    const serialized = serializeBooking(booking);
    res.status(201).json(serialized);

    // Fire notifications in the background (don't await — don't block response)
    const notifData = {
      bookingId,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      petName: booking.petName,
      petType: booking.petType,
      breed: booking.breed,
      aggressive: booking.aggressive,
      serviceName: booking.serviceName,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      address: booking.address,
      city: booking.city,
      area: booking.area,
      notes: booking.notes,
      photoUrls: booking.photoUrls ?? [],
      videoUrls: booking.videoUrls ?? [],
    };

    Promise.allSettled([
      sendBookingEmails(
        notifData,
        process.env.RESEND_API_KEY ?? businessSettings.resendApiKey,
        process.env.ADMIN_EMAIL ?? businessSettings.adminEmail,
      ),
      sendTelegramNotification(
        notifData,
        process.env.TELEGRAM_BOT_TOKEN ?? businessSettings.telegramBotToken,
        process.env.TELEGRAM_CHAT_ID ?? businessSettings.telegramChatId,
        process.env.ADMIN_DASHBOARD_URL,
      ),
    ]).catch((err) => req.log.error({ err }, "Notification error"));
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// ─── Get by ID ────────────────────────────────────────────────────────────────

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

    res.json(serializeBooking(booking));
  } catch (err) {
    req.log.error({ err }, "Failed to get booking");
    res.status(500).json({ error: "Failed to get booking" });
  }
});

// ─── Update (status + internalNotes) ─────────────────────────────────────────

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

  if (!body.data.status && body.data.internalNotes === undefined) {
    res.status(400).json({ error: "Provide status and/or internalNotes" });
    return;
  }

  try {
    const updates: Partial<typeof bookingsTable.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (body.data.status) updates.status = body.data.status;
    if (body.data.internalNotes !== undefined) updates.internalNotes = body.data.internalNotes;

    const [booking] = await db
      .update(bookingsTable)
      .set(updates)
      .where(eq(bookingsTable.id, params.data.id))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json(serializeBooking(booking));
  } catch (err) {
    req.log.error({ err }, "Failed to update booking");
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// ─── Delete ───────────────────────────────────────────────────────────────────

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
