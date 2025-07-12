
'use server';

import { db } from '@/lib/firebase';
import type { Post } from '@/types';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  limit,
  increment
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function getPosts(): Promise<Post[]> {
  try {
    const postsCollection = collection(db, 'posts');
    const q = query(postsCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: (data.date as Timestamp).toDate(),
      } as Post;
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    // In a production environment, you might want to handle this more gracefully
    // For now, we return an empty array and log the error.
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const postDoc = querySnapshot.docs[0];
        const data = postDoc.data();
        
        return {
            id: postDoc.id,
            ...data,
            date: (data.date as Timestamp).toDate(),
        } as Post;

    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}

export async function addPost(postData: Omit<Post, 'id' | 'slug' | 'date' | 'likes'>) {
    const slug = createSlug(postData.title);
    
    const newPost = {
        ...postData,
        slug,
        likes: 0,
        date: Timestamp.fromDate(new Date()),
    };
    
    const postsCollection = collection(db, 'posts');
    await addDoc(postsCollection, newPost);
    revalidatePath('/');
    revalidatePath('/posts');
    revalidatePath('/dashboard');
    revalidatePath(`/posts/${slug}`);
}

export async function updatePost(id: string, postData: Partial<Post>) {
    const postRef = doc(db, 'posts', id);
    const updatedData: Partial<Post> = { ...postData };
    
    if (postData.title) {
        updatedData.slug = createSlug(postData.title);
    }
    
    // Ensure 'likes' is not accidentally overwritten
    delete (updatedData as any).likes;

    await updateDoc(postRef, updatedData);
    revalidatePath('/');
    revalidatePath('/posts');
    revalidatePath('/dashboard');
    if (updatedData.slug) {
        revalidatePath(`/posts/${updatedData.slug}`);
    }
}

export async function deletePost(id: string) {
    const postRef = doc(db, 'posts', id);
    await deleteDoc(postRef);
    revalidatePath('/');
    revalidatePath('/posts');
    revalidatePath('/dashboard');
}

export async function likePost(id: string, slug: string) {
    const postRef = doc(db, 'posts', id);
    await updateDoc(postRef, {
        likes: increment(1)
    });
    revalidatePath(`/posts/${slug}`);
}
