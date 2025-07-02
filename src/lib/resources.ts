
'use server';

import { db } from '@/lib/firebase';
import type { Resource } from '@/types';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy, 
  Timestamp,
  serverTimestamp,
  query,
  increment
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function getResources(): Promise<Resource[]> {
  try {
    const resourcesCollection = collection(db, 'resources');
    const q = query(resourcesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const resources = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Resource;
    });

    return resources;
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
    try {
        const resourceRef = doc(db, 'resources', id);
        const docSnap = await getDoc(resourceRef);

        if (!docSnap.exists()) {
            return null;
        }

        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: (data.createdAt as Timestamp).toDate(),
        } as Resource;

    } catch (error) {
        console.error("Error fetching resource by id:", error);
        return null;
    }
}

export async function addResource(resourceData: Omit<Resource, 'id' | 'createdAt' | 'favorites'>) {
    const newResource = {
        ...resourceData,
        favorites: 0,
        createdAt: serverTimestamp(),
    };
    
    const resourcesCollection = collection(db, 'resources');
    await addDoc(resourcesCollection, newResource);
    revalidatePath('/resources');
    revalidatePath('/dashboard/resources');
}

export async function updateResource(id: string, resourceData: Partial<Resource>) {
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, resourceData);
    revalidatePath('/resources');
    revalidatePath('/dashboard/resources');
}

export async function deleteResource(id: string) {
    const resourceRef = doc(db, 'resources', id);
    await deleteDoc(resourceRef);
    revalidatePath('/resources');
    revalidatePath('/dashboard/resources');
}

export async function likeResource(id: string) {
  const resourceRef = doc(db, 'resources', id);
  await updateDoc(resourceRef, {
      favorites: increment(1)
  });
  revalidatePath(`/resources`);
}
