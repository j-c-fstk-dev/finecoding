---
title: "Thinking before typing: the part of the job AI doesn't do"
slug: "the-fine-coder-s-mindset-beyond-syntax-the-strategy-of-the-modern-developer"
excerpt: "AI made writing code cheap. Knowing what to build, and noticing when it's wrong, is still on us."
tags: ["ai", "career", "fine-coding", "debugging"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_00000000ea3061fb9c48006473d49daf_pcqduj.png"
---
![A stylized brain with green neural connections surrounded by lines of code.](https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_00000000ea3061fb9c48006473d49daf_pcqduj.png)

Writing code used to be the slow part. Now an assistant can write a full feature while I'm still reading the task.

So what's left for the developer? After a year of building with AI, my answer is: the thinking that happens before and after the code. Three habits in particular.

## 1. Ask "why" before "how"

AI is very good at *how*. Ask for a newsletter signup form and you'll get a clean, working form in seconds.

It won't ask you the questions that matter:

- Where do the emails go? Your own database, a newsletter service, both?
- What happens if someone subscribes twice?
- Who's allowed to see the list of subscribers?

On this blog, the subscribe form worked on the surface. Behind it, checking "is this email already subscribed?" required permissions that only the admin had, so every visitor's subscription failed. Nobody asked how a visitor's request would be allowed to read the list.

Before asking for code, I now write down in two or three lines what the feature is for and what could go wrong. It takes five minutes and changes the prompt completely.

## 2. Trust, but find out where it runs

My single most useful question when something breaks in a modern web app:

> **Does this code run in the browser or on the server?**

It sounds basic. It's the root cause of the biggest bug this blog ever had: server code using a browser library, so the database saw every request as coming from nobody.

AI-generated code often looks correct line by line and is wrong about *where* it is. Reading for context ("what environment is this in, what does it have access to?") catches things that reading for syntax never will.

> ✍️ **YOUR STORY:** what's a question you've learned to always ask, about AI code or code in general? Where did you learn it the hard way?

## 3. Break the problem down before handing it over

"Build me an admin dashboard" produces a lot of code that's hard to check.

"Build a page that lists posts from the `posts` collection, newest first, with an edit link for each one" produces a small piece you can actually verify, then you move to the next piece.

Small steps aren't slower. They're the difference between understanding what you shipped and hoping it works.

## What this means for a career

I don't think AI makes developers less necessary. I think it changes what we're paid for. Typing speed and memorized syntax matter less. These matter more:

- understanding the problem well enough to describe it precisely;
- knowing how systems fit together (browser, server, database, permissions);
- spotting when something that "works" is actually wrong.

None of those come from prompts. They come from building things, breaking them and figuring out why. Which is what this blog is for.

What's a skill you think matters *more* now that AI writes code? I'm curious whether we'd pick the same ones.
