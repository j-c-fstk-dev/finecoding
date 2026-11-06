'use server';

import { adminDb, requireAdmin } from '@/lib/firebase-admin';
import type { Post } from '@/types';
import { FieldValue, Timestamp, type DocumentData } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const PostInputSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(10).max(200),
  imageUrl: z.string().url(),
  imageHint: z.string().optional().default(''),
  content: z.string().min(50),
  tags: z.array(z.string()).min(1),
});

export type PostInput = z.input<typeof PostInputSchema>;

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents (ç, ã, é...) instead of dropping the letter
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date(0);
}

function docToPost(id: string, data: DocumentData): Post {
  return {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt || '',
    content: data.content || '',
    imageUrl: data.imageUrl || '',
    imageHint: data.imageHint || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    likes: typeof data.likes === 'number' ? data.likes : 0,
    date: toDate(data.date),
  };
}

function revalidatePostPages(slug?: string) {
  revalidatePath('/');
  revalidatePath('/posts');
  revalidatePath('/dashboard');
  if (slug) revalidatePath(`/posts/${slug}`);
}

/**
 * Errors are intentionally NOT swallowed here: if Firestore is unreachable we
 * want the build (or ISR regeneration) to fail and keep the last good page,
 * instead of publishing a blog with zero posts.
 */
export async function getPosts(): Promise<Post[]> {
  const snapshot = await adminDb().collection('posts').orderBy('date', 'desc').get();
  return snapshot.docs.map((doc) => docToPost(doc.id, doc.data()));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const snapshot = await adminDb().collection('posts').where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return docToPost(doc.id, doc.data());
}

export async function addPost(idToken: string, input: PostInput) {
  await requireAdmin(idToken);
  const data = PostInputSchema.parse(input);
  const slug = createSlug(data.title);

  const existing = await adminDb().collection('posts').where('slug', '==', slug).limit(1).get();
  if (!existing.empty) {
    throw new Error('A post with this title already exists. Choose a different title.');
  }

  await adminDb().collection('posts').add({
    ...data,
    slug,
    likes: 0,
    date: Timestamp.now(),
  });

  revalidatePostPages(slug);
}

export async function updatePost(idToken: string, id: string, input: PostInput) {
  await requireAdmin(idToken);
  const data = PostInputSchema.parse(input);

  const ref = adminDb().collection('posts').doc(id);
  const current = await ref.get();
  if (!current.exists) throw new Error('Post not found.');

  // Keep the existing slug so shared links and SEO don't break when a title is edited.
  const slug: string = current.data()?.slug || createSlug(data.title);

  await ref.update({ ...data, slug });
  revalidatePostPages(slug);
}

export async function deletePost(idToken: string, id: string) {
  await requireAdmin(idToken);
  const ref = adminDb().collection('posts').doc(id);
  const current = await ref.get();
  await ref.delete();
  revalidatePostPages(current.data()?.slug);
}

/** Public action: anyone can like a post. Only increments the counter. */
export async function likePost(id: string, slug: string) {
  if (typeof id !== 'string' || !id) throw new Error('Invalid post id.');
  await adminDb().collection('posts').doc(id).update({ likes: FieldValue.increment(1) });
  revalidatePath(`/posts/${slug}`);
}
