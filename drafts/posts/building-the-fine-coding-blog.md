---
title: "How I built this blog with AI, and what I got wrong about it"
slug: "building-the-fine-coding-blog-with-next-js-netlify-and-firebase-fast-secure-and-free"
excerpt: "Next.js, Firebase and Netlify, built with an AI assistant. The stack is still the same. My description of it wasn't."
tags: ["nextjs", "firebase", "netlify", "ai", "lessons-learned"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751203453/file_000000007744622fab2a22ae34c687d6_y77ccb.png"
---
![Fine Coding architecture: Next.js on Netlify talking to Firebase.](https://res.cloudinary.com/dr0weongo/image/upload/v1751203453/file_000000007744622fab2a22ae34c687d6_y77ccb.png)

*Updated in November 2026. The first version of this post described an architecture this blog never had. This one describes what's actually running.*

In June 2025 I wrote a post explaining how this blog was built. It said I used the Next.js Pages Router, pre-rendered everything as static HTML, and handled the dashboard with Firebase Functions.

None of that was true.

The blog used the App Router, rendered pages on a server, and there wasn't a single Firebase Function in the project. I wasn't lying on purpose. I built the site by describing what I wanted to an AI assistant (Firebase Studio), it wrote the code, and I wrote the post about what I *thought* it had built.

That gap between "what I asked for" and "what I got" is the whole reason this blog exists. So here's the honest version.

## The stack, for real

| Part | What it does |
|---|---|
| **Next.js (App Router)** | Pages, layouts and Server Actions, the functions the dashboard calls to save posts |
| **Firebase Auth** | Login for the admin dashboard. Only my account can publish |
| **Cloud Firestore** | Posts, comments, the resource hub and newsletter subscribers |
| **Netlify** | Builds and hosts the site. The free plan is enough |
| **Cloudinary** | Post images |
| **Genkit + Gemini** | Suggests tags when I write a post |
| **Resend** | Emails me when someone subscribes |

The goal from day one was **zero hosting cost**, and that part held up: everything above runs on free tiers for a blog this size.

## Where it went wrong

The site worked for a few weeks. Then, in July 2025, it started breaking in ways I couldn't follow. My commit history from that period is basically a conversation with the AI:

> "Nothing changed. Can you check before changing something, please?"

> "I don't know what else to do.. nothing works"

The dashboard showed `Missing or insufficient permissions` every time I tried to save a post. Sometimes, after a deploy, all my posts disappeared from the home page. I'd get them back, something else would break, and I'd ask the AI for another fix on top of the last one.

In August 2025 I stopped. Not because I'd lost interest in writing, but because I didn't trust the thing I'd built anymore.

## What was actually happening

When I came back to the project more than a year later, I stopped asking for quick patches and went through the code end to end, with an AI assistant explaining each part instead of just changing it. The main problem was a single wrong assumption:

```ts
'use server';

import { db } from '@/lib/firebase'; // the *browser* SDK

export async function addPost(post) {
  await addDoc(collection(db, 'posts'), post); // runs on the server
}
```

`'use server'` means this runs on Netlify's server, not in my browser. But it used the **browser** version of the Firebase SDK. On the server, nobody is logged in. So Firestore saw every save as an anonymous request, and my security rules (correctly) rejected it.

The fix was to use the Firebase **Admin** SDK on the server, and to check the logged-in user's token myself before writing anything:

```ts
'use server';

import { adminDb, requireAdmin } from '@/lib/firebase-admin';

export async function addPost(idToken: string, post: PostInput) {
  await requireAdmin(idToken); // is this really me?
  await adminDb().collection('posts').add(post);
}
```

The disappearing posts had a related cause: the home page was generated once, at build time. If Firestore failed during the build, the code caught the error, returned an empty list, and Netlify happily published a blog with zero posts. Now a failed read stops the build, and the last good version stays online.

## What I'd tell myself in June 2025

- **Read the code the AI writes, at least once.** Not every line. Just enough to describe it correctly. I couldn't, and it showed.
- **Know where your code runs.** Browser or server is the first question for every bug in a Next.js app.
- **Don't stack fixes.** When a fix doesn't work, undo it before asking for the next one. Otherwise you're debugging the fixes, not the bug.
- **An error that's swallowed is worse than one that crashes.** The empty home page was harder to understand than any error message.

> ✍️ **YOUR STORY:** one or two sentences on how it felt to come back to the project after a year. Did you consider starting over from scratch? What made you decide to fix it instead?

## What's next

I'm writing the full story of coming back to this project, including what broke and how each piece got fixed, as a series. If you're building something with AI right now and it's starting to feel fragile, I'd love to hear what you're running into. Leave a comment.
