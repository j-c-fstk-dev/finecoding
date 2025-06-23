export interface Post {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  content: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
}
