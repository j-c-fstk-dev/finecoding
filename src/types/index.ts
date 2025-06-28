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
}
