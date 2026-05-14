import { NextRequest, NextResponse } from 'next/server';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import outputs from '@/amplify_outputs.json';

// ---------------------------------------------------------------------------
// Rate limiting — in-memory, resets on server restart (sufficient for MVP)
// ---------------------------------------------------------------------------

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_INQUIRY_TYPES = new Set([
  'enterprise_training',
  'investor',
  'government',
  'strategic_partner',
  'media',
  'other',
]);

const VALID_LANGUAGES = new Set(['en', 'es']);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

async function writeToDb(record: {
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
  organisation?: string;
  preferredLanguage?: string;
  ipHash?: string;
}): Promise<void> {
  const mutation = `
    mutation CreateInvestorContact($input: CreateInvestorContactInput!) {
      createInvestorContact(input: $input) { id }
    }
  `;

  const res = await fetch(outputs.data.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': outputs.data.api_key,
    },
    body: JSON.stringify({ query: mutation, variables: { input: record } }),
  });

  if (!res.ok) throw new Error(`AppSync HTTP ${res.status}`);

  const json = (await res.json()) as { errors?: unknown[] };
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
}

async function sendEmail(data: {
  fullName: string;
  email: string;
  inquiryType: string;
  message: string;
  organisation?: string;
  preferredLanguage?: string;
}): Promise<void> {
  const recipient = process.env.CONTACT_FORM_RECIPIENT;
  if (!recipient) {
    console.warn('[contact] CONTACT_FORM_RECIPIENT not set — skipping email');
    return;
  }

  const keyId = process.env.AWS_SES_ACCESS_KEY_ID;
  const secret = process.env.AWS_SES_SECRET_ACCESS_KEY;
  if (!keyId || !secret) {
    console.warn('[contact] SES credentials not set — skipping email');
    return;
  }

  const region =
    process.env.AWS_SES_REGION ??
    process.env.NEXT_PUBLIC_AWS_REGION ??
    'ap-southeast-2';

  const ses = new SESClient({
    region,
    credentials: { accessKeyId: keyId, secretAccessKey: secret },
  });

  const subject = `[PeopleArt] New inquiry: ${data.inquiryType} — ${data.fullName}`;

  const body = [
    'New contact form submission on peopleart.co',
    '',
    `Name:               ${data.fullName}`,
    `Email:              ${data.email}`,
    `Organisation:       ${data.organisation ?? '—'}`,
    `Inquiry type:       ${data.inquiryType}`,
    `Preferred language: ${data.preferredLanguage ?? '—'}`,
    '',
    'Message:',
    data.message,
  ].join('\n');

  await ses.send(
    new SendEmailCommand({
      Source: `PeopleArt <${recipient}>`,
      Destination: { ToAddresses: [recipient] },
      ReplyToAddresses: [data.email],
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Text: { Data: body, Charset: 'UTF-8' } },
      },
    }),
  );
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Rate limit
  if (isRateLimited(getClientIp(req))) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  // Parse
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const inquiryType = typeof body.inquiryType === 'string' ? body.inquiryType.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const organisation = typeof body.organisation === 'string' ? body.organisation.trim() : undefined;
  const preferredLanguage =
    typeof body.preferredLanguage === 'string' && VALID_LANGUAGES.has(body.preferredLanguage)
      ? body.preferredLanguage
      : undefined;

  // Validate
  if (!fullName || !email || !inquiryType || !message) {
    return NextResponse.json({ error: 'validation_failed' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (!VALID_INQUIRY_TYPES.has(inquiryType)) {
    return NextResponse.json({ error: 'invalid_inquiry_type' }, { status: 400 });
  }

  const ipHash = await hashIp(getClientIp(req));

  // Write to DynamoDB (non-fatal)
  try {
    await writeToDb({
      fullName,
      email: email.toLowerCase(),
      inquiryType,
      message,
      organisation: organisation || undefined,
      preferredLanguage,
      ipHash,
    });
  } catch (err) {
    console.error('[contact] DynamoDB write failed:', err);
  }

  // Send email (non-fatal — lead is already in DB)
  try {
    await sendEmail({ fullName, email, inquiryType, message, organisation, preferredLanguage });
  } catch (err) {
    console.error('[contact] SES send failed:', err);
  }

  return NextResponse.json({ success: true });
}
