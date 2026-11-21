---
title: "Fine Coding: using AI without handing it the keys"
slug: "unraveling-fine-coding"
excerpt: "There's a space between letting AI write everything and refusing to use it. That's where I want to build."
tags: ["ai", "fine-coding", "career"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751161181/file_0000000057246246b1cfd5b4e2cd868b_dxn5sr.png"
---
![Green code falling down a dark screen, Matrix-style.](https://res.cloudinary.com/dr0weongo/image/upload/v1751161181/file_0000000057246246b1cfd5b4e2cd868b_dxn5sr.png)

# Fine Coding: using AI without handing it the keys

AI can write a working login page in thirty seconds. It can also write one that lets anyone in, and it'll look exactly the same.

That's the problem I want to write about here.

The name came from frustration. When "vibecoding" took off, I watched a wave of people with no background in programming call themselves vibecoders, as if typing "build me an app" into a chat made them experts. Part of it was ego. Part of it was a sales pitch: the promise that one prompt is enough to ship a real product to production, sold to people who didn't know better. It wasn't true then, and it still isn't.

Meanwhile I was doing the opposite: researching before building, planning the structure of each project, and breaking the work into defined steps so the AI could help me deliver faster *and* safer, with far fewer bugs along the way. That way of working needed a name that wasn't more of the same. So I called it Fine Coding.

## Two ways to get it wrong

Right now I see developers falling into one of two camps.

**Vibecoding.** You describe what you want, the AI writes it, you run it, it seems to work, you ship it. You never really read the code. It's fast and it feels like magic, right up until something breaks and you have no idea where to start looking.

**Refusing AI.** You write everything by hand because that's how it's supposed to be done. Your code is solid and you understand every line. You're also spending hours on things a model could draft in seconds, while the people around you ship three times faster.

I don't think either one is the future. I've been closer to the first camp than I'd like to admit. This blog itself was built that way, and [it broke in ways I couldn't fix](/posts/building-the-fine-coding-blog-with-next-js-netlify-and-firebase-fast-secure-and-free) until I went back and understood it.

## What Fine Coding means to me

Fine Coding is using AI as much as it helps, **without giving up being the one who understands the system.**

In practice, that comes down to a few habits:

- **Let AI write the first draft, never the final one.** Boilerplate, config, tests, repetitive CRUD: great. But you read it before it goes in.
- **Be able to explain every piece you ship.** Not every line, but every piece. If you can't say what a function does and where it runs, it isn't done.
- **Treat security and data as human territory.** Auth, permissions, anything touching user data: that's where AI-generated code fails quietly, and where quiet failures hurt the most.
- **When something breaks, understand it before asking for a fix.** Stacking AI patches on top of each other is how a small bug becomes an abandoned project.

## What that looks like in code

Here's the kind of thing I mean. Ask an AI for a function that deletes a post, and you might get:

```ts
export async function deletePost(id: string) {
  await db.collection('posts').doc(id).delete();
}
```

It works. You click delete, the post is gone. Ship it?

The question a Fine Coder asks is: **who can call this?** In a Next.js app, a function like this can be a public endpoint. As written, anyone who finds it can delete any post. The fix is one line, but you only add it if you thought to ask:

```ts
export async function deletePost(idToken: string, id: string) {
  await requireAdmin(idToken); // only the blog owner gets past this line
  await db.collection('posts').doc(id).delete();
}
```

The AI didn't do anything wrong. It answered the question I asked. Fine Coding is about asking the next question.

## What you'll find here

I'm going to write about building real things with AI: what worked, what broke, and what I'd do differently. Less "10 tools you must try", more "here's the exact bug, here's what I learned".

I've used this approach on a bit of everything: a task app with shared workspaces and cloud sync, dApps that reward communities working in regenerative finance (ReFi), websites for people and companies, lightweight Linux desktop setups with i3 for old, low-end PCs, a clipboard manager, Python game bots that use computer vision, and productivity and family apps, both web and native. Today I work as a freelancer, build tools for the audience of my social media profiles, and make apps that simply make my own life easier. You'll see pieces of all of that here.

If you've ever shipped something you didn't fully understand (I have), I'd like to hear how it went. What's the AI-written bug that taught you the most?
