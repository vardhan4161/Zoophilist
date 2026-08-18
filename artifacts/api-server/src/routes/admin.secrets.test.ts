import { describe, expect, it } from "vitest";
import { validateAdminSecret } from "./admin";

describe("administrator secret validation", () => {
  it("accepts a practical administrator username", () => {
    expect(validateAdminSecret("ADMIN_USERNAME", "admin")).toBe("admin");
  });

  it("requires a strong administrator password and session-signing secret", () => {
    expect(() => validateAdminSecret("ADMIN_PASSWORD", "short-pass")).toThrow("ADMIN_PASSWORD is not configured");
    expect(() => validateAdminSecret("SESSION_SECRET", "a".repeat(31))).toThrow("SESSION_SECRET is not configured");
    expect(validateAdminSecret("ADMIN_PASSWORD", "strong-password")).toBe("strong-password");
    expect(validateAdminSecret("SESSION_SECRET", "a".repeat(32))).toHaveLength(32);
  });
});
