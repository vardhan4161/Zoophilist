import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { servicesTable, bookingsTable, galleryTable, settingsTable } from "./schema";

const { Pool } = pg;

let pool: any = null;
let db: any = null;
export let mockDbInstance: any = null;

export const DEFAULT_SERVICES = [
  {
    id: "s1",
    name: "Spa Bath",
    price: "899",
    originalPrice: null,
    description: "A refreshing spa bath for your pet to keep them clean and healthy.",
    features: ["Bath with Shampoo", "Blow Dry", "Nail Clipping", "Ear Cleaning", "Eyes Cleaning", "Combing"],
    isSubscription: false,
    badge: "Popular",
    imageUrl: "/images/gallery-1.jpg",
    createdAt: new Date(),
  },
  {
    id: "s2",
    name: "Grooming",
    price: "1599",
    originalPrice: null,
    description: "Complete grooming package for a total makeover.",
    features: ["Bath with Shampoo", "Full Body Trimming", "Blow Dry", "Nail Clipping", "Sanitary Trim", "Ear Cleaning", "Eyes Cleaning", "Combing"],
    isSubscription: false,
    badge: "Best Value",
    imageUrl: "/images/gallery-2.jpg",
    createdAt: new Date(),
  },
  {
    id: "s3",
    name: "Hair Cut",
    price: "1199",
    originalPrice: null,
    description: "Professional haircut styling for your pet.",
    features: ["Full Body Trimming", "Nail Clipping", "Sanitary Trim"],
    isSubscription: false,
    badge: null,
    imageUrl: "/images/gallery-3.jpg",
    createdAt: new Date(),
  },
  {
    id: "s4",
    name: "Medical Bath",
    price: "1699",
    originalPrice: null,
    description: "Specialized medicated bath for skin conditions and ticks.",
    features: ["Bath with Shampoo", "Anti Tick Bath (Applying Medicine)", "Blow Dry", "Nail Clipping", "Ear Cleaning", "Eyes Cleaning", "Combing"],
    isSubscription: false,
    badge: null,
    imageUrl: "/images/gallery-4.jpg",
    createdAt: new Date(),
  },
  {
    id: "s5",
    name: "Subscription",
    price: "3899",
    originalPrice: "5899",
    description: "2-month subscription for regular grooming needs.",
    features: ["Valid for 2 Months", "Choose Any Grooming Service", "Only 3 Services"],
    isSubscription: true,
    badge: "Save ₹2000",
    imageUrl: "/images/gallery-5.jpg",
    createdAt: new Date(),
  },
];

export const DEFAULT_GALLERY = [
  {
    id: "g1",
    url: "/images/gallery-1.jpg",
    type: "image",
    category: "spa",
    caption: "Spa Bath & Relaxation for Happy Paws",
    createdAt: new Date(),
  },
  {
    id: "g2",
    url: "/images/gallery-2.jpg",
    type: "image",
    category: "grooming",
    caption: "Full Styling & Breed Specific Trimming",
    createdAt: new Date(),
  },
  {
    id: "g3",
    url: "/images/gallery-3.jpg",
    type: "image",
    category: "haircut",
    caption: "Precision Coat Styling",
    createdAt: new Date(),
  },
  {
    id: "g4",
    url: "/images/gallery-4.jpg",
    type: "image",
    category: "medical",
    caption: "Medicated Skin & Tick Treatment",
    createdAt: new Date(),
  },
  {
    id: "g5",
    url: "/images/gallery-5.jpg",
    type: "image",
    category: "grooming",
    caption: "Fluffy & Fresh After Luxury Grooming",
    createdAt: new Date(),
  },
];

