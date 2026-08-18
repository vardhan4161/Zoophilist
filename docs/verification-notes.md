# Verification Notes

## 2026-08-18 — Public booking media integration

The public booking page was visually checked in the managed development preview at desktop width. The four-stage booking form renders correctly, preserves its accessible labels, and exposes the photo stage as the final booking step.

The submission flow now uploads each selected image or video to the validated booking upload endpoint before creating the booking. A failed upload or booking request leaves the visitor on the form and presents an accessible, retryable error message rather than taking them to a false success page. The frontend package typecheck completed successfully after this change.

> Live Cloudinary delivery remains disabled until the user provides Cloudinary credentials. In that state, the form will surface the provider-side configuration error and will not create a booking without its selected media.

## 2026-08-18 — SEO, accessibility, and performance pass

The booking page was checked at a 375 × 812 mobile viewport. The navigation collapsed to a menu control, form fields and primary action remained within the viewport, and the footer content remained readable without horizontal overflow.

The production frontend build completed after route-level lazy loading was added. The build emitted separate chunks for public, administrator, and booking pages. A remaining bundle-size advisory applies to shared dependencies and should be reevaluated with a production Lighthouse run after the site is published.

The public home route and administrator sign-in route were also visually checked at desktop width after the navigation landmark changes. Both routes rendered as expected. Console inspection remains an explicit outstanding verification step because the managed preview did not expose a client-console log during this pass.

## 2026-08-18 — Active API and automated-test checks

The scoped Vitest suite passed with nine tests across three files. It covers the MongoDB Atlas ping, homepage service-data normalization, and non-blocking notification behavior. The obsolete generated tRPC logout test and dependency-owned fixtures are excluded from discovery because they are not part of the active Zoophilist application.

Unauthenticated access to the administrator session endpoint returned HTTP 401. The booking-media endpoint returned HTTP 400 for a missing file and HTTP 503 with a clear configuration message for a valid image while Cloudinary credentials are unset. Neither of these boundary checks creates a booking or persists a media asset.

## 2026-08-18 — Administrator gallery and bundle hardening

The administrator gallery workflow now accepts a selected local media file, validates its type and size in the browser, uploads it through the authenticated media endpoint, and only then creates a gallery record. Upload failures remain in the dialog with a retryable message. The accompanying unit tests cover allowed media and rejected missing, unsupported, and oversized files.

The production build completed after third-party dependencies were split into cacheable React, query, motion, icon, Radix, and chart chunks. The prior 689KB shared chunk was reduced to a 91.92KB application entry chunk; the 434.85KB chart dependency is now loaded only with the lazy administrator dashboard. The mobile services route was visually checked after this change and rendered with readable cards, working mobile navigation, and no horizontal overflow.

## 2026-08-18 — Gallery update and route-health verification

The protected `PATCH /api/gallery/:id` route validates metadata updates and rejected an unauthenticated request with HTTP 401 after the managed preview was restarted. Its update contract has unit coverage for valid updates, empty update bodies, and overlong captions. The active public home route and administrator sign-in route both returned HTTP 200, and the active services API returned HTTP 200.

The managed preview did not expose a `browserConsole.log` file during this check, so the console result is recorded as unavailable rather than assumed clean. Visual checks of the public home, services, booking, and administrator sign-in routes were completed in the managed preview without a visible runtime error.

An alternate headless Chromium verification subsequently loaded the public services route and the administrator sign-in route with a five-second virtual-time window. It captured no application console errors or warnings matching `CONSOLE`, `Uncaught`, `TypeError`, `ReferenceError`, or `SyntaxError` for either route. This resolves the missing managed-preview console evidence without relying on an unavailable project log file.

## 2026-08-18 — Transactional email allowance

The Resend integration now reserves one MongoDB-backed slot for each intended recipient before making an outbound request. The monthly key uses UTC month boundaries, defaults to `1000`, and cannot be configured above `1000`. Its atomic conditional update prevents concurrent deliveries from exceeding the cap. If capacity is unavailable or the quota record cannot be reserved, the email channel is safely skipped and booking creation remains non-blocking. Focused notification tests confirm a configured delivery reserves slots and an exhausted allowance makes no outbound email request.

The integration additionally supports an explicit `RESEND_MODE=test` safeguard. In this mode it sends only to `RESEND_TEST_RECIPIENT`, never to a customer or administrator address, and omits the customer email from the generated test content. The reservation unit tests cover UTC month keying, the 1,000-email cap, and safe duplicate-key race handling. The complete focused suite passed with **20 tests in 7 files**.
