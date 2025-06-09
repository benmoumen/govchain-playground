# Didit Identity Verification Webhook

This implementation provides a secure webhook endpoint to receive identity verification status updates from the Didit service.

## Overview

The webhook endpoint (`/api/didit/webhook`) follows the [Didit webhook documentation](https://docs.didit.me/reference/webhooks) and implements:

- **Signature Verification**: Uses HMAC SHA-256 to verify webhook authenticity
- **Timestamp Validation**: Ensures requests are fresh (within 5 minutes)
- **Status Processing**: Handles all verification statuses with appropriate business logic
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Type Safety**: Full TypeScript support with proper type definitions

## Configuration

### Environment Variables

Set the following environment variable in your `.env` file:

```bash
DIDIT_WEBHOOK_SECRET_KEY="your-webhook-secret-from-didit"
```

This secret is provided by Didit when you configure your webhook URL in their dashboard.

### Cloudflare Users

If using Cloudflare, whitelist the Didit IP address `18.203.201.92` in your WAF settings:

1. Navigate to Security > WAF > Tools > IP Access Rules
2. Add IP `18.203.201.92` with "Allow" action

## Webhook Events

The endpoint handles the following verification statuses:

- **Not Started**: Initial session creation
- **In Progress**: User is actively completing verification
- **Approved**: Verification completed successfully ✅
- **Declined**: Verification rejected ❌
- **In Review**: Manual review required
- **Abandoned**: User left verification incomplete

## Implementation Details

### File Structure

```
src/
├── app/api/didit/webhook/
│   ├── route.ts                       # Main webhook endpoint
│   └── test/route.ts                  # Server-side signature generation for testing
├── app/(playground)/playground/webhooks/didit/page.tsx  # Demo interface
├── types/didit/webhook.ts             # TypeScript type definitions
├── services/didit/verification-service.ts  # Business logic utilities
├── config/didit/config.ts             # Configuration constants
└── lib/didit/errors.ts                # Custom error classes
```

### Security Features

1. **HMAC Signature Verification**

   - Uses SHA-256 algorithm
   - Compares signatures with timing-safe comparison
   - Prevents replay attacks

2. **Timestamp Validation**

   - Rejects requests older than 5 minutes
   - Protects against replay attacks

3. **Payload Validation**
   - Validates JSON structure
   - Ensures required fields are present
   - Type-safe payload processing

## Usage Examples

#### Approved Verification Handler

```typescript
async function handleApprovedVerification(
  sessionId: string,
  decision: DidItDecision | undefined,
  vendorData: string,
  workflowId: string
): Promise<void> {
  if (!decision?.id_verification) return;

  // Extract verified identity data
  const userData = {
    fullName: decision.id_verification.full_name,
    dateOfBirth: decision.id_verification.date_of_birth,
    documentNumber: decision.id_verification.document_number,
    nationality: decision.id_verification.nationality,
  };

  // Your business logic here:
  // - Create user account
  // - Issue verifiable credentials
  // - Grant access to services
  // - Send confirmation emails
}
```

#### Integration with Verifiable Credentials

```typescript
import { DidItVerificationService } from "@/services/didit/verification-service";

// Format verification data for credential issuance
const credentialAttributes =
  DidItVerificationService.formatForCredential(decision);

// Issue digital ID credential
await issueDigitalIDCredential(credentialAttributes);
```

## Testing

Run the webhook tests:

```bash
pnpm test __tests__/integration/api/didit-webhook.test.ts
```

The test suite covers:

- Valid webhook processing
- Signature verification
- Timestamp validation
- Error handling scenarios
- Different verification statuses

## Integration Checklist

- [ ] Set `DIDIT_WEBHOOK_SECRET_KEY` environment variable
- [ ] Configure webhook URL in Didit dashboard
- [ ] Whitelist Didit IP if using Cloudflare
- [ ] Implement business logic for approved/declined verifications
- [ ] Test webhook with Didit's test events
- [ ] Set up monitoring and logging
- [ ] Configure error alerting

## Business Logic Customization

The webhook provides placeholder functions for different verification outcomes:

1. **`handleApprovedVerification`**: Process successful verifications
2. **`handleDeclinedVerification`**: Handle rejected verifications
3. **`processVerificationWebhook`**: Main webhook processor

Customize these functions based on your application's requirements:

- User registration and onboarding
- Access control and permissions
- Credential issuance
- Compliance logging
- Customer notifications

## Error Handling

The webhook returns appropriate HTTP status codes:

- `200`: Webhook processed successfully
- `400`: Invalid payload or malformed JSON
- `401`: Invalid signature or stale timestamp
- `500`: Server configuration or processing error

All errors are logged with context for debugging and monitoring.

## Monitoring

Consider implementing:

- Webhook delivery monitoring
- Processing time metrics
- Error rate alerting
- Verification success/failure rates
- Business logic performance tracking

## Security Considerations

1. **Always verify signatures** - Never process unverified webhooks
2. **Validate timestamps** - Prevent replay attacks
3. **Log security events** - Monitor for suspicious activity
4. **Rate limiting** - Consider implementing rate limits if needed
5. **HTTPS only** - Ensure webhook URL uses HTTPS in production

## Support

For questions about the Didit webhook implementation:

1. Check the [Didit documentation](https://docs.didit.me/reference/webhooks)
2. Review the test suite for examples
3. Enable debug logging for troubleshooting

## Demo Interface

A secure demo interface is available at `/playground/webhooks/didit` that allows you to:

- Test webhook payloads with sample data for different verification statuses
- Generate HMAC signatures securely on the server-side
- View webhook responses in real-time
- Understand the webhook flow and data structure

### Security Features

✅ **Server-Side Signature Generation**: HMAC signatures are generated server-side using the `/api/didit/webhook/test` endpoint, ensuring the webhook secret never leaves the server.

✅ **No Client-Side Secrets**: The demo interface doesn't expose sensitive configuration to the browser.

✅ **Real-Time Testing**: Test various webhook scenarios safely in a controlled environment
