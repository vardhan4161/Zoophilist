import { Router, type IRouter } from "express";
import { bookingStatuses, type BookingDocument, type BookingStatus, initializeMongoData, mongoCollections, newId, nextBookingId } from "@workspace/db";
import { CreateBookingBody, DeleteBookingParams, GetBookingByIdParams, GetBookingsQueryParams, UpdateBookingStatusBody, UpdateBookingStatusParams } from "@workspace/api-zod";
import { sendBookingEmails, sendFast2SmsNotification, sendTelegramNotification } from "../lib/notifications";
import { requireAdmin } from "./admin";

const router: IRouter = Router();
const serialise = (booking: any) => { const { _id, ...record } = booking; return { ...record, photoUrls: record.photoUrls ?? [], videoUrls: record.videoUrls ?? [], createdAt: new Date(record.createdAt).toISOString(), updatedAt: new Date(record.updatedAt).toISOString() }; };
const notify = (booking: BookingDocument, event: "created" | "status") => {
  const payload = { ...booking, customerEmail: booking.customerEmail ?? undefined };
  void Promise.all([
    sendBookingEmails(payload, event),
    sendTelegramNotification(payload, event),
    sendFast2SmsNotification(payload, event),
  ]).then(async (outcomes) => {
    const { notifications } = await mongoCollections();
    await notifications.insertMany(outcomes.map((outcome) => ({ id: newId(), bookingId: booking.bookingId, channel: outcome.channel, event, status: outcome.status, detail: outcome.detail, createdAt: new Date() })));
  }).catch(() => undefined);
};

router.get("/bookings/stats", requireAdmin, async (_req, res) => {
  try {
    await initializeMongoData(); const { bookings, services } = await mongoCollections();
    const all = (await bookings.find({ deletedAt: { $exists: false } }).sort({ createdAt: -1 }).toArray()) as unknown as BookingDocument[];
    const serviceRows = (await services.find({}).toArray()) as unknown as Array<{ name: string; price: number }>;
    const prices = new Map<string, number>(serviceRows.map((service) => [service.name, service.price]));
    const statuses = Object.fromEntries(bookingStatuses.map((status: BookingStatus) => [status, all.filter((booking: BookingDocument) => booking.status === status).length]));
    const counts = new Map<string, number>(); all.forEach((booking: BookingDocument) => counts.set(booking.serviceName, (counts.get(booking.serviceName) ?? 0) + 1));
    const week = new Date(Date.now() - 7 * 86400000);
    res.json({ totalRequests: all.length, ...statuses, totalRevenue: all.filter((booking: BookingDocument) => booking.status === "completed").reduce((sum: number, booking: BookingDocument) => sum + (prices.get(booking.serviceName) ?? 0), 0), weeklyRequests: all.filter((booking: BookingDocument) => booking.createdAt >= week).length, popularServices: [...counts].map(([serviceName, count]) => ({ serviceName, count, percentage: all.length ? Math.round((count / all.length) * 100) : 0 })).sort((a, b) => b.count - a.count).slice(0, 5), recentBookings: all.slice(0, 10).map(serialise) });
  } catch (error) { res.status(500).json({ error: "Failed to get booking stats" }); }
});

router.get("/bookings", requireAdmin, async (req, res) => {
  const parsed = GetBookingsQueryParams.safeParse(req.query); if (!parsed.success) return void res.status(400).json({ error: parsed.error.message });
  try { await initializeMongoData(); const { status, page = 1, limit = 20 } = parsed.data; const { bookings } = await mongoCollections(); const filter: any = { deletedAt: { $exists: false }, ...(status ? { status } : {}) }; const total = await bookings.countDocuments(filter); const rows = await bookings.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(); res.json({ bookings: rows.map(serialise), total, page, limit, totalPages: Math.ceil(total / limit) }); } catch { res.status(500).json({ error: "Failed to get bookings" }); }
});

router.post("/bookings", async (req, res) => {
  const parsed = CreateBookingBody.safeParse(req.body); if (!parsed.success) return void res.status(400).json({ error: parsed.error.message });
  try {
    await initializeMongoData(); const { bookings, activityLogs } = await mongoCollections(); const now = new Date(); const booking: BookingDocument = { ...parsed.data, id: newId(), bookingId: await nextBookingId(), status: "pending", statusHistory: [{ status: "pending", at: now }], photoUrls: parsed.data.photoUrls ?? [], videoUrls: parsed.data.videoUrls ?? [], aggressive: parsed.data.aggressive ?? false, createdAt: now, updatedAt: now };
    await bookings.insertOne(booking); await activityLogs.insertOne({ id: newId(), action: "booking.created", targetType: "booking", targetId: booking.id, metadata: { bookingId: booking.bookingId }, createdAt: now }); res.status(201).json(serialise(booking)); notify(booking, "created");
  } catch { res.status(500).json({ error: "Failed to create booking" }); }
});

router.get("/bookings/:id", requireAdmin, async (req, res) => { const parsed = GetBookingByIdParams.safeParse(req.params); if (!parsed.success) return void res.status(400).json({ error: parsed.error.message }); try { const { bookings } = await mongoCollections(); const booking = await bookings.findOne({ id: parsed.data.id }); if (!booking) return void res.status(404).json({ error: "Booking not found" }); res.json(serialise(booking)); } catch { res.status(500).json({ error: "Failed to get booking" }); } });

router.patch("/bookings/:id", requireAdmin, async (req, res) => {
  const params = UpdateBookingStatusParams.safeParse(req.params), body = UpdateBookingStatusBody.safeParse(req.body); if (!params.success || !body.success) return void res.status(400).json({ error: !params.success ? params.error.message : (!body.success ? body.error.message : "Invalid request") }); if (!body.data.status && body.data.internalNotes === undefined) return void res.status(400).json({ error: "Provide status and/or internalNotes" });
  try { const { bookings, activityLogs } = await mongoCollections(); const now = new Date(); const set: any = { updatedAt: now }; if (body.data.status) set.status = body.data.status as BookingStatus; if (body.data.internalNotes !== undefined) set.internalNotes = body.data.internalNotes; const update: any = { $set: set }; if (body.data.status) update.$push = { statusHistory: { status: body.data.status, at: now } }; const result = await bookings.findOneAndUpdate({ id: params.data.id, deletedAt: { $exists: false } }, update, { returnDocument: "after" }); if (!result) return void res.status(404).json({ error: "Booking not found" }); await activityLogs.insertOne({ id: newId(), action: "booking.updated", targetType: "booking", targetId: result.id, metadata: { status: body.data.status }, createdAt: now }); res.json(serialise(result)); if (body.data.status) notify(result, "status"); } catch { res.status(500).json({ error: "Failed to update booking" }); }
});

router.delete("/bookings/:id", requireAdmin, async (req, res) => { const parsed = DeleteBookingParams.safeParse(req.params); if (!parsed.success) return void res.status(400).json({ error: parsed.error.message }); try { const { bookings } = await mongoCollections(); await bookings.updateOne({ id: parsed.data.id }, { $set: { deletedAt: new Date(), updatedAt: new Date() } }); res.sendStatus(204); } catch { res.status(500).json({ error: "Failed to delete booking" }); } });

export default router;
