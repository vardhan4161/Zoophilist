# Zoophilist Environment Configuration

This managed project stores deployment configuration in the secure project settings rather than committed `.env` files. Enter every value below through the secure secrets interface; never place credentials in source control or browser-visible variables.

| Secret key | Required for | Notes |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas persistence | Validated for the temporary development deployment; rotate before release. |
| `SESSION_SECRET` | Administrator session signing | Use a randomly generated value of at least 32 characters. |
| `ADMIN_USERNAME` | Administrator login | Must not use a public/default name. |
| `ADMIN_PASSWORD` | Administrator login | Use a unique strong password. |
| `ADMIN_EMAIL` | Booking notification recipient | Use `zoophilistpetservice@gmail.com` unless business operations change it. |
| `RESEND_API_KEY` | Transactional email | Requires a verified sending domain. |
| `RESEND_FROM_EMAIL` | Transactional email sender | Must use the verified Resend domain. |
| `TELEGRAM_BOT_TOKEN` | Telegram alerts | Create and secure with BotFather. |
| `TELEGRAM_CHAT_ID` | Telegram alerts | Use the chosen private chat or private group ID. |
| `FAST2SMS_API_KEY` | Transactional SMS | Used as the Fast2SMS `authorization` query parameter; requires a DLT-approved sender and message template. |
| `FAST2SMS_SENDER_ID` | Transactional SMS | DLT-approved sender identifier. |
| `FAST2SMS_TEMPLATE_ID` | Transactional SMS | DLT-approved content-template identifier. |
| `FAST2SMS_VARIABLES` | Transactional SMS | Ordered mapping for the selected DLT template, separated by commas. Choose only `customerName`, `bookingId`, `event`, `status`, `serviceName`, and `petName`, in exactly the template’s approved variable order. |
| `CLOUDINARY_CLOUD_NAME` | Media uploads | Server-side only. |
| `CLOUDINARY_API_KEY` | Media uploads | Server-side only. |
| `CLOUDINARY_API_SECRET` | Media uploads | Server-side only. |
| `ADMIN_DASHBOARD_URL` | Administrator email links | Use the canonical public URL followed by `/admin`. |
| `CORS_ORIGIN` | API origin policy | Use the canonical public URL without a trailing slash. |
