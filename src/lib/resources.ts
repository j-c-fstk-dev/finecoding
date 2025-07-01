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
  query
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

const sampleResources: Resource[] = [
  {
    id: 'sample-1',
    name: 'Google AI Studio',
    description: 'A browser-based IDE for prototyping with generative models. Easily turn prompts into production-ready code.',
    link: 'https://aistudio.google.com/',
    category: 'AI & Machine Learning',
    pricing: 'Free Tier',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-20T10:00:00Z'),
  },
  {
    id: 'sample-2',
    name: 'shadcn/ui',
    description: 'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    link: 'https://ui.shadcn.com/',
    category: 'UI & Design',
    pricing: 'Open Source',
    icon: 'Palette',
    createdAt: new Date('2024-05-19T11:00:00Z'),
  },
  {
    id: 'sample-3',
    name: 'Firebase',
    description: 'An app development platform that helps you build and grow apps and games users love. Backed by Google.',
    link: 'https://firebase.google.com/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-18T12:00:00Z'),
  },
  {
    id: 'sample-4',
    name: 'VS Code',
    description: 'A lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux.',
    link: 'https://code.visualstudio.com/',
    category: 'Developer Tools',
    pricing: 'Free',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-17T13:00:00Z'),
  },
  {
    id: 'sample-5',
    name: 'Clean Code by Robert C. Martin',
    description: 'A handbook of agile software craftsmanship. A must-read for any developer looking to improve their code quality.',
    link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882',
    category: 'Books & Courses',
    pricing: 'Paid',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T14:00:00Z'),
  },
  {
    id: 'sample-6',
    name: 'Notion',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases. Connects your team, projects, and documents.',
    link: 'https://www.notion.so/',
    category: 'Productivity',
    pricing: 'Free Tier',
    icon: 'Zap',
    createdAt: new Date('2024-05-15T15:00:00Z'),
  },
];

export async function getResources(): Promise<Resource[]> {
  if (!db) {
    console.warn("Firestore is not initialized. Returning sample resources.");
    return sampleResources;
  }

  try {
    const resourcesCollection = collection(db, 'resources');
    const q = query(resourcesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No resources found in Firestore, returning sample data.");
        return sampleResources;
    }
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as Resource;
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return sampleResources;
  }
}

export async function getResourceById(id: string): Promise<Resource | null> {
    if (!db) {
        console.warn("Firestore is not initialized.");
        // Check if sample data has the item
        return sampleResources.find(r => r.id === id) || null;
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

export async function addResource(resourceData: Omit<Resource, 'id' | 'createdAt'>) {
    if (!db) throw new Error("Firestore is not initialized.");

    const newResource = {
        ...resourceData,
        createdAt: serverTimestamp(),
    };
    
    await addDoc(collection(db, 'resources'), newResource);
    revalidatePath('/dashboard/resources');
    revalidatePath('/resources');
}

export async function updateResource(id: string, resourceData: Partial<Omit<Resource, 'id' | 'createdAt'>>) {
    if (!db) throw new Error("Firestore is not initialized.");
    
    const resourceRef = doc(db, 'resources', id);
    await updateDoc(resourceRef, resourceData);

    revalidatePath('/dashboard/resources');
    revalidatePath('/resources');
}

export async function deleteResource(id: string) {
    if (!db) throw new Error("Firestore is not initialized.");
    
    const resourceRef = doc(db, 'resources', id);
    await deleteDoc(resourceRef);

    revalidatePath('/dashboard/resources');
    revalidatePath('/resources');
}
