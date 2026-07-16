import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryTable = pgTable("gallery", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  type: text("type").$type<"image" | "video">().notNull().default("image"),
  category: text("category").notNull().default("grooming"),
  caption: text("caption"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertGallerySchema = createInsertSchema(galleryTable).omit({ id: true, createdAt: true });
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type GalleryItem = typeof galleryTable.$inferSelect;
