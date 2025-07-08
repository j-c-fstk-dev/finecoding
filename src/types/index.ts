export interface Post {
  id?: string; // Firestore document ID
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  content: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
  likes: number;
}

export interface Comment {
  id: string;
  name: string;
  comment: string;
  createdAt: Date;
}

// --- New Types for Resources ---

export const resourceCategories = ['AI & Machine Learning', 'Developer Tools', 'DevOps & Hosting', 'Productivity', 'Books & Courses', 'UI & Design', 'Repositories'] as const;
export type ResourceCategory = typeof resourceCategories[number];

export const pricingModels = ['Free', 'Free Tier', 'Paid', 'Open Source'] as const;
export type PricingModel = typeof pricingModels[number];

export interface Resource {
  id?: string;
  name: string;
  description: string;
  link: string;
  category: ResourceCategory;
  pricing: PricingModel;
  icon?: string; // Optional: for a lucide-react icon name e.g., 'BrainCircuit'
  createdAt: Date;
  favorites: number;
}

export interface ResourceComment {
  id: string;
  name: string;
  comment: string;
  createdAt: Date;
}
