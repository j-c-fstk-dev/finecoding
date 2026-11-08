---
title: "The tools behind this blog, and what they cost me"
slug: "fine-coder-s-essential-tools-powering-workflow-with-ai-and-cloud"
excerpt: "No 'top 20 tools' list. Just what this blog actually runs on, what each piece does, and the monthly bill (zero)."
tags: ["tools", "firebase", "netlify", "ai"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_0000000030e46230bd6b86d6d58d07ac_g4dzh6.png"
---
![A dashboard of connected tool icons with green lines between them.](https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_0000000030e46230bd6b86d6d58d07ac_g4dzh6.png)

The first version of this post recommended Docker, Kubernetes, SonarQube, Cloudflare Workers and a dozen other tools. I didn't use most of them.

This version only lists what I actually used to build and run this blog. Total hosting cost so far: **$0 per month.**

## Building it

| Tool | What I used it for |
|---|---|
| **Firebase Studio** | The AI-powered editor where most of the first version was written, by describing features in plain language |
| **VS Code** | Editing and reviewing code locally |
| **GitHub** | Code history, pull requests and a small CI check that runs the TypeScript compiler on every change |

> ✍️ **YOUR STORY:** which AI assistant do you use day to day now, and for what? (Writing code, reviewing, explaining errors?) One honest sentence about what it's good and bad at is worth more than a feature list.

## Running it

| Tool | What it does | Cost |
|---|---|---|
| **Netlify** | Builds the site from GitHub and hosts it | Free tier |
| **Firebase Auth** | Admin login for the dashboard | Free tier |
| **Cloud Firestore** | Posts, comments, resources, subscribers | Free tier |
| **Cloudinary** | Post images | Free tier |
| **Resend** | Emails me when someone subscribes | Free tier |
| **Google AI Studio (Gemini)** | Suggests tags when I write a post | Free tier |

The free tiers are generous for a blog this size. The day it matters, Firestore reads and Netlify function time are the first things I'd watch.

## Automating around it

- **n8n** for automations that feed the blog, like adding new entries to the resource hub.
- **A backup script** (`npm run backup`) that exports every post as Markdown. Your content shouldn't live only inside someone else's database.

## What I'd tell you before picking tools

**Fewer tools, understood well, beat many tools used by default.** Every service above is one more dashboard, one more set of environment variables, one more thing that can break. When this blog stopped working, part of the problem was that it was configured to deploy to three different platforms at once: Netlify, GitHub Pages and Firebase App Hosting. Only one of them was actually being used.

**Free tiers are great, but read the limits.** Know what happens when you cross them: does the service stop, or does it start charging?

**Choose tools you can leave.** Firestore is easy to start with but proprietary. That's part of why I keep a Markdown backup of every post.

What's one tool you dropped and never missed? I'm always looking for things to remove.
