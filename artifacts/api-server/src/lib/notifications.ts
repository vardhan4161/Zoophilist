import { logger } from "./logger";

// ─── Types ────────────────────────────────────────────────────────────────────

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
}

// ─── Resend ───────────────────────────────────────────────────────────────────

function customerEmailHtml(b: BookingNotificationData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed — Zoophilist</title>
</head>
<body style="margin:0;padding:0;background:#0a0f0a;font-family:'Segoe UI',Arial,sans-serif;color:#e5e7eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;overflow:hidden;border:1px solid #1a2e1a;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#14532d,#16a34a);padding:32px 40px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.5px;">🐾 Zoophilist</div>
              <div style="color:#bbf7d0;font-size:14px;margin-top:4px;">Premium Doorstep Pet Grooming</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#22c55e;font-size:22px;margin:0 0 8px;">Booking Received! 🎉</h2>
              <p style="color:#9ca3af;margin:0 0 28px;font-size:15px;">
                Hi ${b.customerName}, we've received your booking request and will confirm shortly.
              </p>

              <!-- Booking ID -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f0a;border-radius:12px;border:1px solid #1a2e1a;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;text-align:center;">
                    <div style="color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Your Booking ID</div>
                    <div style="color:#22c55e;font-size:24px;font-weight:900;letter-spacing:2px;">${b.bookingId}</div>
                    <div style="color:#6b7280;font-size:12px;margin-top:6px;">Keep this handy for reference</div>
                  </td>
                </tr>
              </table>

              <!-- Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1f2d1f;">
                    <span style="color:#6b7280;font-size:13px;">Service</span>
                    <span style="float:right;color:#fff;font-size:13px;font-weight:600;">${b.serviceName}</span>
                  </td>
                </tr>
                ${b.preferredDate ? `<tr><td style="padding:8px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Preferred Date</span><span style="float:right;color:#fff;font-size:13px;font-weight:600;">${b.preferredDate}</span></td></tr>` : ""}
                ${b.preferredTime ? `<tr><td style="padding:8px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Preferred Time</span><span style="float:right;color:#fff;font-size:13px;font-weight:600;">${b.preferredTime}</span></td></tr>` : ""}
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #1f2d1f;">
                    <span style="color:#6b7280;font-size:13px;">Pet Name</span>
                    <span style="float:right;color:#fff;font-size:13px;font-weight:600;">${b.petName} (${b.petType})</span>
                  </td>
                </tr>
              </table>

              <!-- Contact note -->
              <div style="background:#0d2010;border:1px solid #1a3a1a;border-radius:10px;padding:16px;margin-bottom:28px;">
                <p style="margin:0;color:#86efac;font-size:13px;">
                  📞 Our team will call you at <strong>${b.customerPhone}</strong> to confirm your appointment.
                  For immediate help, call <strong>+91 9515247704</strong>.
                </p>
              </div>

              <p style="color:#6b7280;font-size:12px;margin:0;text-align:center;">
                Zoophilist — India's #1 Premium Doorstep Pet Grooming<br />
                <a href="mailto:zoophilistpetservice@gmail.com" style="color:#22c55e;">zoophilistpetservice@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminEmailHtml(b: BookingNotificationData): string {
  const mediaLinks = [
    ...(b.photoUrls ?? []).map((u, i) => `<a href="${u}" style="color:#22c55e;">Photo ${i + 1}</a>`),
    ...(b.videoUrls ?? []).map((u, i) => `<a href="${u}" style="color:#22c55e;">Video ${i + 1}</a>`),
  ].join(" &nbsp;·&nbsp; ");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Booking — ${b.bookingId}</title></head>
<body style="margin:0;padding:0;background:#0a0f0a;font-family:'Segoe UI',Arial,sans-serif;color:#e5e7eb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;border:1px solid #1a2e1a;">
          <tr>
            <td style="background:#16a34a;padding:20px 32px;">
              <div style="color:#fff;font-size:18px;font-weight:700;">🐾 New Booking — ${b.bookingId}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h3 style="color:#22c55e;margin:0 0 16px;">Customer</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Name</span><span style="float:right;color:#fff;font-size:13px;">${b.customerName}</span></td></tr>
                <tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Phone</span><span style="float:right;color:#fff;font-size:13px;">${b.customerPhone}</span></td></tr>
                ${b.customerEmail ? `<tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Email</span><span style="float:right;color:#fff;font-size:13px;">${b.customerEmail}</span></td></tr>` : ""}
                ${b.city ? `<tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">City / Area</span><span style="float:right;color:#fff;font-size:13px;">${[b.city, b.area].filter(Boolean).join(", ")}</span></td></tr>` : ""}
                ${b.address ? `<tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Address</span><span style="float:right;color:#fff;font-size:13px;">${b.address}</span></td></tr>` : ""}
              </table>

              <h3 style="color:#22c55e;margin:0 0 16px;">Pet</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Name</span><span style="float:right;color:#fff;font-size:13px;">${b.petName}</span></td></tr>
                <tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Type / Breed</span><span style="float:right;color:#fff;font-size:13px;">${[b.petType, b.breed].filter(Boolean).join(", ")}</span></td></tr>
                <tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Aggressive</span><span style="float:right;color:${b.aggressive ? "#f87171" : "#86efac"};font-size:13px;font-weight:600;">${b.aggressive ? "⚠️ YES" : "No"}</span></td></tr>
              </table>

              <h3 style="color:#22c55e;margin:0 0 16px;">Service</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Service</span><span style="float:right;color:#fff;font-size:13px;font-weight:600;">${b.serviceName}</span></td></tr>
                ${b.preferredDate ? `<tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Date</span><span style="float:right;color:#fff;font-size:13px;">${b.preferredDate}</span></td></tr>` : ""}
                ${b.preferredTime ? `<tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Time</span><span style="float:right;color:#fff;font-size:13px;">${b.preferredTime}</span></td></tr>` : ""}
                ${b.notes ? `<tr><td style="padding:6px 0;border-bottom:1px solid #1f2d1f;"><span style="color:#6b7280;font-size:13px;">Notes</span><span style="float:right;color:#fff;font-size:13px;">${b.notes}</span></td></tr>` : ""}
              </table>

              ${mediaLinks ? `<h3 style="color:#22c55e;margin:0 0 12px;">Media</h3><p style="margin:0 0 24px;font-size:13px;">${mediaLinks}</p>` : ""}

              <a href="${process.env.ADMIN_DASHBOARD_URL ?? "https://zoophilist.replit.app/admin"}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px;">
                Open Dashboard →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendBookingEmails(
  b: BookingNotificationData,
  resendApiKey: string,
  adminEmail: string,
): Promise<void> {
  if (!resendApiKey) {
    logger.warn("Resend API key not configured — skipping email notifications");
    return;
  }

  const send = async (to: string, subject: string, html: string) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Zoophilist <noreply@zoophilist.in>",
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      logger.error({ err, to }, "Resend email failed");
    } else {
      logger.info({ to }, "Email sent via Resend");
    }
  };

  const promises: Promise<void>[] = [];

  // Customer confirmation
  if (b.customerEmail) {
    promises.push(
      send(
        b.customerEmail,
        `Booking Received — ${b.bookingId} | Zoophilist`,
        customerEmailHtml(b),
      ),
    );
  }

  // Admin notification
  promises.push(
    send(
      adminEmail,
      `🐾 New Booking ${b.bookingId} — ${b.customerName} (${b.serviceName})`,
      adminEmailHtml(b),
    ),
  );

  await Promise.allSettled(promises);
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

export async function sendTelegramNotification(
  b: BookingNotificationData,
  botToken: string,
  chatId: string,
  dashboardUrl?: string,
): Promise<void> {
  if (!botToken || !chatId) {
    logger.warn("Telegram not configured — skipping notification");
    return;
  }

  const aggressiveFlag = b.aggressive ? "⚠️ *AGGRESSIVE PET*\n" : "";
  const text = [
    `🐾 *New Booking — ${escMd(b.bookingId)}*`,
    ``,
    `*Customer:* ${escMd(b.customerName)}`,
    `*Phone:* ${escMd(b.customerPhone)}`,
    `*Service:* ${escMd(b.serviceName)}`,
    b.preferredDate ? `*Date:* ${escMd(b.preferredDate)}` : null,
    b.preferredTime ? `*Time:* ${escMd(b.preferredTime)}` : null,
    aggressiveFlag,
    b.city || b.area
      ? `*Location:* ${escMd([b.city, b.area].filter(Boolean).join(", "))}`
      : null,
    b.address ? `*Address:* ${escMd(b.address)}` : null,
    ``,
    `[Open Dashboard](${dashboardUrl ?? "https://zoophilist.replit.app/admin"})`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
          disable_web_page_preview: true,
        }),
      },
    );
    if (!res.ok) {
      const err = await res.text();
      logger.error({ err }, "Telegram notification failed");
    } else {
      logger.info("Telegram notification sent");
    }
  } catch (err) {
    logger.error({ err }, "Telegram notification error");
  }
}

/** Escape special Markdown chars for Telegram MarkdownV1 */
function escMd(s: string): string {
  return s.replace(/[_*[\]()~`>#+=|{}.!-]/g, (c) => `\\${c}`);
}
