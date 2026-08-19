# Provider Account Audit

## MongoDB Atlas

On 18 August 2026, the user-authorized browser audit confirmed an authenticated MongoDB Atlas session. The account contains an organization named `Sai's Org - 2025-07-26`, a project named `Project 0`, and an existing deployment named `Cluster0`.

No credentials, database users, network access settings, connection strings, or account configuration were viewed or changed during this read-only audit. The next safe step is to inspect the deployment state and application-access prerequisites, then request confirmation before creating or altering any database access configuration.

The existing Atlas deployment is ready to use on the free tier. It is a MongoDB 8.0.29 replica set in AWS Mumbai (`ap-south-1`), with backups inactive and no linked application services. A restricted database user and an appropriate network-access rule remain required before Zoophilist can connect; no connection string, user, or network rule was viewed or changed.

With the user’s approval, the Atlas Security navigation was opened to begin application-access setup. No deployment configuration, database user, or network rule has been created yet.

With explicit user approval, a `0.0.0.0/0` Atlas IP access-list entry was submitted for temporary Zoophilist managed-hosting access. The entry is labelled for later restriction and was still pending activation when recorded. It must be verified as active before the application connection is tested.

With user authorization for autonomous setup, a dedicated Atlas application-user form was prepared for `zoophilist_app` using password authentication. A provider-generated password was used but is intentionally not recorded in project files, source code, notes, or chat. The user will need to place the final connection URI in the project’s secure secret field after the database user is saved.

The application user was configured with Atlas’s built-in read/write role and restricted to `Cluster0`. Atlas represents the selected built-in role as `readWriteAnyDatabase@admin`; no higher Atlas administration role was granted.

The `Cluster0`-only restriction was confirmed in the Atlas user form. The non-temporary `zoophilist_app` user was then saved successfully.

The user subsequently reset the `zoophilist_app` password through the Atlas editor. The password is intentionally not retained in project files, source code, notes, or chat; the remaining step is to generate and securely provide the application connection URI.

## Resend

The user-authorized browser audit confirmed an authenticated Resend account for `saishravan.y@gmail.com`. The Sending view reported no sent emails in the preceding 15 days. No API keys, verified-domain details, sending limits, or account settings were opened or changed during this read-only audit.

The Domains view reported no domains yet. A verified sender domain must therefore be added and its DNS records published before production email can be sent from a Zoophilist-branded address. No domain was added during the audit.

## Fast2SMS

The Fast2SMS account page was not authenticated in the user-authorized browser. The sign-in form requests a mobile number and password, so the current DLT registration, wallet balance, approved sender ID, template IDs, and API key cannot be audited without the user signing in. No credentials were entered and no account was created.

After the user completed sign-in, the Fast2SMS dashboard showed an available ₹50.0000 credit. Its DLT landing page offers paths to add existing DLT details or begin the DLT sign-up process; this page alone does not confirm an approved sender ID or content template. No DLT record, API key, or settings were opened or changed.

The Developer API page is available and shows a masked authorization value, confirming that an API credential exists. The DLT SMS configuration presented no selectable sender ID or content template, so production DLT SMS cannot yet be configured. The full API key was not viewed or copied.

## Cloudinary

Cloudinary was not authenticated in the user-authorized browser. The console is open to its sign-in page, so the cloud name, upload settings, and server-side API credential status cannot be audited until the user signs in. No credentials were entered and no account settings were changed.

After the user completed sign-in, Cloudinary opened an initial onboarding questionnaire. It requires a product-use selection before dashboard account details are available. No onboarding choice was selected, so no account preferences or media settings were changed.

The user-approved onboarding flow is now complete and the Cloudinary Image dashboard is accessible. Its Quick Start area confirms that server-side API credentials are available through an account-key management view. No credential values were copied, no upload preset was created, and no media was uploaded.

## Telegram

Telegram Web is not authenticated in the user-authorized browser and requests a QR-code login from the user’s phone. No chats, bot configuration, or message history were accessed. An authenticated Telegram session or a pre-existing bot token and destination-chat identifier will be required before administrator booking alerts can be configured.

After the user completed the QR-code login, the Telegram Web session was authenticated. No business-specific administrator-alert chat or existing Zoophilist bot was identified during the high-level read-only view, and no private chat was opened. A dedicated alert destination and bot token still need to be established before the integration can be completed.

