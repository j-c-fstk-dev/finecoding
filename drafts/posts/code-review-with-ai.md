---
title: "Let AI review your code, but know what it can't see"
slug: "code-review-in-the-age-of-ai-how-to-use-ai-to-improve-code-quality"
excerpt: "The same kind of tool that wrote this blog's bugs also found them. The difference was the question I asked."
tags: ["ai", "code-review", "debugging", "code-quality"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751667267/file_00000000954461f992e8e606c8ab91ef_nrk69v.png"
---
![An AI icon overseeing lines of code, with highlighted issues.](https://res.cloudinary.com/dr0weongo/image/upload/v1751667267/file_00000000954461f992e8e606c8ab91ef_nrk69v.png)

# Let AI review your code, but know what it can't see

An AI assistant wrote most of this blog's first version. An AI assistant also found its worst bugs, a year later.

Same kind of tool, very different results. What changed was how I used it: the first time I asked it to *build*, the second time I asked it to *review*.

## What happened when I asked for a review

When I came back to this project, instead of asking "why doesn't saving posts work?", I asked for a full review of the project: what's broken, what's risky, what needs to be done. It found, among other things:

- functions marked `'use server'` that used the **browser** Firebase SDK, so every save reached the database as an anonymous request;
- database rules that let **any logged-in user** edit posts;
- a `catch` block that turned database errors into an empty list, which is why the home page sometimes went live with zero posts;
- `ignoreBuildErrors: true`, which let TypeScript errors deploy silently;
- an API key sitting in a commit message.

None of these were obscure. They're classic patterns, and AI is good at classic patterns *when you ask it to look for problems instead of asking it to make the current one go away*.

## What AI review is good at

- **Known risky patterns:** missing permission checks, swallowed errors, secrets in code, unsafe input handling.
- **Consistency:** "this function validates input, these three don't".
- **Explaining unfamiliar code:** great when you're reviewing something you didn't write, or wrote a year ago.

## What it can't see

- **Your intent.** It doesn't know the subscribe form is supposed to work for visitors, unless you tell it.
- **How things behave in production.** Environment variables, the hosting platform, real data. Several bugs on this blog only showed up after deploy.
- **Whether the feature should exist at all.** Review checks the code, not the decision.

That's the human part of review: does this do what we actually need, and does it fit the rest of the system?

## A review prompt that works

```text
Review this code as if you're about to approve it for production.
Don't fix anything yet. List problems, most severe first, in these areas:
1. Who can call this and who can access the data it touches?
2. Where does it run (browser/server) and is it using the right tools for that?
3. What happens when each external call fails?
4. Any secrets, hardcoded values or settings that hide errors?
For each problem: the file, the line, why it matters, and a one-line fix idea.
```

Two details matter: **"don't fix anything yet"** (you want a list you can judge, not a pile of changes), and **"most severe first"** (so the permission bug isn't buried under formatting nitpicks).

> ✍️ **YOUR STORY:** have you had code reviewed by another person, at work or in a community? What did they catch that you or an AI wouldn't have?

## My rule now

AI writes, AI reviews in a fresh conversation, and I make the final call on anything touching permissions, data or deploys. It's not slower. It's the part that keeps a side project from becoming an abandoned one.

Do you use AI for review yet? What's the best thing it ever caught for you?
