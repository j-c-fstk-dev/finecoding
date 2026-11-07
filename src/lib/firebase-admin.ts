import 'server-only';

import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

/**
 * Firebase Admin SDK (server only).
 *
 * All server code (Server Components, Server Actions, Route Handlers) talks to
 * Firestore through this module. The Admin SDK authenticates with a service
 * account and is not subject to Firestore security rules, so every mutation
 * that should be restricted to the blog owner must call `requireAdmin()` first.
 *
 * Credentials (pick one option):
 *   1. FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY (recommended on Netlify,
 *      smaller than the full JSON). Project id comes from
 *      FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID.
 *   2. FIREBASE_SERVICE_ACCOUNT_KEY with the full service account JSON
 *      (plain or base64 encoded).
 */

function loadCredentials() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (json) {
    const raw = json.trim().startsWith('{') ? json : Buffer.from(json, 'base64').toString('utf8');
    const parsed = JSON.parse(raw);
    return {
      projectId: parsed.project_id as string,
      clientEmail: parsed.client_email as string,
      privateKey: parsed.private_key as string,
    };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Env var UIs often store the key with literal "\n" sequences.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin credentials are missing. Set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY ' +
        '(or FIREBASE_SERVICE_ACCOUNT_KEY). See docs/CONFIGURACAO.md.'
    );
  }

  return { projectId, clientEmail, privateKey };
}

function getAdminApp(): App {
  if (getApps().length) return getApp();
  return initializeApp({ credential: cert(loadCredentials()) });
}

export function adminDb(): Firestore {
  return getFirestore(getAdminApp());
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

function parseList(value: string | undefined): string[] {
  return (value || '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies a Firebase ID token sent by the dashboard and checks that the user
 * is the blog owner (listed in ADMIN_UIDS or ADMIN_EMAILS). Throws otherwise.
 */
export async function requireAdmin(idToken: string | undefined | null) {
  if (!idToken) {
    throw new Error('Not authenticated.');
  }

  // Created outside the try so a credentials problem keeps its own message.
  const auth = adminAuth();
  let decoded;
  try {
    decoded = await auth.verifyIdToken(idToken);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not verify your login: ${reason} ` +
        '(check that NEXT_PUBLIC_FIREBASE_PROJECT_ID and the service account belong to the same Firebase project).'
    );
  }

  const allowedUids = parseList(process.env.ADMIN_UIDS);
  const allowedEmails = parseList(process.env.ADMIN_EMAILS);

  if (allowedUids.length === 0 && allowedEmails.length === 0) {
    throw new Error('No admin configured. Set ADMIN_UIDS or ADMIN_EMAILS on the server.');
  }

  const uidOk = allowedUids.includes(decoded.uid.toLowerCase());
  const emailOk = !!decoded.email && allowedEmails.includes(decoded.email.toLowerCase());

  if (!uidOk && !emailOk) {
    throw new Error(
      `Logged in as ${decoded.email || decoded.uid}, which is not listed in ADMIN_EMAILS / ADMIN_UIDS.`
    );
  }

  return decoded;
}
