import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("@workspace/db", () => ({ reserveMonthlyEmailSlot: vi.fn() }));
import { reserveMonthlyEmailSlot } from "@workspace/db";
import { sendBookingEmails, sendFast2SmsNotification, sendTelegramNotification } from "./notifications";

const booking = {
  bookingId: "ZOO-2026-000001",
  customerName: "Asha <Test>",
  customerPhone: "+91 98765 43210",
  customerEmail: "asha@example.com",
  petName: "Milo",
  petType: "Dog",
  serviceName: "Spa Bath",
  status: "confirmed",
};

const originalEnv = { ...process.env };

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.mocked(reserveMonthlyEmailSlot).mockReset();
  vi.mocked(reserveMonthlyEmailSlot).mockResolvedValue({ reserved: true, limit: 1_000, used: 1 });
  process.env = { ...originalEnv };
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM_EMAIL;
  delete process.env.ADMIN_EMAIL;
  delete process.env.RESEND_MODE;
  delete process.env.RESEND_TEST_RECIPIENT;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  delete process.env.FAST2SMS_API_KEY;
  delete process.env.FAST2SMS_SENDER_ID;
  delete process.env.FAST2SMS_TEMPLATE_ID;
  delete process.env.FAST2SMS_VARIABLES;
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("booking notifications", () => {
  it("skips all outbound delivery safely when providers are not configured", async () => {
    await expect(sendBookingEmails(booking, "created")).resolves.toMatchObject({ channel: "email", status: "skipped" });
    await expect(sendTelegramNotification(booking, "created")).resolves.toMatchObject({ channel: "telegram", status: "skipped" });
    await expect(sendFast2SmsNotification(booking, "created")).resolves.toMatchObject({ channel: "sms", status: "skipped" });
  });

  it("rejects an invalid Indian SMS recipient without calling the provider", async () => {
    process.env.FAST2SMS_API_KEY = "test-key";
    process.env.FAST2SMS_SENDER_ID = "ZOOPET";
    process.env.FAST2SMS_TEMPLATE_ID = "template-id";
    process.env.FAST2SMS_VARIABLES = "customerName,bookingId,status";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendFast2SmsNotification({ ...booking, customerPhone: "123" }, "status")).resolves.toMatchObject({ status: "skipped" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("builds a DLT-compliant Fast2SMS request using normalized mobile and template values", async () => {
    process.env.FAST2SMS_API_KEY = "test-key";
    process.env.FAST2SMS_SENDER_ID = "ZOOPET";
    process.env.FAST2SMS_TEMPLATE_ID = "template-id";
    process.env.FAST2SMS_VARIABLES = "customerName,bookingId,status";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendFast2SmsNotification(booking, "status")).resolves.toEqual({ channel: "sms", status: "sent" });
    const requestUrl = String(fetchMock.mock.calls[0]?.[0]);
    expect(requestUrl).toContain("route=dlt");
    expect(requestUrl).toContain("sender_id=ZOOPET");
    expect(requestUrl).toContain("message=template-id");
    expect(requestUrl).toContain("numbers=9876543210");
    expect(requestUrl).toContain("variables_values=Asha+%3CTest%3E%7CZOO-2026-000001%7Cconfirmed");
  });

  it("fails safely without an approved Fast2SMS variable mapping", async () => {
    process.env.FAST2SMS_API_KEY = "test-key";
    process.env.FAST2SMS_SENDER_ID = "ZOOPET";
    process.env.FAST2SMS_TEMPLATE_ID = "template-id";
    await expect(sendFast2SmsNotification(booking, "created")).resolves.toMatchObject({ status: "skipped", detail: "Fast2SMS approved template variable mapping is incomplete" });
  });

  it("sends configured Resend email with escaped customer-provided HTML", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_FROM_EMAIL = "bookings@example.com";
    process.env.ADMIN_EMAIL = "admin@example.com";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendBookingEmails(booking, "created")).resolves.toEqual({ channel: "email", status: "sent" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(reserveMonthlyEmailSlot).toHaveBeenCalledTimes(2);
    const customerBody = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(customerBody.html).toContain("Asha &lt;Test&gt;");
    expect(customerBody.html).not.toContain("Asha <Test>");
  });

  it("safely skips Resend delivery when the monthly allowance is exhausted", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_FROM_EMAIL = "bookings@example.com";
    process.env.ADMIN_EMAIL = "admin@example.com";
    vi.mocked(reserveMonthlyEmailSlot).mockResolvedValue({ reserved: false, limit: 1_000, used: 1_000 });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendBookingEmails(booking, "created")).resolves.toEqual({ channel: "email", status: "skipped", detail: "Resend monthly email limit reached (1000)" });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(reserveMonthlyEmailSlot).toHaveBeenCalledTimes(2);
  });

  it("sends only to the configured test recipient when Resend test mode is enabled", async () => {
    process.env.RESEND_API_KEY = "test-key";
    process.env.RESEND_FROM_EMAIL = "bookings@example.com";
    process.env.RESEND_MODE = "test";
    process.env.RESEND_TEST_RECIPIENT = "sandbox@example.com";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendBookingEmails(booking, "created")).resolves.toEqual({ channel: "email", status: "sent" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ to: "sandbox@example.com" });
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain("asha@example.com");
  });

  it("sends a configured Telegram administrator alert", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-bot-token";
    process.env.TELEGRAM_CHAT_ID = "123456";
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendTelegramNotification(booking, "status")).resolves.toEqual({ channel: "telegram", status: "sent" });
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain("/bottest-bot-token/sendMessage");
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ chat_id: "123456", parse_mode: "Markdown" });
  });
});
