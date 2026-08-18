import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/** Key-value store for persisted business settings */
export const settingsTable = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
