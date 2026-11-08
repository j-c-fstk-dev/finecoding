---
title: "Three rules I try to follow when coding with AI"
slug: "principles-of-fine-coding-clarity-efficiency-and-amplified-collaboration"
excerpt: "Say what you want, delegate the boring parts, and get a second opinion. Simple rules I learned by breaking them."
tags: ["ai", "fine-coding", "prompting"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751250980/file_0000000062746243a34f80f9ee1a5910_pijtu1.png"
---
![Three interlocked gears, one glowing with an AI symbol.](https://res.cloudinary.com/dr0weongo/image/upload/v1751250980/file_0000000062746243a34f80f9ee1a5910_pijtu1.png)

# Three rules I try to follow when coding with AI

When I first wrote about the principles of Fine Coding, I listed nine bullet points with an emoji each. Reading it again a year later, I couldn't tell you which ones I actually followed.

So here's the short version. Three rules. Each one comes from a mistake I made building this blog.

## 1. Say what you want, not just what's wrong

While building the share buttons for this blog, I spent an afternoon going back and forth with the AI. My messages looked like this:

> "It's working, but the links are wrong."

> "The links are still wrong."

The AI kept changing things, and I kept saying "still wrong". The problem wasn't the AI. I never told it what *right* looked like.

A better message would have been:

```text
The "Share on X" button on a post page should share the URL of that post,
e.g. https://finecoding.netlify.app/posts/my-post-slug.
Right now it shares the home page URL instead.
The button is in src/components/blog/ShareButtons.tsx.
```

Expected behavior, actual behavior, where to look. That's it. It takes 30 seconds longer to write and saves an afternoon.

## 2. Delegate the boring parts, keep the dangerous parts

AI is great at the work nobody wants to do: boilerplate, config files, form validation, converting data from one shape to another. Let it.

But some parts of a project fail silently when they're wrong, and you only find out when it's too late:

- **authentication and permissions** (who can do what);
- **anything that touches user data** (emails, passwords, payments);
- **error handling** (what happens when something fails).

On this blog, the AI-written code caught a database error, returned an empty list, and carried on. The result: every time the database hiccupped during a deploy, the site went live with zero posts and no error anywhere. The code "worked". It just worked in a way that hid the problem.

My rule now: AI can write those parts, but I read every line of them before they ship.

## 3. Get a second opinion, from a human or a different prompt

The AI that writes your code is not a good reviewer of that same code, at least not in the same conversation. It already "agrees" with itself.

What works better:

- start a **new conversation** and ask it to review the code, with no context about why it was written that way;
- ask specific questions: *"Who can call this function?"*, *"What happens if this request fails?"*, *"Where does this code run, browser or server?"*;
- when possible, show it to a person. Even a non-expert asking "what does this part do?" forces you to explain it.

That third question, browser or server, is the one that would have saved this blog months of being broken.

> ✍️ **YOUR STORY:** is there a rule of your own you'd add here? Something you do (or wish you did) every time you work with AI?

## The short version

1. Describe the expected result, not just the problem.
2. Let AI do the boring work; read every line of the dangerous work.
3. Review with fresh eyes: a new chat, a specific question, or another person.

Which of these do you break most often? For me it's the first one.
