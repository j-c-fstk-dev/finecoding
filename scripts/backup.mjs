#!/usr/bin/env node
/**
 * Backup of all Fine Coding content stored in Firestore.
 *
 * Usage:
 *   npm run backup                 # writes to backups/<date-time>/
 *   npm run backup -- ./my-folder  # custom output folder
 *
 * Credentials are read from .env.local / .env (same variables as the site):
 *   FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY  (or FIREBASE_SERVICE_ACCOUNT_KEY)
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *
 * Output:
 *   posts/<slug>.md      one Markdown file per post, with front matter (readable anywhere)
 *   data.json            everything: posts + comments, resources + comments,
 *                        subscribers and wishlist (keep this file private!)
 *
 * The backups/ folder is git-ignored because it contains subscriber emails.
 */
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

dotenv.config({ path: '.env.local' });
dotenv.config(); // .env as fallback (does not override)

function loadCredentials() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (json) {
    const raw = json.trim().startsWith('{') ? json : Buffer.from(json, 'base64').toString('utf8');
    const p = JSON.parse(raw);
    return { projectId: p.project_id, clientEmail: p.client_email, privateKey: p.private_key };
  }
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      'Missing Firebase Admin credentials. Fill FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY and\n' +
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local (see docs/CONFIGURACAO.md).'
    );
    process.exit(1);
  }
  return { projectId, clientEmail, privateKey };
}

/** Converts Firestore Timestamps (also nested) into ISO strings. */
function plain(value) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]));
  }
  return value;
}

async function readCollection(ref, { withComments = false } = {}) {
  const snap = await ref.get();
  return Promise.all(
    snap.docs.map(async (doc) => {
      const item = { id: doc.id, ...plain(doc.data()) };
      if (withComments) {
        const comments = await doc.ref.collection('comments').orderBy('createdAt', 'asc').get();
        item.comments = comments.docs.map((c) => ({ id: c.id, ...plain(c.data()) }));
      }
      return item;
    })
  );
}

// JSON strings are valid YAML scalars, so this produces safe front matter.
const yaml = (v) => JSON.stringify(v ?? '');

function postToMarkdown(post) {
  const front = [
    '---',
    `title: ${yaml(post.title)}`,
    `slug: ${yaml(post.slug)}`,
    `date: ${yaml(post.date)}`,
    `excerpt: ${yaml(post.excerpt)}`,
    `tags: ${JSON.stringify(post.tags || [])}`,
    `imageUrl: ${yaml(post.imageUrl)}`,
    `imageHint: ${yaml(post.imageHint)}`,
    `likes: ${Number(post.likes) || 0}`,
    `firestoreId: ${yaml(post.id)}`,
    '---',
    '',
  ].join('\n');

  let md = front + (post.content || '') + '\n';
  if (post.comments?.length) {
    md += '\n<!-- Comments (backup only) -->\n';
    for (const c of post.comments) {
      md += `<!-- ${c.createdAt || ''} | ${String(c.name).replace(/--/g, '-')}: ${String(c.comment).replace(/--/g, '-')} -->\n`;
    }
  }
  return md;
}

function safeFileName(name, fallback) {
  const cleaned = String(name || '').replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned || fallback;
}

async function main() {
  const stamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  const outDir = path.resolve(process.argv[2] || path.join('backups', stamp));

  const credentials = loadCredentials();
  const app = initializeApp({ credential: cert(credentials) });
  const db = getFirestore(app);

  console.log(`Reading Firestore project "${credentials.projectId}"...`);

  const [posts, resources, subscribers, wishlist] = await Promise.all([
    readCollection(db.collection('posts').orderBy('date', 'desc'), { withComments: true }),
    readCollection(db.collection('resources'), { withComments: true }),
    readCollection(db.collection('subscribers')),
    readCollection(db.collection('wishlist')),
  ]);

  fs.mkdirSync(path.join(outDir, 'posts'), { recursive: true });

  const usedNames = new Set();
  for (const post of posts) {
    let name = safeFileName(post.slug, post.id);
    while (usedNames.has(name)) name += `-${post.id}`;
    usedNames.add(name);
    fs.writeFileSync(path.join(outDir, 'posts', `${name}.md`), postToMarkdown(post));
  }

  const data = {
    exportedAt: new Date().toISOString(),
    projectId: credentials.projectId,
    counts: {
      posts: posts.length,
      postComments: posts.reduce((n, p) => n + (p.comments?.length || 0), 0),
      resources: resources.length,
      subscribers: subscribers.length,
      wishlist: wishlist.length,
    },
    posts,
    resources,
    subscribers,
    wishlist,
  };
  fs.writeFileSync(path.join(outDir, 'data.json'), JSON.stringify(data, null, 2));

  console.log('\nBackup complete:', outDir);
  console.table(data.counts);
  console.log('\nKeep data.json private: it contains subscriber emails.');
}

main().catch((err) => {
  console.error('Backup failed:', err.message || err);
  process.exit(1);
});