The user subsequently approved creation of a private **Zoophilist Admin Alerts** channel and the **@zoophilist_alerts_bot** bot. The bot received a `/start` message to make it discoverable in Telegram Web. The channel’s Administrators selector verified the exact bot identity as **Zoophilist Alerts** (`@zoophilist_alerts_bot`); the bot has not yet been granted administrator permission, its token has not been recorded, and no alert has been sent.

Telegram’s administrator-permission form is open for the verified bot. The platform initially selected broader channel privileges by default. Before saving, the configuration will retain **Post Messages** only and remove every unrelated permission, including channel-info, content-management, member-management, story, tag, video-chat, and administrator-management access.

The in-progress form now retains **Post Messages** while **Change Channel Info**, **Edit Messages of Others**, and **Delete Messages of Others** have been removed. The remaining visible story, user-management, and tag permissions still require removal before the administrator grant is saved.

The minimum-access form now has only **Post Messages** enabled. All other visible permissions are disabled, including channel-information, message editing/deletion, story actions, user bans/additions, and member-tag editing. **Manage Video Chats** and **Add New Admins** are the final two visible permissions to remove before the save action.

**Completed:** Telegram now lists **Zoophilist Alerts** as an administrator of the private **Zoophilist Admin Alerts** channel, promoted by the channel owner. The bot has only the required ability to post messages; message signing is disabled and every unrelated administrative permission was removed before saving.

BotFather was reopened after the administrator grant and the existing bot token was available in the authenticated owner session. The token value is intentionally excluded from project files and documentation; it must be stored only through the project’s secure secret configuration along with the verified private-channel identifier.

After the user approved credential creation and entered Cloudinary’s email confirmation code, a dedicated active API key named `zoophilist-server` was created for the `konrpzex` product environment. Its identifier and secret value are intentionally excluded from project files and documentation. Cloudinary reported that the newly created key has no product-environment role assigned yet, so the access role must be configured before production media uploads are activated.

The key’s access view now shows two direct roles: **Master Admin** and **Media Library User**. Because Master Admin is broader than the application needs, the remaining least-privilege correction is to retain only the media-library role before enabling production uploads.

The `zoophilist-server` key remains active while this access correction is pending. No API secret has been copied into the project or included in documentation.

The approved replacement-key workflow is open for a credential named `zoophilist-server-v2`; it must receive the existing Media Library User role before creation so its secret can be captured once and stored only through secure project settings.

The final dedicated credential, `zoophilist-server-final`, was subsequently created. Its cloud name, API key, and API secret were stored only through secure project settings, and a read-only Cloudinary Admin API validation passed without creating, modifying, or downloading media. The preliminary `zoophilist-server` and `zoophilist-server-upload` credentials were then deleted after final-key validation; neither preliminary secret is retained. The final credential currently uses the owner-approved temporary **Master Admin** role and must be reduced to a least-privilege upload-capable role after functional media-upload validation.

The Resend account is authenticated and `zoophilist.in` was added as the pending sending domain on 2026-08-19. Resend has generated domain-verification DNS records; they must be published through the authoritative DNS provider before branded transactional email can be activated. No Resend API key has been created yet.

Resend currently requires a DKIM TXT record at `resend._domainkey`, SPF-related MX and TXT records at `send`, and offers an optional `_dmarc` TXT record. Its domain-verification screen identifies Hostinger as the available DNS-provider shortcut. The authoritative values remain visible only in the authenticated Resend domain screen so they can be copied without truncation when records are added.

## External hosting assessment — Render

Render is compatible with the Zoophilist Node/Express API and can also host the built React frontend. Its public web-service requirements are compatible with the application’s environment-port design: the service must bind to `0.0.0.0` and use the platform-provided `PORT` variable. The current code should be deployed as one Node web service that serves the built frontend and API under the same origin, rather than splitting it into a static site and a separately hosted API.

The $0 Free web-service option is suitable only for a preview or hobby demonstration, not a production booking endpoint: Render documents that it sleeps after 15 idle minutes, can take about one minute to resume, has ephemeral local storage, may restart at any time, and has 750 included instance hours per workspace per calendar month. Its pricing page lists a $7/month Starter web service with 512 MB RAM and 0.5 CPU as the lowest paid always-on option. Zoophilist keeps data in MongoDB Atlas and media in Cloudinary, so Render’s ephemeral filesystem is compatible; however, Resend, Telegram, Fast2SMS, and MongoDB Atlas are all outbound external dependencies and must be configured with production credentials in Render’s environment-variable settings.

Sources: https://render.com/docs/free ; https://render.com/pricing ; https://render.com/docs/web-services ; https://render.com/docs/deploy-node-express-app
