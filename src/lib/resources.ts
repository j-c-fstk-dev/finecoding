

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


// Hardcoded list of resources to ensure they are always present.
const hardcodedRepositories: Resource[] = [
    // New Additions from the list
    {
        id: 'vercel-cloud',
        name: 'Vercel',
        description: 'A frontend cloud solution for hosting static websites and serverless functions.',
        link: 'https://vercel.com/',
        category: 'Cloud Platforms',
        pricing: 'Free Tier',
        icon: 'Server',
        createdAt: new Date('2024-08-01T10:00:00Z'),
        favorites: 1800,
    },
    {
        id: 'netlify-cloud',
        name: 'Netlify',
        description: 'An integrated platform designed to automate and manage modern web projects.',
        link: 'https://www.netlify.com/',
        category: 'Cloud Platforms',
        pricing: 'Free Tier',
        icon: 'Server',
        createdAt: new Date('2024-08-01T09:00:00Z'),
        favorites: 1500,
    },
    {
        id: 'cursor-ai',
        name: 'Cursor',
        description: 'A code editor built from the ground up with AI capabilities, including native GPT integration.',
        link: 'https://www.cursor.so/',
        category: 'AI & Machine Learning',
        pricing: 'Free Tier',
        icon: 'BrainCircuit',
        createdAt: new Date('2024-08-01T08:00:00Z'),
        favorites: 1200,
    },
    {
        id: 'github-copilot-ai',
        name: 'GitHub Copilot',
        description: 'An AI-driven pair programmer from GitHub that suggests code and entire functions.',
        link: 'https://github.com/features/copilot',
        category: 'AI & Machine Learning',
        pricing: 'Paid',
        icon: 'Github',
        createdAt: new Date('2024-08-01T07:00:00Z'),
        favorites: 2500,
    },
     {
        id: 'vscode-editor',
        name: 'VSCode',
        description: 'A highly popular and extensible open-source code editor developed by Microsoft.',
        link: 'https://code.visualstudio.com/',
        category: 'Developer Tools',
        pricing: 'Open Source',
        icon: 'Code',
        createdAt: new Date('2024-08-01T06:00:00Z'),
        favorites: 5000,
    },
    {
        id: 'warp-terminal',
        name: 'Warp',
        description: 'A contemporary terminal built with Rust, featuring integrated AI commands and a modern UI.',
        link: 'https://www.warp.dev/',
        category: 'Developer Tools',
        pricing: 'Free',
        icon: 'TerminalSquare',
        createdAt: new Date('2024-08-01T05:00:00Z'),
        favorites: 900,
    },
    {
        id: 'docker-devops',
        name: 'Docker',
        description: 'A containerization platform used for building, deploying, and running applications.',
        link: 'https://www.docker.com/',
        category: 'DevOps & Hosting',
        pricing: 'Free Tier',
        icon: 'Server',
        createdAt: new Date('2024-08-01T04:00:00Z'),
        favorites: 4000,
    },
    {
        id: 'firebase-backend',
        name: 'Firebase',
        description: 'Google-s Backend-as-a-Service (BaaS) for creating realtime applications quickly.',
        link: 'https://firebase.google.com/',
        category: 'APIs & Backends',
        pricing: 'Free Tier',
        icon: 'Server',
        createdAt: new Date('2024-08-01T03:00:00Z'),
        favorites: 3000,
    },
    {
        id: 'supabase-backend',
        name: 'Supabase',
        description: 'An open-source alternative to Firebase, providing a suite of backend tools.',
        link: 'https://supabase.com/',
        category: 'APIs & Backends',
        pricing: 'Open Source',
        icon: 'Server',
        createdAt: new Date('2024-08-01T02:00:00Z'),
        favorites: 2800,
    },
    {
        id: 'figma-design',
        name: 'Figma',
        description: 'A web-based, collaborative tool for designing user interfaces and prototypes.',
        link: 'https://www.figma.com/',
        category: 'UI & Design',
        pricing: 'Free Tier',
        icon: 'Palette',
        createdAt: new Date('2024-08-01T01:00:00Z'),
        favorites: 6000,
    },
    {
        id: 'storybook-design',
        name: 'Storybook',
        description: 'An interactive environment for developing and showcasing UI components in isolation.',
        link: 'https://storybook.js.org/',
        category: 'UI & Design',
        pricing: 'Open Source',
        icon: 'Component',
        createdAt: new Date('2024-07-31T12:00:00Z'),
        favorites: 1500,
    },
    {
        id: 'playwright-testing',
        name: 'Playwright',
        description: 'A framework for reliable end-to-end testing and automation for modern web applications.',
        link: 'https://playwright.dev/',
        category: 'Testing & Quality',
        pricing: 'Open Source',
        icon: 'Zap',
        createdAt: new Date('2024-07-31T11:00:00Z'),
        favorites: 1200,
    },
    {
        id: 'prettier-testing',
        name: 'Prettier',
        description: 'An opinionated code formatter that enforces a consistent style across your codebase.',
        link: 'https://prettier.io/',
        category: 'Testing & Quality',
        pricing: 'Open Source',
        icon: 'Code',
        createdAt: new Date('2024-07-31T10:00:00Z'),
        favorites: 2000,
    },
    {
        id: 'docusaurus-docs',
        name: 'Docusaurus',
        description: 'A static site generator optimized for creating and maintaining open-source documentation.',
        link: 'https://docusaurus.io/',
        category: 'Docs & Knowledge',
        pricing: 'Open Source',
        icon: 'BookOpen',
        createdAt: new Date('2024-07-31T09:00:00Z'),
        favorites: 800,
    },
    {
        id: 'notion-docs',
        name: 'Notion',
        description: 'A unified workspace for managing notes, documents, tasks, and team collaboration.',
        link: 'https://www.notion.so/',
        category: 'Docs & Knowledge',
        pricing: 'Free Tier',
        icon: 'BookOpen',
        createdAt: new Date('2024-07-31T08:00:00Z'),
        favorites: 4500,
    },
    {
        id: 'react-devtools-ext',
        name: 'React Developer Tools',
        description: 'A browser extension for inspecting and debugging React component hierarchies.',
        link: 'https://github.com/facebook/react-devtools',
        category: 'Browser Extensions',
        pricing: 'Open Source',
        icon: 'Component',
        createdAt: new Date('2024-07-31T07:00:00Z'),
        favorites: 3000,
    },
     {
        id: 'raycast-prod',
        name: 'Raycast',
        description: 'An extensible launcher for macOS designed to boost developer productivity.',
        link: 'https://www.raycast.com/',
        category: 'Productivity',
        pricing: 'Free',
        icon: 'Zap',
        createdAt: new Date('2024-07-31T06:00:00Z'),
        favorites: 1800,
    },
    // Original Repositories
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
        description: 'A comprehensive collection of freely accessible programming books for all levels.',
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
        description: 'A vast compilation of curated lists covering a wide range of interesting topics.',
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
        description: 'Visual roadmaps and guides for becoming a developer in various fields in 2024.',
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
        description: 'A guide to mastering programming by recreating popular technologies from scratch.',
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
        description: 'A community-driven list of free APIs available for software and web development projects.',
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
        description: 'A curated collection of materials to help you succeed in your next technical interview.',
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
        description: 'A repository of common algorithms and data structures implemented in JavaScript.',
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
        description: 'A list of SaaS, PaaS, and IaaS products that offer free tiers suitable for developers.',
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
        description: 'A comprehensive list of best practices for Node.js development, updated for 2024.',
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
        description: 'A curated collection of programming tutorials where learners build an application from scratch.',
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
        description: 'A single-page guide to mastering the command line for developers.',
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
        description: '"The mother of all demo apps" — An exemplary full-stack Medium.com clone.',
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
        description: 'A curated list of application ideas to help you improve your coding skills.',
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
        description: 'A curated collection of inspiring lists, manuals, cheatsheets, blogs, hacks, and more for developers.',
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
        description: 'A curated list of useful n8n templates and community resources.',
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
