'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import type { Post } from '@/types';

// This function now fetches all posts from Firestore
export async function getPosts(): Promise<Post[]> {
  const postsCollection = collection(db, 'posts');
  // Order by date in descending order to get the newest posts first
  const q = query(postsCollection, orderBy('date', 'desc'));
  const postSnapshot = await getDocs(q);
  const posts: Post[] = [];
  postSnapshot.forEach((doc) => {
    const data = doc.data();
    posts.push({
      slug: doc.id,
      title: data.title,
      date: data.date.toDate(), // Convert Firestore Timestamp to JS Date
      tags: data.tags,
      content: data.content,
      excerpt: data.excerpt,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
    } as Post);
  });
  return posts;
}

// This function fetches a single post by its slug (document ID)
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const postDocRef = doc(db, 'posts', slug);
  const postDoc = await getDoc(postDocRef);

  if (!postDoc.exists()) {
    return undefined;
  }

  const data = postDoc.data();
  return {
    slug: postDoc.id,
    title: data.title,
    date: data.date.toDate(), // Convert Firestore Timestamp to JS Date
    tags: data.tags,
    content: data.content,
    excerpt: data.excerpt,
    imageUrl: data.imageUrl,
    imageHint: data.imageHint,
  } as Post;
}
