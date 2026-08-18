import { Router, type IRouter } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router: IRouter = Router();

// Simple admin auth — credentials from env or defaults
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "zoophilist2024";
const ADMIN_ID = "admin-001";

// In-memory session store (tokens)
const activeSessions = new Set<string>();

function generateToken(): string {
  return crypto.randomUUID() + "-" + Date.now();
}

export function requireAdmin(req: any, res: any, next: any): void {
  const auth = req.headers.authorization as string | undefined;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  if (!activeSessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as any).adminToken = token;
  next();
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken();
  activeSessions.add(token);

  res.json({
    token,
    admin: { id: ADMIN_ID, username: ADMIN_USERNAME },
  });
});

router.get("/admin/me", requireAdmin, async (_req, res): Promise<void> => {
  res.json({ id: ADMIN_ID, username: ADMIN_USERNAME });
});

router.post("/admin/logout", requireAdmin, async (req, res): Promise<void> => {
  const token = (req as any).adminToken as string;
  activeSessions.delete(token);
  res.json({ ok: true });
});

export default router;
