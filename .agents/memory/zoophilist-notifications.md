---
name: Booking notifications pattern
description: How Resend email and Telegram bot notifications are wired in the booking flow
---

## Pattern
Notifications are fired **after** the HTTP response is sent (fire-and-forget with `Promise.allSettled`). This avoids blocking the customer-facing booking response on external API latency.

**Why:** Resend and Telegram can be slow or unavailable; the booking is already saved to DB, so failing to notify should never cause a 500 to the customer.

## Config resolution order
1. Env vars (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `ADMIN_EMAIL`)
2. `businessSettings` proxy (reads from `settings` DB table cache)

Both are checked at notification time — env vars take precedence.

## Files
- `artifacts/api-server/src/lib/notifications.ts` — `sendBookingEmails()` and `sendTelegramNotification()`
- `artifacts/api-server/src/routes/bookings.ts` — POST handler fires notifications post-response
- `artifacts/api-server/src/routes/settings.ts` — exports `businessSettings` proxy

## Required env vars (optional — fall back to settings table)
- `RESEND_API_KEY` — Resend API key for emails
- `TELEGRAM_BOT_TOKEN` — Telegram bot token
- `TELEGRAM_CHAT_ID` — Telegram chat/channel ID
- `ADMIN_EMAIL` — override admin notification email
- `ADMIN_DASHBOARD_URL` — URL embedded in Telegram/email admin links
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — media uploads

## Email sender
Currently uses `noreply@zoophilist.in` as the From address. This domain must be verified in Resend for emails to send.
