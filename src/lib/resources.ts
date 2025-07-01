
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
  // AI & Machine Learning
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
    id: 'sample-7',
    name: 'Hugging Face',
    description: 'The leading open-source platform for AI, providing tools for building, training, and deploying state-of-the-art models.',
    link: 'https://huggingface.co/',
    category: 'AI & Machine Learning',
    pricing: 'Free Tier',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-20T09:00:00Z'),
  },
  {
    id: 'sample-8',
    name: 'OpenAI API',
    description: 'Access powerful AI models like GPT-4 and DALL-E for a wide range of applications, from text generation to image creation.',
    link: 'https://openai.com/api/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-20T08:00:00Z'),
  },
  {
    id: 'sample-9',
    name: 'Replicate',
    description: 'Run open-source machine learning models with a cloud API, without having to manage servers.',
    link: 'https://replicate.com/',
    category: 'AI & Machine Learning',
    pricing: 'Paid',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-20T07:00:00Z'),
  },
  {
    id: 'sample-10',
    name: 'LangChain',
    description: 'A framework for developing applications powered by language models, enabling complex workflows and integrations.',
    link: 'https://www.langchain.com/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-20T06:00:00Z'),
  },
  {
    id: 'sample-11',
    name: 'TensorFlow',
    description: 'An end-to-end open-source platform for machine learning developed by Google.',
    link: 'https://www.tensorflow.org/',
    category: 'AI & Machine Learning',
    pricing: 'Open Source',
    icon: 'BrainCircuit',
    createdAt: new Date('2024-05-20T05:00:00Z'),
  },

  // UI & Design
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
    id: 'sample-12',
    name: 'Figma',
    description: 'A collaborative interface design tool that allows teams to design, prototype, and gather feedback all in one place.',
    link: 'https://www.figma.com/',
    category: 'UI & Design',
    pricing: 'Free Tier',
    icon: 'Palette',
    createdAt: new Date('2024-05-19T10:00:00Z'),
  },
  {
    id: 'sample-13',
    name: 'Framer',
    description: 'A powerful tool for designing and building interactive prototypes and production-ready websites with React.',
    link: 'https://www.framer.com/',
    category: 'UI & Design',
    pricing: 'Free Tier',
    icon: 'Palette',
    createdAt: new Date('2024-05-19T09:00:00Z'),
  },
  {
    id: 'sample-14',
    name: 'Canva',
    description: 'An online design and publishing tool with a mission to empower everyone in the world to design anything.',
    link: 'https://www.canva.com/',
    category: 'UI & Design',
    pricing: 'Free Tier',
    icon: 'Palette',
    createdAt: new Date('2024-05-19T08:00:00Z'),
  },
  {
    id: 'sample-15',
    name: 'Dribbble',
    description: 'A community for designers to share, grow, and get hired. A great source for UI/UX inspiration.',
    link: 'https://dribbble.com/',
    category: 'UI & Design',
    pricing: 'Free',
    icon: 'Palette',
    createdAt: new Date('2024-05-19T07:00:00Z'),
  },
   {
    id: 'sample-16',
    name: 'unDraw',
    description: 'Open-source illustrations for any idea you can imagine and create. Completely free to use in any project.',
    link: 'https://undraw.co/illustrations',
    category: 'UI & Design',
    pricing: 'Free',
    icon: 'Palette',
    createdAt: new Date('2024-05-19T06:00:00Z'),
  },

  // DevOps & Hosting
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
    id: 'sample-17',
    name: 'Vercel',
    description: 'A platform for frontend frameworks and static sites, built to integrate with your headless content, commerce, or database.',
    link: 'https://vercel.com/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-18T11:00:00Z'),
  },
  {
    id: 'sample-18',
    name: 'Netlify',
    description: 'An all-in-one platform for automating modern web projects. Deploy sites and apps in just a few clicks.',
    link: 'https://www.netlify.com/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-18T10:00:00Z'),
  },
  {
    id: 'sample-19',
    name: 'Amazon Web Services (AWS)',
    description: 'A comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.',
    link: 'https://aws.amazon.com/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-18T09:00:00Z'),
  },
  {
    id: 'sample-20',
    name: 'Google Cloud Platform (GCP)',
    description: 'A suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.',
    link: 'https://cloud.google.com/',
    category: 'DevOps & Hosting',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-18T08:00:00Z'),
  },
  {
    id: 'sample-21',
    name: 'DigitalOcean',
    description: 'Cloud computing services for developers. Simple, scalable, and reliable infrastructure.',
    link: 'https://www.digitalocean.com/',
    category: 'DevOps & Hosting',
    pricing: 'Paid',
    icon: 'Server',
    createdAt: new Date('2024-05-18T07:00:00Z'),
  },

  // Developer Tools
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
    id: 'sample-22',
    name: 'GitHub Copilot',
    description: 'An AI pair programmer that offers autocomplete-style suggestions as you code.',
    link: 'https://github.com/features/copilot',
    category: 'Developer Tools',
    pricing: 'Paid',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-17T12:00:00Z'),
  },
  {
    id: 'sample-23',
    name: 'Postman',
    description: 'An API platform for building and using APIs. Postman simplifies each step of the API lifecycle and streamlines collaboration.',
    link: 'https://www.postman.com/',
    category: 'Developer Tools',
    pricing: 'Free Tier',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-17T11:00:00Z'),
  },
  {
    id: 'sample-24',
    name: 'Docker',
    description: 'A platform for developing, shipping, and running applications in containers.',
    link: 'https://www.docker.com/',
    category: 'Developer Tools',
    pricing: 'Free Tier',
    icon: 'Server',
    createdAt: new Date('2024-05-17T10:00:00Z'),
  },
   {
    id: 'sample-25',
    name: 'Warp Terminal',
    description: 'A blazingly fast, modern, and collaborative terminal built in Rust.',
    link: 'https://www.warp.dev/',
    category: 'Developer Tools',
    pricing: 'Free',
    icon: 'TerminalSquare',
    createdAt: new Date('2024-05-17T09:00:00Z'),
  },
   {
    id: 'sample-26',
    name: 'Sentry',
    description: 'Error tracking and performance monitoring for developers.',
    link: 'https://sentry.io/',
    category: 'Developer Tools',
    pricing: 'Free Tier',
    icon: 'Component',
    createdAt: new Date('2024-05-17T08:00:00Z'),
  },

  // Books & Courses
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
    id: 'sample-27',
    name: 'freeCodeCamp',
    description: 'A non-profit organization that consists of an interactive learning web platform, an online community forum, and thousands of articles.',
    link: 'https://www.freecodecamp.org/',
    category: 'Books & Courses',
    pricing: 'Free',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T13:00:00Z'),
  },
  {
    id: 'sample-28',
    name: 'The Pragmatic Programmer',
    description: 'A classic book that examines the core of what it means to be a modern programmer. Journey to mastery.',
    link: 'https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/',
    category: 'Books & Courses',
    pricing: 'Paid',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T12:00:00Z'),
  },
  {
    id: 'sample-29',
    name: 'MDN Web Docs',
    description: 'The ultimate resource for web developers, maintained by a community of developers and technical writers.',
    link: 'https://developer.mozilla.org/',
    category: 'Books & Courses',
    pricing: 'Free',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T11:00:00Z'),
  },
  {
    id: 'sample-30',
    name: 'Coursera',
    description: 'Online learning platform offering university-level courses and certifications from top companies and institutions.',
    link: 'https://www.coursera.org/',
    category: 'Books & Courses',
    pricing: 'Free Tier',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T10:00:00Z'),
  },
  {
    id: 'sample-31',
    name: 'Designing Data-Intensive Applications',
    description: 'The essential guide to building scalable, reliable, and maintainable data systems.',
    link: 'https://www.amazon.com/Designing-Data-Intensive-Applications-Reliable-Maintainable/dp/1449373321',
    category: 'Books & Courses',
    pricing: 'Paid',
    icon: 'BookOpen',
    createdAt: new Date('2024-05-16T09:00:00Z'),
  },

  // Productivity
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
  {
    id: 'sample-32',
    name: 'Slack',
    description: 'A messaging app for business that connects people to the information they need. It brings people together to work as one unified team.',
    link: 'https://slack.com/',
    category: 'Productivity',
    pricing: 'Free Tier',
    icon: 'Zap',
    createdAt: new Date('2024-05-15T14:00:00Z'),
  },
  {
    id: 'sample-33',
    name: 'Trello',
    description: 'A collaboration tool that organizes your projects into boards. In one glance, Trello tells you what\'s being worked on, who\'s working on what, and where something is in a process.',
    link: 'https://trello.com/',
    category: 'Productivity',
    pricing: 'Free Tier',
    icon: 'Zap',
    createdAt: new Date('2024-05-15T13:00:00Z'),
  },
  {
    id: 'sample-34',
    name: 'Linear',
    description: 'The issue tracking tool you\'ll enjoy using. Linear helps streamline software projects, sprints, and bug tracking.',
    link: 'https://linear.app/',
    category: 'Productivity',
    pricing: 'Free Tier',
    icon: 'Zap',
    createdAt: new Date('2024-05-15T12:00:00Z'),
  },
  {
    id: 'sample-35',
    name: 'Miro',
    description: 'The online collaborative whiteboard platform to bring teams together, anytime, anywhere.',
    link: 'https://miro.com/',
    category: 'Productivity',
    pricing: 'Free Tier',
    icon: 'Zap',
    createdAt: new Date('2024-05-15T11:00:00Z'),
  },
   {
    id: 'sample-36',
    name: 'Raycast',
    description: 'A blazingly fast, totally extendable launcher for macOS. It lets you control your tools with a few keystrokes.',
    link: 'https://www.raycast.com/',
    category: 'Productivity',
    pricing: 'Free',
    icon: 'Zap',
    createdAt: new Date('2024-05-15T10:00:00Z'),
  },
];

export async function getResources(): Promise<Resource[]> {
  if (!db) {
    console.warn("Firestore is not initialized. Returning sample resources.");
    return sampleResources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  try {
    const resourcesCollection = collection(db, 'resources');
    const q = query(resourcesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No resources found in Firestore, returning sample data.");
        // When no data in DB, populate it with sample data
        const batch = (await import('firebase/firestore')).writeBatch(db);
        sampleResources.forEach(resource => {
            const { id, ...data } = resource;
            const docRef = doc(collection(db, 'resources'));
            batch.set(docRef, { ...data, createdAt: Timestamp.fromDate(data.createdAt) });
        });
        await batch.commit();
        return sampleResources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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
    return sampleResources.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
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

    