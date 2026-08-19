import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("Render deployment blueprint", () => {
  it("builds the Vite client before starting one same-origin Express service", async () => {
    const [blueprint, packageJson] = await Promise.all([
      readFile(path.join(projectRoot, "render.yaml"), "utf8"),
      readFile(path.join(projectRoot, "package.json"), "utf8"),
    ]);

    expect(blueprint).toContain("healthCheckPath: /api/healthz");
    expect(blueprint).toContain("SERVE_STATIC");
    expect(blueprint).toContain("plan: starter");
    expect(blueprint).toContain("sync: false");
    expect(blueprint).not.toMatch(/mongodb\+srv:\/\//i);
    expect(packageJson).toContain('"render:build"');
    expect(packageJson).toContain('"render:start"');

    const pnpmWorkspace = await readFile(
      path.join(projectRoot, "pnpm-workspace.yaml"),
      "utf8",
    );
    expect(pnpmWorkspace).toMatch(/allowBuilds:\s+esbuild: true/m);
  });
});
