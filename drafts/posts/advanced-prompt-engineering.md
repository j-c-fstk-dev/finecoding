---
title: "How I write prompts for code now"
slug: "advanced-prompt-engineering-mastering-communication-with-ai-for-the-fine-coder"
excerpt: "My prompts used to be 'still not working, fix it'. Here's the template I use now, and a real before and after."
tags: ["ai", "prompting", "debugging"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751655139/file_00000000c928620aa75b5e163d51a8fb_1_mctlle.png"
---
![Human thoughts connecting to a neural network, with the words clarity, context and iteration floating around.](https://res.cloudinary.com/dr0weongo/image/upload/v1751655139/file_00000000c928620aa75b5e163d51a8fb_1_mctlle.png)

Here's a real prompt I sent to an AI assistant while this blog was broken:

> "Nothing changed. Can you check before changing something, please?"

And another one, twelve days later:

> "I don't know what else to do.. nothing works"

Neither message gave the AI anything to work with. No error, no expected behavior, no file. It did what any assistant does with a vague request: it guessed, changed something, and I said "still not working" again.

Most "prompt engineering" advice is long. What actually changed my results fits in one template.

## The template

```text
Goal: what I'm trying to do, in one sentence.
Expected: what should happen.
Actual: what happens instead (paste the exact error).
Where: the file(s) and whether it runs in the browser or on the server.
Tried: what I already tried, so you don't suggest it again.
Constraint: what you must NOT change.
```

Not every prompt needs every line. For a bug, "Expected", "Actual" and "Where" do most of the work.

## A real before and after

**Before:**

> "I see an error when saving a post, please fix it."

**After:**

```text
Goal: save a new post from the admin dashboard.
Expected: the post is saved to Firestore and appears on the home page.
Actual: the toast shows "Missing or insufficient permissions".
Where: addPost() in src/lib/posts.ts, which has 'use server', so it runs
on the server. It imports `db` from src/lib/firebase.ts (Firebase web SDK).
Tried: logging in again, redeploying the Firestore rules.
Constraint: don't make the Firestore rules more permissive.
```

The second version almost answers itself: a server function using the web SDK has no logged-in user, so the rules reject it. The constraint matters too. Without it, the "easiest" fix an AI might suggest is opening up your database rules to everyone.

## Three habits that matter more than clever tricks

**Paste the real error.** Not "it gives an error". The exact text, including the file and line if there is one.

**Say what not to touch.** "Don't change the database rules", "don't add new dependencies", "keep the existing API". AI assistants take the shortest path, and the shortest path is often the one you don't want.

**Ask for an explanation before a fix.** "Explain why this happens before changing anything" turns the assistant from a patch machine into a teacher, and stops the cycle of stacking fixes on top of each other.

> ✍️ **YOUR STORY:** do you have a prompt you reuse all the time? Paste it here (with anything private removed). Readers love copying a real one.

## When to stop prompting

If you've sent three prompts about the same bug and it's not fixed, stop. Undo the changes (that's what Git is for), and either read the code yourself or start a fresh conversation with the full template. Long conversations full of failed fixes confuse the model as much as they confuse you.

What's the worst prompt you've ever sent? Mine is at the top of this post.
