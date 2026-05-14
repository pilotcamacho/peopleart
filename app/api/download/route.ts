import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSession } from '@/lib/auth/getSession';
import outputs from '@/amplify_outputs.json';

const PRESIGNED_URL_EXPIRES = 300; // 5 minutes

function buildS3Client() {
  const region =
    process.env.AWS_S3_REGION ??
    process.env.NEXT_PUBLIC_AWS_REGION ??
    'ap-southeast-2';

  const keyId = process.env.AWS_S3_ACCESS_KEY_ID ?? process.env.AWS_SES_ACCESS_KEY_ID;
  const secret = process.env.AWS_S3_SECRET_ACCESS_KEY ?? process.env.AWS_SES_SECRET_ACCESS_KEY;

  if (!keyId || !secret) return null;

  return new S3Client({
    region,
    credentials: { accessKeyId: keyId, secretAccessKey: secret },
  });
}

async function logDownload(data: {
  documentId: string;
  documentTitle: string;
  userEmail: string;
  ipHash?: string;
}): Promise<void> {
  const mutation = `
    mutation LogDownload($input: CreateDocumentDownloadInput!) {
      createDocumentDownload(input: $input) { id }
    }
  `;
  try {
    await fetch(outputs.data.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': outputs.data.api_key,
      },
      body: JSON.stringify({ query: mutation, variables: { input: data } }),
    });
  } catch (err) {
    console.error('[download] audit log failed:', err);
  }
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

export async function POST(req: NextRequest) {
  // Authenticate
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const groups =
    (session.tokens?.accessToken?.payload?.['cognito:groups'] as string[] | undefined) ?? [];
  if (!groups.includes('DataRoom') && !groups.includes('Admin')) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const documentId = typeof body.documentId === 'string' ? body.documentId.trim() : '';
  const s3Key = typeof body.s3Key === 'string' ? body.s3Key.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : 'Document';

  if (!documentId || !s3Key) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const bucket = process.env.DATA_ROOM_BUCKET;
  if (!bucket) {
    console.error('[download] DATA_ROOM_BUCKET not set');
    return NextResponse.json({ error: 'server_config' }, { status: 500 });
  }

  const s3 = buildS3Client();
  if (!s3) {
    console.error('[download] S3 credentials not configured');
    return NextResponse.json({ error: 'server_config' }, { status: 500 });
  }

  // Generate presigned URL
  let url: string;
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      ResponseContentDisposition: `attachment; filename="${title}"`,
    });
    url = await getSignedUrl(s3, command, { expiresIn: PRESIGNED_URL_EXPIRES });
  } catch (err) {
    console.error('[download] presigned URL generation failed:', err);
    return NextResponse.json({ error: 'presign_failed' }, { status: 500 });
  }

  // Audit log (non-fatal)
  const userEmail =
    (session.tokens?.idToken?.payload?.email as string | undefined) ?? 'unknown';
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const ipHash = await hashIp(ip);

  await logDownload({ documentId, documentTitle: title, userEmail, ipHash });

  return NextResponse.json({ url });
}
