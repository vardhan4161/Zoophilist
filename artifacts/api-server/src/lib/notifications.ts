import { reserveMonthlyEmailSlot } from "@workspace/db";
import { logger } from "./logger";

export interface BookingNotificationData {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  petName: string;
  petType: string;
  breed?: string | null;
  aggressive?: boolean | null;
  serviceName: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  address?: string | null;
  city?: string | null;
  area?: string | null;
  notes?: string | null;
  photoUrls?: string[];
  videoUrls?: string[];
  status?: string;
}

export type BookingNotificationEvent = "created" | "status";
export type NotificationOutcome = {
  channel: "email" | "telegram" | "sms";
  status: "sent" | "failed" | "skipped";
  detail?: string;
};

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
const escapeMarkdown = (value: string) => value.replace(/[_*\[\]()~`>#+=|{}.!-]/g, (character) => `\\${character}`);
const safeString = (value?: string | null) => escapeHtml(value ?? "");
const safeUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "#";
  } catch {
    return "#";
  }
};

function statusLabel(event: BookingNotificationEvent, status?: string) {
  if (event === "created") return "Booking received";
  return status ? `Booking ${status}` : "Booking updated";
}

function bookingEmailHtml(booking: BookingNotificationData, event: BookingNotificationEvent, recipient: "customer" | "admin") {
  const title = statusLabel(event, booking.status);
  const greeting = recipient === "customer"
    ? `Hi ${safeString(booking.customerName)}, ${event === "created" ? "we have received your booking request and will confirm it shortly." : `your booking status is now ${safeString(booking.status ?? "updated")}.`}`
    : `${event === "created" ? "A new booking requires review." : "A booking status was updated."}`;
  const dashboardUrl = safeUrl(process.env.ADMIN_DASHBOARD_URL ?? "");
  const location = [booking.city, booking.area, booking.address].filter(Boolean).map((value) => safeString(value)).join(", ");
  const mediaLinks = [...(booking.photoUrls ?? []), ...(booking.videoUrls ?? [])]
    .map((url, index) => `<a href="${safeUrl(url)}" style="color:#15803d">Attachment ${index + 1}</a>`)
    .join(" · ");

  return `<!doctype html><html lang="en"><body style="margin:0;background:#f6faf6;font-family:Arial,sans-serif;color:#172117"><table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #dcebdc;border-radius:16px;overflow:hidden"><tr><td style="background:#166534;padding:26px 32px;color:#fff"><strong style="font-size:24px">Zoophilist</strong><div style="margin-top:4px;color:#dcfce7">Doorstep pet grooming</div></td></tr><tr><td style="padding:32px"><h1 style="margin:0 0 12px;color:#166534;font-size:24px">${title}</h1><p style="line-height:1.6">${greeting}</p><div style="border:1px solid #dcebdc;border-radius:12px;padding:18px;margin:22px 0"><strong style="display:block;color:#166534;font-size:18px">${safeString(booking.bookingId)}</strong><span style="color:#5f6f5f">Booking reference</span><hr style="border:0;border-top:1px solid #e8f0e8;margin:16px 0"/><p><strong>Service:</strong> ${safeString(booking.serviceName)}</p><p><strong>Pet:</strong> ${safeString(booking.petName)} (${safeString(booking.petType)})</p>${booking.preferredDate ? `<p><strong>Preferred date:</strong> ${safeString(booking.preferredDate)}</p>` : ""}${booking.preferredTime ? `<p><strong>Preferred time:</strong> ${safeString(booking.preferredTime)}</p>` : ""}${recipient === "admin" ? `<p><strong>Customer:</strong> ${safeString(booking.customerName)} · ${safeString(booking.customerPhone)}</p>${booking.customerEmail ? `<p><strong>Email:</strong> ${safeString(booking.customerEmail)}</p>` : ""}${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}${booking.notes ? `<p><strong>Notes:</strong> ${safeString(booking.notes)}</p>` : ""}${mediaLinks ? `<p><strong>Media:</strong> ${mediaLinks}</p>` : ""}` : ""}</div>${recipient === "admin" && dashboardUrl !== "#" ? `<a href="${dashboardUrl}" style="display:inline-block;background:#15803d;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">Open dashboard</a>` : ""}<p style="margin-top:28px;color:#5f6f5f;font-size:13px">For help, contact Zoophilist at zoophilistpetservice@gmail.com.</p></td></tr></table></td></tr></table></body></html>`;
}

async function resendSend(to: string, subject: string, html: string, apiKey: string, from: string): Promise<NotificationOutcome> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!response.ok) {
      logger.error({ status: response.status }, "Resend request failed");
      return { channel: "email", status: "failed", detail: "Resend rejected the request" };
    }
    return { channel: "email", status: "sent" };
  } catch (error) {
    logger.error({ error }, "Resend request failed");
    return { channel: "email", status: "failed", detail: "Resend request failed" };
  }
}

