import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiApp from "./artifacts/api-server/src/app";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mount API server
  app.use(apiApp);

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve("artifacts/zoophilist/dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const vite = await createViteServer({
      configFile: path.resolve("artifacts/zoophilist/vite.config.ts"),
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Zoophilist server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
