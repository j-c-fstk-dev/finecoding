import type { Post } from '@/types';

const posts: Post[] = [
  {
    slug: 'getting-started-with-nextjs-15',
    title: 'Getting Started with Next.js 15',
    date: '2024-07-21',
    tags: ['Next.js', 'React', 'Web Dev'],
    excerpt: 'A deep dive into the new features of Next.js 15 and how to leverage them for modern web applications.',
    content: `
# Welcome to the Future of Web Dev: Next.js 15

Next.js 15 is here, and it brings a host of new features that are set to revolutionize how we build web applications. In this post, we'll explore the key updates and how you can start using them today.

## Key Features

*   **React Compiler:** A new, experimental compiler that optimizes your React code automatically.
*   **Improved Caching:** More granular control over caching strategies.
*   **Partial Prerendering (PPR):** A new rendering model that combines the best of SSR and SSG.

## Code Example

Here's how you can enable the React Compiler in your \`next.config.ts\`:

\`\`\`javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
\`\`\`

Stay tuned for more updates and tutorials on Fine Coding!
`,
  },
  {
    slug: 'demystifying-ai-models',
    title: 'Demystifying AI Models: A Beginner\'s Guide',
    date: '2024-07-15',
    tags: ['AI', 'Machine Learning', 'GenAI'],
    excerpt: 'Understand the basics of AI models like LLMs and diffusion models without getting lost in the jargon.',
    content: `
# Demystifying AI Models

Artificial Intelligence can seem like magic, but at its core, it's all about models. Let's break down what they are.

## What is a Model?

In AI, a model is a complex system, often a neural network, that has been "trained" on a vast amount of data to recognize patterns. This allows it to perform tasks like generating text, translating languages, or creating images.

### Large Language Models (LLMs)

LLMs are trained on text. They learn grammar, facts, reasoning abilities, and even styles of writing.

### Diffusion Models

These are often used for image generation. They start with random noise and gradually refine it into a coherent image based on a text prompt.
`,
  },
  {
    slug: 'the-art-of-fine-coding',
    title: 'The Art of "Fine Coding"',
    date: '2024-07-10',
    tags: ['Philosophy', 'Code Quality', 'Best Practices'],
    excerpt: 'What does it mean to be a "Fine Coder"? It\'s more than just writing code that works. It\'s about craftsmanship.',
    content: `
# The Art of "Fine Coding"

"Fine Coding" is a philosophy. It's the pursuit of excellence in software development, encompassing not just functionality, but also elegance, maintainability, and user experience.

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler

## The Pillars of Fine Coding

1.  **Clarity:** Write clean, readable, and self-documenting code.
2.  **Efficiency:** Create performant solutions that respect user's time and resources.
3.  **Robustness:** Build resilient systems that handle errors gracefully.
4.  **Empathy:** Understand the end-user and build products that solve real problems.
`,
  },
];

export function getPosts(): Post[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
