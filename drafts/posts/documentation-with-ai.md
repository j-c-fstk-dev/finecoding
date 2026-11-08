---
title: "Write docs for future you (AI makes it almost painless)"
slug: "writing-better-documentation-with-ai-assistance-clarity-consistency-and-speed"
excerpt: "I came back to this project after a year and couldn't remember what was broken. The docs I wish I'd had, and how AI helps write them."
tags: ["documentation", "ai", "lessons-learned"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751679753/file_00000000381461f8a81cb6f8ac984057_mzs4mk.png"
---
![An AI assistant writing structured documentation on a screen.](https://res.cloudinary.com/dr0weongo/image/upload/v1751679753/file_00000000381461f8a81cb6f8ac984057_mzs4mk.png)

# Write docs for future you (AI makes it almost painless)

When I came back to this blog after more than a year away, my first thought was: there were some bugs along the way, and I don't even remember what they were anymore.

The code was there. The commit history was there. But nothing explained what state the project was in, what was broken, or how to run it. I had to rediscover all of it.

That's the case for documentation in one sentence: **the person who most needs your docs is you, in a year.**

## The docs that would have saved me

Not a wiki. Not a 40-page guide. Just three things:

**1. How to run it.** Every environment variable, where to get each value, and the commands. This project now has a `.env.example` that lists every variable with a comment:

```bash
# --- Who can use the dashboard (server only, REQUIRED) ---
# Comma-separated. The Firebase Auth email(s) of the blog owner.
ADMIN_EMAILS=
```

**2. How it's deployed.** Where it's hosted, what triggers a deploy, what to check when a deploy fails. Mine was configured for three platforms at once and I couldn't have told you which one was real.

**3. Known problems.** A short list of what's broken or fragile and why. Even "dashboard sometimes fails to save, haven't found out why" is better than nothing. It's where future you starts.

> ✍️ **YOUR STORY:** do you keep notes for your own projects (Obsidian, Notion, a README)? What do you always write down, and what do you always forget to?

## Where AI actually helps

**First drafts from code.** Give it the config files and ask: *"List every environment variable this project uses, where it's read, and whether it's required."* That's tedious to do by hand and easy for AI to do well, because the answer is in the code.

**Turning a debugging session into notes.** After fixing something, paste the conversation or the diff and ask: *"Summarize this as a 'known issue / cause / fix' note in five lines."* This is the highest-value doc you can write, and nobody writes it because by then you're tired.

**Explaining old code.** *"Explain what this file does and how it connects to the rest of the project"* on a file you wrote a year ago is a fast way back in.

## Where it doesn't

Here's the trap: **AI documents what the code is supposed to do, not what it does.**

The first version of my post about how this blog was built described an architecture it never had: Pages Router, Firebase Functions, fully static pages. It sounded right. It was written from what I *asked for*, not from what was actually running.

So I check every line of AI-written docs against reality: run the commands, open the files it mentions, confirm the variables exist. Wrong docs are worse than no docs, because you trust them.

## A five-minute habit

At the end of every work session on a side project, add three lines to a notes file:

```markdown
## 2026-11-07
- Did: moved the database calls to the Firebase Admin SDK
- Broken / unsure: dashboard returns 500 after the Next.js upgrade
- Next: check the server function logs on Netlify
```

That's it. Future you will open that file and know exactly where to start.

What's the most useful piece of documentation you ever wrote for yourself?
