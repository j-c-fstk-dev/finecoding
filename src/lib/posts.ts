'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import type { Post } from '@/types';

// This function now fetches all posts from Firestore
export async function getPosts(): Promise<Post[]> {
  // If db is not initialized (e.g., during build without env vars), return an empty array.
  if (!db) {
    console.warn("Firestore is not initialized. Returning empty array for posts. This is expected during static builds.");
    return [];
  }

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
    console.error("Error fetching posts from Firestore:", error);
    console.warn("Could not fetch posts from Firestore during build. Returning empty array.");
    return [];
  }
}

// This function fetches a single post by its slug (document ID)
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  // If db is not initialized, return undefined.
  if (!db) {
    console.warn(`Firestore is not initialized. Returning undefined for post '${slug}'. This is expected during static builds.`);
    return undefined;
  }
  
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
    console.error(`Error fetching post '${slug}' from Firestore:`, error);
    console.warn(`Could not fetch post '${slug}' from Firestore during build. Returning undefined.`);
    return undefined;
  }
}

// This function adds a new post to Firestore
export async function addPost(postData: { title: string; content: string; tags: string[] }): Promise<{ id: string }> {
  if (!db) {
    throw new Error("Firestore is not initialized. Cannot add post.");
  }
  
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
