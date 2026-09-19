Customers can select **Sign In** or **Sign Up** at `/customer/login`, linked from the desktop header and mobile menu. Use the booking email to see reservations in `/customer/dashboard`.

When an admin changes a booking to **confirmed**, the customer receives a separate confirmation email with the approved stay details and current payment status. Repeating confirmation on an already-confirmed booking or updating payment alone does not send another email. A conditional database update prevents concurrent approvals of the same status from sending duplicate confirmations. The admin sees whether the email was sent or failed; approval remains saved if SMTP fails. There is no automatic email retry.

After a booking is saved, the server sends a receipt to the guest email. The receipt reflects the saved booking and payment status; new reservations are pending hotel confirmation. SMTP failures do not undo the reservation: the API returns `emailStatus: "failed"` and the booking page asks the customer to keep their booking ID. Failed messages are not automatically retried.

Configure these server environment variables in `.env.local` for development and in the hosting provider's environment settings for deployment:

```dotenv
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=your-mailbox@example.com
SMTP_PASSWORD=your-mailbox-password
SMTP_FROM=your-mailbox@example.com
```

Port 465 uses implicit TLS. Other ports require STARTTLS. Keep these values out of `NEXT_PUBLIC_` variables and source control. Restart the server after changing the configuration.

Verification: `npm run typecheck` and `node --import tsx --test tests/booking-email.test.ts`. The email tests use a fake SMTP transport and send no messages. SMTP acceptance does not guarantee inbox delivery.

To verify the configured SMTP connection and authentication without sending email, run `node --env-file=.env.local --import tsx scripts/verify-smtp.ts` (Node 20.6 or newer).
