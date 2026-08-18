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
