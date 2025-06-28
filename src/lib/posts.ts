'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post } from '@/types';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export async function getPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const post: Post = {
      slug,
      title: matterResult.data.title,
      date: new Date(matterResult.data.date),
      tags: matterResult.data.tags,
      excerpt: matterResult.data.excerpt,
      imageUrl: matterResult.data.imageUrl,
      imageHint: matterResult.data.imageHint,
      content: matterResult.content,
    };
    return post;
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const post: Post = {
      slug,
      title: matterResult.data.title,
      date: new Date(matterResult.data.date),
      tags: matterResult.data.tags,
      excerpt: matterResult.data.excerpt,
      imageUrl: matterResult.data.imageUrl,
      imageHint: matterResult.data.imageHint,
      content: matterResult.content,
    };
    return post;
  } catch (error) {
    // If the file doesn't exist, return undefined
    return undefined;
  }
}

export async function addPost(postData: { title: string; content: string; tags: string[] }): Promise<{ id: string }> {
  // This function is now a placeholder.
  // With the switch to local markdown files, adding/editing posts
  // needs a new mechanism, such as a serverless function that can
  // commit to the git repository.
  console.warn('addPost is a placeholder in the new static architecture.');
  throw new Error("Adding posts directly is not supported in this static architecture. Please add posts by creating new .md files in the 'src/posts' directory.");
}
