
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
        name: 'onlook',
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
        name: 'desktop',
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
        name: 'onlook-web',
        description: 'Web version of Onlook - design directly in your live React application and publish your changes to code.',
        link: 'https://github.com/OpulentiaAI/onlook-web',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-24T12:00:00Z'),
        favorites: 64,
    },
    {
        id: 'free-programming-books',
        name: 'free-programming-books',
        description: 'Freely available programming books.',
        link: 'https://github.com/EbookFoundation/free-programming-books',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-23T10:00:00Z'),
        favorites: 315000,
    },
    {
        id: 'awesome',
        name: 'awesome',
        description: 'Awesome lists about all kinds of interesting topics.',
        link: 'https://github.com/sindresorhus/awesome',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-22T10:00:00Z'),
        favorites: 293000,
    },
    {
        id: 'developer-roadmap',
        name: 'developer-roadmap',
        description: 'Roadmaps to becoming a developer in 2024.',
        link: 'https://github.com/kamranahmedse/developer-roadmap',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-21T10:00:00Z'),
        favorites: 269000,
    },
    {
        id: 'build-your-own-x',
        name: 'build-your-own-x',
        description: 'Master programming by recreating your favorite technologies from scratch.',
        link: 'https://github.com/codecrafters-io/build-your-own-x',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-20T10:00:00Z'),
        favorites: 251000,
    },
    {
        id: 'public-apis',
        name: 'public-apis',
        description: 'A collective list of free APIs for use in software and web development.',
        link: 'https://github.com/public-apis/public-apis',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-19T10:00:00Z'),
        favorites: 283000,
    },
    {
        id: 'tech-interview-handbook',
        name: 'tech-interview-handbook',
        description: 'Curated content to help you ace your next tech interview.',
        link: 'https://github.com/yangshun/tech-interview-handbook',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-18T10:00:00Z'),
        favorites: 108000,
    },
    {
        id: 'javascript-algorithms',
        name: 'javascript-algorithms',
        description: 'Algorithms and data structures implemented in JavaScript.',
        link: 'https://github.com/trekhleb/javascript-algorithms',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-17T10:00:00Z'),
        favorites: 182000,
    },
    {
        id: 'free-for-dev',
        name: 'free-for-dev',
        description: 'A list of SaaS, PaaS and IaaS offerings that have free tiers of interest to developers.',
        link: 'https://github.com/ripienaar/free-for-dev',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-16T10:00:00Z'),
        favorites: 83000,
    },
     {
        id: 'nodebestpractices',
        name: 'nodebestpractices',
        description: 'The Node.js best practices list (June 2024).',
        link: 'https://github.com/goldbergyoni/nodebestpractices',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-15T10:00:00Z'),
        favorites: 102000,
    },
    {
        id: 'project-based-learning',
        name: 'project-based-learning',
        description: 'A list of programming tutorials in which learners build an application from scratch.',
        link: 'https://github.com/practical-tutorials/project-based-learning',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-14T10:00:00Z'),
        favorites: 157000,
    },
    {
        id: 'the-art-of-command-line',
        name: 'the-art-of-command-line',
        description: 'Master the command line, in one page.',
        link: 'https://github.com/jlevy/the-art-of-command-line',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-13T10:00:00Z'),
        favorites: 146000,
    },
    {
        id: 'realworld',
        name: 'realworld',
        description: 'The mother of all demo apps — Exemplary fullstack Medium.com clone.',
        link: 'https://github.com/gothinkster/realworld',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-12T10:00:00Z'),
        favorites: 82000,
    },
    {
        id: 'app-ideas',
        name: 'app-ideas',
        description: 'A collection of application ideas which can be used to improve your coding skills.',
        link: 'https://github.com/florinpop17/app-ideas',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-11T10:00:00Z'),
        favorites: 73000,
    },
    {
        id: 'the-book-of-secret-knowledge',
        name: 'the-book-of-secret-knowledge',
        description: 'A collection of inspiring lists, manuals, cheatsheets, blogs, hacks, and more.',
        link: 'https://github.com/trimstray/the-book-of-secret-knowledge',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-10T10:00:00Z'),
        favorites: 125000,
    },
    {
        id: 'awesome-n8n-templates',
        name: 'awesome-n8n-templates',
        description: 'A curated list of awesome n8n templates and resources.',
        link: 'https://github.com/enescingoz/awesome-n8n-templates',
        category: 'Repositories',
        pricing: 'Open Source',
        icon: 'Github',
        createdAt: new Date('2024-07-09T10:00:00Z'),
        favorites: 142,
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
