'use server';

import { db } from '@/lib/firebase';
import type { Comment, ResourceComment } from '@/types';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// --- Post Comments ---

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        comment: data.comment,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Comment;
    });
  } catch (error) {
    // This is a common case if a post has no comments subcollection yet.
    // We can safely return an empty array.
    if (error instanceof Error && error.message.includes('No document to update')) {
        return [];
    }
    // For other errors, log it, as it might be a more serious issue (e.g., permissions).
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function addComment(postId: string, slug: string, commentData: { name: string; comment: string }) {
  const commentsRef = collection(db, 'posts', postId, 'comments');
  await addDoc(commentsRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
  revalidatePath(`/posts/${slug}`);
}


// --- Resource Comments ---

export async function getResourceComments(resourceId: string): Promise<ResourceComment[]> {
  try {
    const commentsRef = collection(db, 'resources', resourceId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        comment: data.comment,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as ResourceComment;
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('No document to update')) {
        return [];
    }
    console.error("Error fetching resource comments:", error);
    return [];
  }
}

export async function addResourceComment(resourceId: string, commentData: { name: string; comment: string }) {
  const commentsRef = collection(db, 'resources', resourceId, 'comments');
  await addDoc(commentsRef, {
    ...commentData,
    createdAt: serverTimestamp(),
  });
  revalidatePath('/resources');
}
