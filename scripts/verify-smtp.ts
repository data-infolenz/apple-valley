import { createMailTransport } from '../lib/booking-email';

async function main() {
  const transport = createMailTransport();
  try {
    await transport.verify();
    console.log('SMTP connection and authentication succeeded. No email was sent.');
  } finally {
    transport.close();
  }
}

main().catch((error: unknown) => {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : 'CONFIGURATION';
  console.error(`SMTP verification failed (${code}). Check server configuration and connectivity.`);
  process.exitCode = 1;
});
