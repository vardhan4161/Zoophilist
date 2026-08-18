import { describe, expect, it, vi } from "vitest";
import { reserveMonthlyEmailSlot } from "./index";

const now = new Date("2033-05-15T12:00:00.000Z");

describe("reserveMonthlyEmailSlot", () => {
  it("creates a UTC-month reservation within the configured cap", async () => {
    const quotaStore = {
      findOneAndUpdate: vi.fn().mockResolvedValue({ key: "resend:2033-05", sent: 1 }),
      findOne: vi.fn(),
    };

    await expect(reserveMonthlyEmailSlot(5_000, now, quotaStore as never)).resolves.toEqual({ reserved: true, limit: 1_000, used: 1 });
    expect(quotaStore.findOneAndUpdate).toHaveBeenCalledWith(
      { key: "resend:2033-05", sent: { $lt: 1_000 } },
      expect.objectContaining({ $inc: { sent: 1 } }),
      expect.objectContaining({ upsert: true, returnDocument: "after" }),
    );
  });

  it("reports a full monthly cap without reserving another delivery", async () => {
    const quotaStore = {
      findOneAndUpdate: vi.fn().mockResolvedValue(null),
      findOne: vi.fn().mockResolvedValue({ key: "resend:2033-05", sent: 1_000 }),
    };

    await expect(reserveMonthlyEmailSlot(1_000, now, quotaStore as never)).resolves.toEqual({ reserved: false, limit: 1_000, used: 1_000 });
  });

  it("handles a duplicate-key race at the cap by safely declining the slot", async () => {
    const quotaStore = {
      findOneAndUpdate: vi.fn().mockRejectedValue({ code: 11000 }),
      findOne: vi.fn().mockResolvedValue({ key: "resend:2033-05", sent: 1_000 }),
    };

    await expect(reserveMonthlyEmailSlot(1_000, now, quotaStore as never)).resolves.toEqual({ reserved: false, limit: 1_000, used: 1_000 });
    expect(quotaStore.findOne).toHaveBeenCalledWith({ key: "resend:2033-05" });
  });
});
