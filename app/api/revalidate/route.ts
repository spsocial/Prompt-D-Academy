import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

/** ยืนยัน Firebase ID token + เช็คว่า users/{uid}.isAdmin === true (อ่านผ่าน REST ด้วย token ของผู้ใช้เอง) */
async function isAdmin(token: string) {
  if (!PROJECT) return false;
  const { payload } = await jwtVerify(token, JWKS, { issuer: `https://securetoken.google.com/${PROJECT}`, audience: PROJECT });
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/users/${payload.sub}`, { headers: { authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!r.ok) return false;
  const d = await r.json();
  return d?.fields?.isAdmin?.booleanValue === true;
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  try {
    if (!(await isAdmin(token))) return NextResponse.json({ ok: false }, { status: 403 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { paths } = (await req.json().catch(() => ({}))) as { paths?: string[] };
  const list = (paths ?? []).filter((p) => typeof p === 'string' && p.startsWith('/')).slice(0, 50);
  list.forEach((p) => revalidatePath(p));
  revalidatePath('/sitemap.xml');
  return NextResponse.json({ ok: true, revalidated: list });
}
