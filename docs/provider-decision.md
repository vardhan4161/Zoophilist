# Notification Provider Decision

## SMS: Fast2SMS

Fast2SMS is the selected SMS provider for Zoophilist’s India-focused booking updates because its official published rate begins at ₹0.25 per message with a ₹100 minimum wallet top-up, falls to ₹0.21 per message at the ₹4,000 tier, and can reach ₹0.11 per message only at very high volume. SMS messages must use DLT-approved sender IDs and content templates for a production deployment. Its authenticated Developer API screen specifies a `GET` request to `https://www.fast2sms.com/dev/bulkV2` with `authorization`, `route=dlt`, `sender_id`, `message`, `variables_values`, `numbers`, and optional `schedule_time` query parameters.

The implementation must keep the API key exclusively in server-side secrets, record asynchronous delivery failures without blocking booking creation, and only send template-compliant content.

## Alternatives considered

MSG91 publishes rates from ₹0.25 per message at lower volume and ₹0.18 per message at 30,000 messages, while Twilio lists India outbound SMS at $0.0832 per segment plus applicable carrier fees. For a small India-first booking service, Fast2SMS provides the lowest practical published entry cost among these options.

## References

1. https://www.fast2sms.com/bulk-sms-pricing
2. https://www.fast2sms.com/help/dlt-sms-api-provider-in-india/
3. https://docs.fast2sms.com/reference/authorization
4. https://msg91.com/in/pricing/sms
5. https://www.twilio.com/en-us/sms/pricing/in
6. https://www.fast2sms.com/help/how-to-send-dlt-sms-via-api/
