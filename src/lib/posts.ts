'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Post } from '@/types';

// This function now fetches all posts from Firestore
export async function getPosts(): Promise<Post[]> {
  // During static export, Firebase might not be available if credentials aren't set.
  // This try/catch allows the build to succeed by returning an empty array.
  try {
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
  } catch (error) {
    console.warn("Could not fetch posts from Firestore during build. This is expected if Firebase credentials are not configured in the build environment. Returning empty array.");
    return [];
  }
}

// This function fetches a single post by its slug (document ID)
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  // During static export, Firebase might not be available if credentials aren't set.
  // This try/catch allows the build to succeed by returning undefined.
  try {
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
  } catch (error) {
    console.warn(`Could not fetch post '${slug}' from Firestore during build. This is expected if Firebase credentials are not configured in the build environment. Returning undefined.`);
    return undefined;
  }
}

// This function adds a new post to Firestore
export async function addPost(postData: { title: string; content: string; tags: string[] }): Promise<{ id: string }> {
  try {
    const postsCollection = collection(db, 'posts');
    
    // Create an excerpt from the first 150 characters of the content
    const excerpt = postData.content.substring(0, 150) + '...';

    const newPostData = {
      ...postData,
      excerpt,
      date: serverTimestamp(),
      imageUrl: 'https://placehold.co/600x400.png',
      imageHint: 'code technology',
    };

    const docRef = await addDoc(postsCollection, newPostData);
    
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Could not create post.");
  }
}
