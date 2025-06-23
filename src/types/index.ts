export interface Post {
  slug: string;
  title: string;
  date: any; // Can be a string or a Firestore Timestamp
  tags: string[];
  content: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
}