function resendMonthlyLimit(): number {
  const configured = Number.parseInt(process.env.RESEND_MONTHLY_LIMIT ?? "1000", 10);
  return Number.isFinite(configured) ? Math.min(1_000, Math.max(0, configured)) : 1_000;
}

function resendRecipients(booking: BookingNotificationData, adminEmail?: string): { recipients: Array<{ to: string; recipient: "customer" | "admin" }>; error?: string } {
  if (process.env.RESEND_MODE === "test") {
    const recipient = process.env.RESEND_TEST_RECIPIENT?.trim();
    if (!recipient) return { recipients: [], error: "Resend test mode requires RESEND_TEST_RECIPIENT" };
    return { recipients: [{ to: recipient, recipient: "admin" }] };
  }
  return {
    recipients: [
      booking.customerEmail ? { to: booking.customerEmail, recipient: "customer" as const } : null,
      adminEmail ? { to: adminEmail, recipient: "admin" as const } : null,
    ].filter((recipient): recipient is { to: string; recipient: "customer" | "admin" } => Boolean(recipient)),
  };
}

export async function sendBookingEmails(booking: BookingNotificationData, event: BookingNotificationEvent): Promise<NotificationOutcome> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !from) return { channel: "email", status: "skipped", detail: "Resend is not configured" };

  const subject = `${statusLabel(event, booking.status)} — ${booking.bookingId} | Zoophilist`;
  const recipientConfiguration = resendRecipients(booking, adminEmail);
  if (recipientConfiguration.error) return { channel: "email", status: "skipped", detail: recipientConfiguration.error };
  const { recipients } = recipientConfiguration;
  if (!recipients.length) return { channel: "email", status: "skipped", detail: "No email recipient configured" };

  const emailBooking = process.env.RESEND_MODE === "test" ? { ...booking, customerEmail: undefined } : booking;
  const outcomes: NotificationOutcome[] = [];
  for (const recipient of recipients) {
    try {
      const quota = await reserveMonthlyEmailSlot(resendMonthlyLimit());
      if (!quota.reserved) {
        outcomes.push({ channel: "email", status: "skipped", detail: `Resend monthly email limit reached (${quota.limit})` });
        continue;
      }
      outcomes.push(await resendSend(recipient.to, subject, bookingEmailHtml(emailBooking, event, recipient.recipient), apiKey, from));
    } catch (error) {
      logger.error({ error }, "Resend quota reservation failed");
      outcomes.push({ channel: "email", status: "skipped", detail: "Resend email quota could not be reserved" });
    }
  }
  if (outcomes.some((outcome) => outcome.status === "sent")) return { channel: "email", status: "sent" };
  return outcomes[0] ?? { channel: "email", status: "skipped" };
}

