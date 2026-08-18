import { randomUUID } from "node:crypto";
import { MongoClient, type Db } from "mongodb";

export const bookingStatuses = ["pending", "confirmed", "scheduled", "completed", "cancelled"] as const;
export type BookingStatus = (typeof bookingStatuses)[number];
export type ServiceDocument = { id: string; name: string; price: number; originalPrice?: number; description?: string; features: string[]; isSubscription: boolean; badge?: string; imageUrl?: string; isHidden: boolean; deletedAt?: Date; createdAt: Date; updatedAt: Date };
export type BookingDocument = { id: string; bookingId: string; customerName: string; customerPhone: string; customerEmail?: string; city?: string; area?: string; address?: string; petName: string; petType: string; breed?: string; age?: string; gender?: string; aggressive: boolean; serviceId?: string; serviceName: string; preferredDate?: string; preferredTime?: string; notes?: string; internalNotes?: string; photoUrls: string[]; videoUrls: string[]; status: BookingStatus; statusHistory: Array<{ status: BookingStatus; at: Date; note?: string }>; deletedAt?: Date; createdAt: Date; updatedAt: Date };
export type GalleryDocument = { id: string; url: string; publicId?: string; type: "image" | "video"; category?: string; caption?: string; featured: boolean; createdAt: Date; updatedAt: Date };
export type SettingDocument = { key: string; value: string; updatedAt: Date };
export type NotificationDocument = { id: string; bookingId: string; channel: "email" | "telegram" | "sms"; event: string; status: "sent" | "failed" | "skipped"; detail?: string; createdAt: Date };
export type ActivityDocument = { id: string; action: string; targetType: string; targetId?: string; metadata?: Record<string, unknown>; createdAt: Date };
export type AdminSessionDocument = { id: string; username: string; tokenHash: string; expiresAt: Date; createdAt: Date };

let client: MongoClient | undefined;
let database: Db | undefined;
let initialization: Promise<void> | undefined;

export async function getMongoDb(): Promise<Db> {
  if (database) return database;
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 15_000 });
  await client.connect();
  database = client.db("zoophilist");
  return database;
}

export async function mongoCollections() {
  const db = await getMongoDb();
  return {
    services: db.collection<ServiceDocument>("services"), bookings: db.collection<BookingDocument>("bookings"), gallery: db.collection<GalleryDocument>("gallery"), settings: db.collection<SettingDocument>("settings"), notifications: db.collection<NotificationDocument>("notifications"), activityLogs: db.collection<ActivityDocument>("activityLogs"), adminSessions: db.collection<AdminSessionDocument>("adminSessions"), counters: db.collection<{ key: string; value: number }>("counters"),
  } as const;
}

const DEFAULT_SERVICES: Array<Pick<ServiceDocument, "name" | "price" | "description" | "features" | "isSubscription" | "badge">> = [
  { name: "Spa Bath", price: 899, description: "Premium cleansing and coat care.", features: ["Gentle cleanse", "Coat conditioning"], isSubscription: false, badge: "Popular" },
  { name: "Grooming", price: 1599, description: "Complete doorstep grooming session.", features: ["Bath", "Nail care", "Coat styling"], isSubscription: false },
  { name: "Hair Cut", price: 1199, description: "Comfort-focused professional trim.", features: ["Consultation", "Breed-aware trim"], isSubscription: false },
  { name: "Medical Bath", price: 1699, description: "Anti Tick Bath (Applying Medicine).", features: ["Medicated wash", "Tick care"], isSubscription: false },
  { name: "Subscription", price: 3899, description: "Valid for 2 months; includes 3 services.", features: ["2 month validity", "3 services"], isSubscription: true, badge: "Best value" },
];

export async function initializeMongoData(): Promise<void> {
  if (initialization) return initialization;
  initialization = (async () => {
    const { services, bookings, gallery, settings, notifications, activityLogs, adminSessions, counters } = await mongoCollections();
    await Promise.all([services.createIndex({ id: 1 }, { unique: true }), bookings.createIndex({ id: 1 }, { unique: true }), bookings.createIndex({ bookingId: 1 }, { unique: true }), bookings.createIndex({ status: 1, createdAt: -1 }), gallery.createIndex({ id: 1 }, { unique: true }), settings.createIndex({ key: 1 }, { unique: true }), notifications.createIndex({ bookingId: 1, createdAt: -1 }), activityLogs.createIndex({ createdAt: -1 }), adminSessions.createIndex({ id: 1 }, { unique: true }), adminSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }), counters.createIndex({ key: 1 }, { unique: true })]);
    if (await services.countDocuments() === 0) {
      const now = new Date();
      await services.insertMany(DEFAULT_SERVICES.map((service) => ({ ...service, id: randomUUID(), isHidden: false, createdAt: now, updatedAt: now })));
    }
  })().catch((error) => {
    initialization = undefined;
    throw error;
  });
  return initialization;
}

export async function nextBookingId(): Promise<string> {
  const { counters } = await mongoCollections();
  const year = new Date().getUTCFullYear(); const key = `booking:${year}`;
  const counter = await counters.findOneAndUpdate({ key }, { $inc: { value: 1 }, $setOnInsert: { key } }, { upsert: true, returnDocument: "after" });
  return `ZOO-${year}-${String(counter?.value ?? 1).padStart(6, "0")}`;
}

export const newId = () => randomUUID();
export async function closeMongo(): Promise<void> { await client?.close(); client = undefined; database = undefined; initialization = undefined; }
