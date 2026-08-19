# Low-Cost Render Deployment

Zoophilist is prepared as a **single Render Node web service**. The service builds the Vite client, starts the Express API on Render’s supplied `PORT`, and serves the compiled frontend from the same origin. This removes the cross-origin API and cookie complications of a separate static-site/API deployment.

| Choice | Configuration |
|---|---|
| Render service | One Node web service named `zoophilist` |
| Region | Singapore, the nearest listed Render region to the India-focused service |
| Build command | `pnpm install --frozen-lockfile && pnpm run render:build` |
| Start command | `pnpm run render:start` |
| Health endpoint | `/api/healthz` |
| Runtime | Node.js 22.13.0 |
| Data and media | MongoDB Atlas and Cloudinary; no persistent local storage required |

The checked-in [`render.yaml`](../render.yaml) contains no secrets. It sets only safe runtime values and declares all credentials as Render-managed secret fields. In the Render dashboard, enter the corresponding values from the project’s secure settings. Set `CORS_ORIGIN` to the final public origin, such as `https://zoophilist.in`, once its custom domain is connected. The repository’s pnpm configuration explicitly permits only the audited `esbuild` installation script required by Vite; this avoids fresh-install failures without disabling the project’s dependency-build restrictions.

> Render’s Free web service is appropriate for previews only: it spins down after 15 minutes of inactivity and can take about a minute to restart. Use the **Starter** instance for a live booking service so customers do not encounter cold-start delays. [1] [2]

## Deploy procedure

First, push the current branch to the connected GitHub repository. In Render, create a Blueprint from that repository; Render detects `render.yaml`. Confirm the Starter instance, add the secret values in the service’s Environment tab, and create the service. When the first build completes, visit `/api/healthz` and the public homepage before adding the `zoophilist.in` custom domain.

Render supports custom domains and managed TLS. Keep the Hostinger DNS changes for the Resend domain verification separate from the web-hosting DNS changes, because they serve different purposes. The Resend records authenticate outgoing mail; the Render records route web traffic to the application. [3]

## Required secrets

| Group | Render environment variables |
|---|---|
| Core security | `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `CORS_ORIGIN` |
| Cloudinary | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`, `RESEND_MODE=production`, `RESEND_MONTHLY_LIMIT=1000` |
| Telegram | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` |
| Fast2SMS | `FAST2SMS_API_KEY`, `FAST2SMS_SENDER_ID`, `FAST2SMS_TEMPLATE_ID`, `FAST2SMS_VARIABLES` |

## Validation evidence

On 19 August 2026, the repository was copied to a clean temporary workspace without `node_modules`, compiled output, or TypeScript build metadata. In that fresh state, the exact configured commands—`pnpm install --frozen-lockfile`, `pnpm run render:build`, and `pnpm run render:start`—completed successfully. The smoke check confirmed `GET /api/healthz` returned `{"status":"ok"}` and both `/` and `/admin/login` served the compiled single-page application. The repeatable [`render-clean-smoke.sh`](../scripts/render-clean-smoke.sh) script performs the same isolated validation.

## Operational notes

The deployment deliberately does not use Render’s database products because Zoophilist already uses MongoDB Atlas. Render’s local filesystem is ephemeral, but this is compatible with the platform because uploads are sent to Cloudinary rather than written to disk. [1]

The temporary Cloudinary Master Admin credential works for the current integration but must be replaced with an upload-capable least-privilege credential after the live media workflow is verified. The database password and temporary Atlas network allowlist must also be hardened before public launch.

## References

[1]: https://render.com/docs/free "Render: Deploy for Free"
[2]: https://render.com/pricing "Render Pricing"
[3]: https://render.com/docs/web-services "Render: Web Services"
