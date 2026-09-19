import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";
import { servicesTable, bookingsTable, galleryTable, settingsTable } from "./schema";

const { Pool } = pg;

let pool: any = null;
let db: any = null;

const DEFAULT_SERVICES = [
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

const DEFAULT_GALLERY = [
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

const DEFAULT_SETTINGS = [
  { key: "phone", value: "+91 9515247704", updatedAt: new Date() },
  { key: "email", value: "zoophilistpetservice@gmail.com", updatedAt: new Date() },
  { key: "address", value: "Doorstep service across major cities in India", updatedAt: new Date() },
  { key: "workingHoursStart", value: "08:00", updatedAt: new Date() },
  { key: "workingHoursEnd", value: "20:00", updatedAt: new Date() },
  { key: "workingDays", value: "Monday–Sunday", updatedAt: new Date() },
  { key: "whatsappNumber", value: "+919515247704", updatedAt: new Date() },
  { key: "adminEmail", value: "zoophilistpetservice@gmail.com", updatedAt: new Date() },
];

function createMockDb() {
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

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle(pool, { schema });
  } catch (err) {
    console.warn("[AI Studio] Database connection failed, falling back to in-memory store", err);
    db = createMockDb();
  }
} else {
  console.info("[AI Studio] DATABASE_URL not set — using in-memory store");
  db = createMockDb();
}

export { pool, db };
export * from "./schema";

