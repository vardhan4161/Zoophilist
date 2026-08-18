import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { AdminLoginBody } from "@workspace/api-zod";
import { mongoCollections, newId } from "@workspace/db";

const router: IRouter = Router();
const ADMIN_ID = "zoophilist-admin";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function requiredSecret(name: "ADMIN_USERNAME" | "ADMIN_PASSWORD" | "SESSION_SECRET"): string {
  const value = process.env[name];
  if (!value || value.length < 12) throw new Error(`${name} is not configured`);
  return value;
}

function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function signature(value: string): string {
  return createHmac("sha256", requiredSecret("SESSION_SECRET")).update(value).digest("base64url");
}

function issueToken(id: string, expiresAt: Date): string {
  const payload = `${id}.${expiresAt.getTime()}`;
  return `${payload}.${signature(payload)}`;
}

function parseToken(token: string): { id: string; expiresAt: Date } | null {
  const [id, expiry, receivedSignature, ...extra] = token.split(".");
  if (!id || !expiry || !receivedSignature || extra.length) return null;
  const payload = `${id}.${expiry}`;
  const expectedSignature = signature(payload);
  if (receivedSignature.length !== expectedSignature.length || !timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))) return null;
  const expiresAt = new Date(Number(expiry));
  if (Number.isNaN(expiresAt.getTime()) || expiresAt <= new Date()) return null;
  return { id, expiresAt };
}

function credentialsMatch(username: string, password: string): boolean {
  const configuredUsername = requiredSecret("ADMIN_USERNAME");
  const configuredPassword = requiredSecret("ADMIN_PASSWORD");
  const userMatches = username.length === configuredUsername.length && timingSafeEqual(Buffer.from(username), Buffer.from(configuredUsername));
  const passwordMatches = password.length === configuredPassword.length && timingSafeEqual(Buffer.from(password), Buffer.from(configuredPassword));
  return userMatches && passwordMatches;
}

const loginLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false, message: { error: "Too many login attempts. Please try again later." } });

export async function requireAdmin(req: any, res: any, next: any): Promise<void> {
  try {
    const auth = req.headers.authorization as string | undefined;
    if (!auth?.startsWith("Bearer ")) return void res.status(401).json({ error: "Unauthorized" });
    const token = auth.slice(7);
    const parsed = parseToken(token);
    if (!parsed) return void res.status(401).json({ error: "Unauthorized" });
    const { adminSessions } = await mongoCollections();
    const session = await adminSessions.findOne({ id: parsed.id, tokenHash: tokenHash(token), expiresAt: { $gt: new Date() } });
    if (!session) return void res.status(401).json({ error: "Unauthorized" });
    req.adminSession = session;
    next();
  } catch {
    res.status(503).json({ error: "Admin authentication is temporarily unavailable" });
  }
}

router.post("/admin/login", loginLimiter, async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) return void res.status(400).json({ error: "Invalid login request" });
  try {
    if (!credentialsMatch(parsed.data.username, parsed.data.password)) return void res.status(401).json({ error: "Invalid credentials" });
    const id = newId();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const token = issueToken(id, expiresAt);
    const { adminSessions } = await mongoCollections();
    await adminSessions.insertOne({ id, username: parsed.data.username, tokenHash: tokenHash(token), expiresAt, createdAt: new Date() });
    res.json({ token, expiresAt: expiresAt.toISOString(), admin: { id: ADMIN_ID, username: parsed.data.username } });
  } catch {
    res.status(503).json({ error: "Admin authentication is not configured" });
  }
});

router.get("/admin/me", requireAdmin, async (req, res): Promise<void> => {
  const session = (req as any).adminSession;
  res.json({ id: ADMIN_ID, username: session.username, expiresAt: session.expiresAt.toISOString() });
});

router.post("/admin/logout", requireAdmin, async (req, res): Promise<void> => {
  const { adminSessions } = await mongoCollections();
  await adminSessions.deleteOne({ id: (req as any).adminSession.id });
  res.json({ ok: true });
});

export default router;