export async function sendTelegramNotification(booking: BookingNotificationData, event: BookingNotificationEvent): Promise<NotificationOutcome> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return { channel: "telegram", status: "skipped", detail: "Telegram is not configured" };

  const dashboard = process.env.ADMIN_DASHBOARD_URL;
  const heading = statusLabel(event, booking.status);
  const text = [
    `🐾 *${escapeMarkdown(heading)} — ${escapeMarkdown(booking.bookingId)}*`,
    "",
    `*Customer:* ${escapeMarkdown(booking.customerName)}`,
    `*Phone:* ${escapeMarkdown(booking.customerPhone)}`,
    `*Service:* ${escapeMarkdown(booking.serviceName)}`,
    booking.preferredDate ? `*Date:* ${escapeMarkdown(booking.preferredDate)}` : null,
    booking.preferredTime ? `*Time:* ${escapeMarkdown(booking.preferredTime)}` : null,
    booking.aggressive ? "⚠️ *Pet requires handling attention*" : null,
    booking.city || booking.area ? `*Location:* ${escapeMarkdown([booking.city, booking.area].filter(Boolean).join(", "))}` : null,
    dashboard ? `[Open dashboard](${dashboard.replace(/[()]/g, "")})` : null,
  ].filter(Boolean).join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true }),
    });
    if (!response.ok) {
      logger.error({ status: response.status }, "Telegram request failed");
      return { channel: "telegram", status: "failed", detail: "Telegram rejected the request" };
    }
    return { channel: "telegram", status: "sent" };
  } catch (error) {
    logger.error({ error }, "Telegram request failed");
    return { channel: "telegram", status: "failed", detail: "Telegram request failed" };
  }
}

function normaliseIndianMobile(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^\d{10}$/.test(local) ? local : null;
}

const fast2SmsVariableValues = (booking: BookingNotificationData, event: BookingNotificationEvent): string[] | null => {
  const configuredKeys = process.env.FAST2SMS_VARIABLES?.split(",").map((value) => value.trim()).filter(Boolean);
  if (!configuredKeys?.length) return null;
  const values: Record<string, string> = {
    customerName: booking.customerName,
    bookingId: booking.bookingId,
    event: event === "created" ? "received" : "updated",
    status: event === "created" ? "received" : (booking.status ?? "updated"),
    serviceName: booking.serviceName,
    petName: booking.petName,
  };
  const mapped = configuredKeys.map((key) => values[key]);
  return mapped.every((value) => typeof value === "string" && value.trim().length > 0)
    ? mapped.map((value) => value.replace(/[|,]/g, " ").slice(0, 30))
    : null;
};

export async function sendFast2SmsNotification(booking: BookingNotificationData, event: BookingNotificationEvent): Promise<NotificationOutcome> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const senderId = process.env.FAST2SMS_SENDER_ID;
  const templateId = process.env.FAST2SMS_TEMPLATE_ID;
  const mobile = normaliseIndianMobile(booking.customerPhone);
  if (!apiKey || !senderId || !templateId) return { channel: "sms", status: "skipped", detail: "Fast2SMS DLT configuration is incomplete" };
  if (!mobile) return { channel: "sms", status: "skipped", detail: "Customer phone is not a valid Indian mobile number" };
  const variables = fast2SmsVariableValues(booking, event);
  if (!variables) return { channel: "sms", status: "skipped", detail: "Fast2SMS approved template variable mapping is incomplete" };

  const query = new URLSearchParams({ authorization: apiKey, route: "dlt", sender_id: senderId, message: templateId, variables_values: variables.join("|"), numbers: mobile });
  try {
    const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?${query.toString()}`, { method: "GET" });
    if (!response.ok) {
      logger.error({ status: response.status }, "Fast2SMS request failed");
      return { channel: "sms", status: "failed", detail: "Fast2SMS rejected the request" };
    }
    return { channel: "sms", status: "sent" };
  } catch (error) {
    logger.error({ error }, "Fast2SMS request failed");
    return { channel: "sms", status: "failed", detail: "Fast2SMS request failed" };
  }
}
