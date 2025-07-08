
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
  increment,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';


// Hardcoded list of repositories to ensure they are always present.
const hardcodedRepositories: Resource[] = [
    {
        id: 'onlook-main',
        name: 'Onlook',
        description: 'The Cursor for Designers - An open-source visual editor to build, style, and edit your React application with AI.',
        link: 'https://github.com/onlook-dev/onlook',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-26T10:00:00Z'),
        favorites: 215,
    },
    {
        id: 'onlook-desktop',
        name: 'Onlook Desktop',
        description: 'Desktop version of Onlook - the open source Cursor for Designers.',
        link: 'https://github.com/onlook-dev/desktop',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-25T11:00:00Z'),
        favorites: 98,
    },
    {
        id: 'onlook-web',
        name: 'Onlook Web',
        description: 'Web version of Onlook - design directly in your live React application and publish your changes to code.',
        link: 'https://github.com/OpulentiaAI/onlook-web',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-24T12:00:00Z'),
        favorites: 64,
    },
];

export async function getResources(): Promise<Resource[]> {
  let firestoreResources: Resource[] = [];
  try {
    const resourcesCollection = collection(db, 'resources');
    const q = query(resourcesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    firestoreResources = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Resource;
    });
  } catch (error) {
    console.error("Error fetching resources from Firestore:", error);
  }

  const allResources = [...firestoreResources, ...hardcodedRepositories];

  // Sort all resources by date descending
  allResources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return allResources;
}

export async function getResourceById(id: string): Promise<Resource | null> {
    const hardcodedResource = hardcodedRepositories.find(repo => repo.id === id);
    if (hardcodedResource) {
        return hardcodedResource;
    }
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

export async function updateResource(id: string, resourceData: Partial<Omit<Resource, 'favorites'>>) {
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
    const hardcodedResource = hardcodedRepositories.find(repo => repo.id === id);
    if (hardcodedResource) {
        console.warn(`Liking a hardcoded resource (${id}) is not persisted.`);
        // This action won't be saved for hardcoded items.
        return;
    }
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, {
        favorites: increment(1)
    });
    revalidatePath('/resources');
}
