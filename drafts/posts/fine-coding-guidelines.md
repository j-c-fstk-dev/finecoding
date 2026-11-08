---
title: "My checklist before shipping AI-written code"
slug: "fine-coding-guidelines-security-quality-and-continuous-learning"
excerpt: "Seven questions I go through before AI-generated code goes live. Every one of them comes from a real bug."
tags: ["ai", "security", "code-quality", "fine-coding"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751252874/file_00000000a94061f88036e5c555267bd8_whc2cf.png"
---
![A magnifying glass over lines of code, with a shield and a seal of approval.](https://res.cloudinary.com/dr0weongo/image/upload/v1751252874/file_00000000a94061f88036e5c555267bd8_whc2cf.png)

# My checklist before shipping AI-written code

"Always review AI-generated code" is advice everyone agrees with and nobody can follow, because it doesn't say *what* to look for.

So here's my actual checklist. It's short on purpose. Each item exists because this blog had that exact problem at some point.

## The checklist

### 1. Who can run this?

In a Next.js app, a function marked `'use server'` becomes something any visitor can call, not just your own pages. If it deletes, edits or exports anything, it needs to check who's asking:

```ts
export async function deletePost(idToken: string, id: string) {
  await requireAdmin(idToken); // without this line, anyone can delete posts
  // ...
}
```

### 2. Who can read and write the data directly?

My first Firestore rules gave write access to *any logged-in user*. If sign-ups were enabled, anyone could create an account and edit my posts. Check your database rules as carefully as your code.

### 3. Where does this code run?

Browser or server? It changes which SDK you use, which secrets are available and who's "logged in". This was the main bug on this blog: server code using a browser library, so every save was rejected as anonymous.

### 4. What happens when it fails?

Look for every `catch`. If it logs the error and returns an empty value, ask whether that empty value will quietly end up on screen, or in production. Sometimes crashing loudly is the correct behavior.

### 5. Are errors being hidden from the build?

My `next.config.js` had this:

```js
typescript: { ignoreBuildErrors: true },
```

It meant TypeScript errors never stopped a deploy. AI tools sometimes add settings like this to make an error go away. Search your config for anything that says `ignore`.

### 6. Are there secrets in it?

API keys don't belong in code, and they also don't belong in **commit messages**. I once pasted an API key into a prompt, and the tool used my prompt as the commit message. My repository is public. If a key ever leaks, revoke it right away. Deleting it from the history isn't enough.

### 7. Can I explain it in two sentences?

Not every line, but every piece: what it does, where it runs, what it depends on. If I can't, I'm not done. I ask the AI to explain it to me until I can.

> ✍️ **YOUR STORY:** which item on this list would have saved you the most time on a past project? A sentence or two about it makes this post yours.

## What this list doesn't cover

This isn't a full security review, and it won't catch everything. It's the minimum that catches the mistakes AI tools make most often: missing permission checks, wrong environment, swallowed errors, leaked secrets.

Copy it, change it, make it yours. And if you have an item I should add, tell me in the comments.
