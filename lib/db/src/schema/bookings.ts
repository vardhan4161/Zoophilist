import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingStatusValues = ["pending", "confirmed", "scheduled", "completed", "cancelled"] as const;
export type BookingStatus = typeof bookingStatusValues[number];

export const bookingsTable = pgTable("bookings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  /** Human-readable booking reference, e.g. ZOO-2026-000001 */
  bookingId: text("booking_id").unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  city: text("city"),
  area: text("area"),
  address: text("address"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  mapUrl: text("map_url"),
  petName: text("pet_name").notNull(),
  petType: text("pet_type").notNull(),
  breed: text("breed"),
  age: text("age"),
  aggressive: boolean("aggressive").default(false),
  serviceId: text("service_id"),
  serviceName: text("service_name").notNull(),
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  notes: text("notes"),
  internalNotes: text("internal_notes"),
  photoUrls: text("photo_urls").array().notNull().default([]),
  videoUrls: text("video_urls").array().notNull().default([]),
  status: text("status").$type<BookingStatus>().notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