export const DEFAULT_SETTINGS = [
  { key: "phone", value: "+91 9515247704", updatedAt: new Date() },
  { key: "email", value: "zoophilistpetservice@gmail.com", updatedAt: new Date() },
  { key: "address", value: "Doorstep service across major cities in India", updatedAt: new Date() },
  { key: "workingHoursStart", value: "08:00", updatedAt: new Date() },
  { key: "workingHoursEnd", value: "20:00", updatedAt: new Date() },
  { key: "workingDays", value: "Monday–Sunday", updatedAt: new Date() },
  { key: "whatsappNumber", value: "+919515247704", updatedAt: new Date() },
  { key: "adminEmail", value: "zoophilistpetservice@gmail.com", updatedAt: new Date() },
];

export function createMockDb() {
  const tables = {
    services: [...DEFAULT_SERVICES],
    bookings: [] as any[],
    gallery: [...DEFAULT_GALLERY],
    settings: [...DEFAULT_SETTINGS],
  };

  function getTableName(tableObj: any): "services" | "bookings" | "gallery" | "settings" {
    if (tableObj === servicesTable) return "services";
    if (tableObj === bookingsTable) return "bookings";
    if (tableObj === galleryTable) return "gallery";
    if (tableObj === settingsTable) return "settings";
    const name = tableObj?.[Symbol.for("drizzle:Name")] || tableObj?.name;
    if (name && tables[name as keyof typeof tables]) {
      return name as any;
    }
    return "services";
  }

  function matchCondition(item: any, condition: any): boolean {
    if (!condition) return true;
    try {
      const colName = condition.left?.name || condition.column?.name;
      const targetVal = condition.right?.value !== undefined ? condition.right.value : condition.value;
      if (colName && targetVal !== undefined) {
        return item[colName] === targetVal;
      }
    } catch {
      // fallback
    }
    return true;
  }

  return {
    _tables: tables,
    select: (fields?: any) => ({
      from: (table: any) => {
        const name = getTableName(table);
        let items = [...tables[name]];
        const chain = {
          where: (cond: any) => {
            items = items.filter((i) => matchCondition(i, cond));
            return chain;
          },
          orderBy: (_col: any) => {
            return chain;
          },
          then: (resolve: any, reject?: any) => {
            if (fields && typeof fields === "object" && "count" in fields) {
              return Promise.resolve([{ count: items.length }]).then(resolve, reject);
            }
            return Promise.resolve(items).then(resolve, reject);
          },
        };
        return chain;
      },
    }),
    insert: (table: any) => ({
      values: (values: any) => {
        const name = getTableName(table);
        const item = {
          id: values.id || crypto.randomUUID(),
          createdAt: values.createdAt || new Date(),
          updatedAt: values.updatedAt || new Date(),
          ...values,
        };
        tables[name].push(item);
        const chain = {
          returning: () => Promise.resolve([item]),
          onConflictDoUpdate: ({ set }: any) => {
            const existingIdx = tables[name].findIndex((i) => i.key === item.key);
            if (existingIdx >= 0) {
              tables[name][existingIdx] = { ...tables[name][existingIdx], ...set, updatedAt: new Date() };
              return Promise.resolve([tables[name][existingIdx]]);
            }
            return Promise.resolve([item]);
          },
          then: (resolve: any, reject?: any) => Promise.resolve([item]).then(resolve, reject),
        };
        return chain;
      },
    }),
    update: (table: any) => ({
      set: (updates: any) => ({
        where: (cond: any) => {
          const name = getTableName(table);
          const idx = tables[name].findIndex((i) => matchCondition(i, cond));
          let updated: any = null;
          if (idx >= 0) {
            tables[name][idx] = { ...tables[name][idx], ...updates, updatedAt: new Date() };
            updated = tables[name][idx];
          }
          return {
            returning: () => Promise.resolve(updated ? [updated] : []),
            then: (resolve: any, reject?: any) => Promise.resolve(updated ? [updated] : []).then(resolve, reject),
          };
        },
      }),
    }),
    delete: (table: any) => ({
      where: (cond: any) => {
        const name = getTableName(table);
        tables[name] = tables[name].filter((i) => !matchCondition(i, cond));
        return Promise.resolve();
      },
    }),
  };
}

