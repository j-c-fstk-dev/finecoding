import { NextResponse } from 'next/server';

// Temporary diagnostics for the Netlify runtime error on dynamic pages.
// Reports which step fails (module load, credentials, Firestore read) with the
// error message only. Never returns secrets. Remove once fixed.
export const dynamic = 'force-dynamic';

export async function GET() {
  const steps: Record<string, string> = { node: process.version };
  const fail = (step: string, e: unknown) => {
    const err = e as { message?: string; code?: string; name?: string };
    steps[step] = `FAIL ${err?.name ?? ''} ${err?.code ?? ''} ${String(err?.message ?? e).slice(0, 500)}`;
    return NextResponse.json(steps, { status: 200 });
  };
  try { await import('firebase-admin/app'); steps.importApp = 'ok'; } catch (e) { return fail('importApp', e); }
  try { await import('firebase-admin/firestore'); steps.importFirestore = 'ok'; } catch (e) { return fail('importFirestore', e); }
  try { await import('firebase-admin/auth'); steps.importAuth = 'ok'; } catch (e) { return fail('importAuth', e); }
  let mod: typeof import('@/lib/firebase-admin');
  try { mod = await import('@/lib/firebase-admin'); steps.importLib = 'ok'; } catch (e) { return fail('importLib', e); }
  try { mod.adminDb(); steps.init = 'ok'; } catch (e) { return fail('init', e); }
  try { const s = await mod.adminDb().collection('posts').limit(1).get(); steps.read = `ok (${s.size})`; } catch (e) { return fail('read', e); }
  return NextResponse.json(steps);
}
