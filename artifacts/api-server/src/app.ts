import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
const configuredOrigin = process.env.CORS_ORIGIN;

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: (origin, callback) => callback(null, !origin || !configuredOrigin || origin === configuredOrigin), methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"], maxAge: 600 }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 180, standardHeaders: true, legacyHeaders: false, message: { error: "Too many requests. Please try again later." } }));
app.use(pinoHttp({ logger, serializers: { req(req) { return { id: req.id, method: req.method, url: req.url?.split("?")[0] }; }, res(res) { return { statusCode: res.statusCode }; } } }));
app.use(express.json({ limit: "256kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));

app.use("/api", router);

export default app;