mockDbInstance = createMockDb();

export async function initDbSchema() {
  if (!pool) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS services (
          id text PRIMARY KEY,
          name text NOT NULL,
          price numeric(10, 2) NOT NULL,
          original_price numeric(10, 2),
          description text,
          features text[] NOT NULL DEFAULT '{}',
          is_subscription boolean NOT NULL DEFAULT false,
          badge text,
          image_url text,
          created_at timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS bookings (
          id text PRIMARY KEY,
          booking_id text UNIQUE,
          customer_name text NOT NULL,
          customer_phone text NOT NULL,
          customer_email text,
          city text,
          area text,
          address text,
          latitude text,
          longitude text,
          map_url text,
          pet_name text NOT NULL,
          pet_type text NOT NULL,
          breed text,
          age text,
          aggressive boolean DEFAULT false,
          service_id text,
          service_name text NOT NULL,
          preferred_date text,
          preferred_time text,
          notes text,
          internal_notes text,
          photo_urls text[] NOT NULL DEFAULT '{}',
          video_urls text[] NOT NULL DEFAULT '{}',
          status text NOT NULL DEFAULT 'pending',
          created_at timestamp NOT NULL DEFAULT now(),
          updated_at timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS gallery (
          id text PRIMARY KEY,
          url text NOT NULL,
          type text NOT NULL DEFAULT 'image',
          category text NOT NULL DEFAULT 'grooming',
          caption text,
          created_at timestamp NOT NULL DEFAULT now()
        );

        CREATE TABLE IF NOT EXISTS settings (
          key text PRIMARY KEY,
          value text NOT NULL,
          updated_at timestamp NOT NULL DEFAULT now()
        );
      `);

      // Seed default services if empty
      const servicesCheck = await client.query("SELECT COUNT(*) FROM services");
      if (parseInt(servicesCheck.rows[0].count, 10) === 0) {
        for (const s of DEFAULT_SERVICES) {
          await client.query(
            `INSERT INTO services (id, name, price, original_price, description, features, is_subscription, badge, image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
            [s.id, s.name, s.price, s.originalPrice, s.description, s.features, s.isSubscription, s.badge, s.imageUrl]
          );
        }
      }

      // Seed default gallery if empty
      const galleryCheck = await client.query("SELECT COUNT(*) FROM gallery");
      if (parseInt(galleryCheck.rows[0].count, 10) === 0) {
        for (const g of DEFAULT_GALLERY) {
          await client.query(
            `INSERT INTO gallery (id, url, type, category, caption)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
            [g.id, g.url, g.type, g.category, g.caption]
          );
        }
      }

      // Seed default settings if empty
      const settingsCheck = await client.query("SELECT COUNT(*) FROM settings");
      if (parseInt(settingsCheck.rows[0].count, 10) === 0) {
        for (const st of DEFAULT_SETTINGS) {
          await client.query(
            `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING`,
            [st.key, st.value]
          );
        }
      }
      console.info("[Database] PostgreSQL tables verified and seeded successfully.");
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[Database] Failed to initialize PostgreSQL tables, queries will fall back if needed:", err);
  }
}

if (process.env.DATABASE_URL) {
  try {
    const isLocal =
      process.env.DATABASE_URL.includes("localhost") ||
      process.env.DATABASE_URL.includes("127.0.0.1");

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err: any) => {
      console.warn("[Database] Unexpected error on idle PostgreSQL client:", err.message);
    });

    db = drizzle(pool, { schema });
    // Trigger non-blocking schema verification
    initDbSchema().catch((err) => {
      console.warn("[Database] Initial schema setup deferred:", err.message);
    });
  } catch (err) {
    console.warn("[Database] Database connection failed, falling back to in-memory store", err);
    db = mockDbInstance;
  }
} else {
  console.info("[Database] DATABASE_URL not set — using in-memory store");
  db = mockDbInstance;
}

export { pool, db };
export * from "./schema";

