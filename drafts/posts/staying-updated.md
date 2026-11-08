---
title: "Keeping up with AI without drowning in it"
slug: "the-fine-coder-s-guide-to-staying-updated-with-the-latest-ai-and-development"
excerpt: "In one year away, my framework jumped two major versions and my AI model was retired. How I try to stay current now, without reading everything."
tags: ["learning", "ai", "career"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751764348/file_00000000127c6230849d727c26dc2b38_ag7oqj.png"
---
![A compass pointing toward technology icons, with a magnifying glass over a changing landscape.](https://res.cloudinary.com/dr0weongo/image/upload/v1751764348/file_00000000127c6230849d727c26dc2b38_ag7oqj.png)

# Keeping up with AI without drowning in it

I stepped away from this blog for a bit over a year. When I came back:

- Next.js had gone from version 14 to 16, and the way pages receive their route parameters had changed.
- The AI plugin I used for tag suggestions had been deprecated, and replaced by a different package.
- My icon library had removed the GitHub, Twitter and Instagram icons.
- The Firebase Admin library now required a newer version of Node.js.

None of this was dramatic news. Nobody wrote "breaking: your blog will stop compiling". It was just a year of normal change, and it all landed at once.

That's what "staying updated" means to me now. Not following every AI announcement, but **not being surprised by changes to the things I actually use.**

## What I follow (and what I stopped following)

**Release notes of my own stack.** Next.js, Firebase, the AI SDK I use. A few minutes per release. This is the highest-value reading there is, and almost nobody does it.

**One or two communities, not twenty.** I joined NoCodeCrew, a community with a section for sharing projects. One place where people show what they built teaches more than ten news feeds.

> ✍️ **YOUR STORY:** which sources do you actually read? A newsletter, a YouTuber, a Discord, a person on X? Name two or three and why. Real recommendations from you are worth more than any generic list.

**What I stopped:** "Top 10 AI tools this week" posts, launch hype threads, and benchmark wars. They're fun, but they rarely change what I build on Monday.

## Learn by building something small

Reading about a new tool tells you what it claims. Building something tiny with it tells you what it's like. My rule: if something new looks relevant, I give it one evening and one small project. If it doesn't earn a second evening, I drop it without guilt.

This blog is that, too. Every time I come back to it, I learn what changed the hard way, and then I write about it here.

## Make your projects easier to update

A few things that would have made my "year later" upgrade much easier:

- **Use stable names where they exist.** I now ask for the `gemini-flash-latest` model instead of a specific version, so a retirement doesn't break the feature.
- **Remove what you don't use.** This project had 14 UI components that were never imported. Each one was one more thing to update.
- **Upgrade a little, often.** Small updates every couple of months are easy. Two years of updates at once is a project of its own.
- **Have a way to test.** Even a simple check that the site builds and the main pages load turns "I hope the upgrade worked" into "I know it did".

## The goal isn't to know everything

Nobody keeps up with all of AI right now. Not the experts, not the companies building it. The goal is smaller and more useful: know your tools well, notice when they change, and have a couple of trusted places to hear about what matters.

What's one source that's genuinely made you better at your work? I'm always looking for good ones.
