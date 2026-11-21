# Fine Coding: all 12 rewritten posts

For each post: in the dashboard, **edit** the existing post (don't create a new one), copy **Title**, **Excerpt** and **Tags** into their fields, and paste everything under **Content** into the content box.

---

## 1. Replaces: Unraveling Fine Coding

- **Title:** Fine Coding: using AI without handing it the keys
- **Excerpt:** There's a space between letting AI write everything and refusing to use it. That's where I want to build.
- **Tags:** ai, fine-coding, career
- **Slug (don't change):** `unraveling-fine-coding`

**Content:**

````markdown
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
````

---

## 2. Replaces: Building the Fine Coding Blog with Next.js, Netlify, and Firebase

- **Title:** How I built this blog with AI, and what I got wrong about it
- **Excerpt:** Next.js, Firebase and Netlify, built with an AI assistant. The stack is still the same. My description of it wasn't.
- **Tags:** nextjs, firebase, netlify, ai, lessons-learned
- **Slug (don't change):** `building-the-fine-coding-blog-with-next-js-netlify-and-firebase-fast-secure-and-free`

**Content:**

````markdown
![Fine Coding architecture: Next.js on Netlify talking to Firebase.](https://res.cloudinary.com/dr0weongo/image/upload/v1751203453/file_000000007744622fab2a22ae34c687d6_y77ccb.png)

# How I built this blog with AI, and what I got wrong about it

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

I always liked writing and sharing what I learn, and I was proud of how this blog turned out. But in the year after the bugs stopped me from posting, I had few chances to sit down and really build. When I started experimenting with Claude Code, I decided to give this project another chance: not to start over, but to restore it and make it better. Fixing it meant I could write again, and get better at my own work along the way.

## What's next

I'm writing the full story of coming back to this project, including what broke and how each piece got fixed, as a series. If you're building something with AI right now and it's starting to feel fragile, I'd love to hear what you're running into. Leave a comment.
````

---

## 3. Replaces: Principles of Fine Coding

- **Title:** Four rules I try to follow when coding with AI
- **Excerpt:** Say what you want, delegate the boring parts, get a second opinion and give the AI just enough freedom. Rules I learned by breaking them.
- **Tags:** ai, fine-coding, prompting
- **Slug (don't change):** `principles-of-fine-coding-clarity-efficiency-and-amplified-collaboration`

**Content:**

````markdown
![Three interlocked gears, one glowing with an AI symbol.](https://res.cloudinary.com/dr0weongo/image/upload/v1751250980/file_0000000062746243a34f80f9ee1a5910_pijtu1.png)

# Four rules I try to follow when coding with AI

When I first wrote about the principles of Fine Coding, I listed nine bullet points with an emoji each. Reading it again a year later, I couldn't tell you which ones I actually followed.

So here's the short version. Four rules. Each one comes from a mistake I made building this blog.

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

## 4. Give it just enough freedom

The last rule is about autonomy. Open-ended instructions ("do whatever you think is best") let the AI make decisions you never agreed to, unless you've already told it *how* to make that kind of choice. But there's a balance: make your instructions too rigid and it stops doing things that were obviously part of the job, just because you didn't spell them out.

What helps me find that balance is research before I prompt. I gather the how, the why and what it's for, so the AI has enough context to make good small decisions on its own, and clear limits on the big ones. And whatever it gives me, I never treat the result as final until I've checked it.

## The short version

1. Describe the expected result, not just the problem.
2. Let AI do the boring work; read every line of the dangerous work.
3. Review with fresh eyes: a new chat, a specific question, or another person.
4. Research first, then give the AI enough context to decide the small things, and clear limits on the big ones.

Which of these do you break most often? For me it's the first one.
````

---

## 4. Replaces: Fine Coding Guidelines

- **Title:** My checklist before shipping AI-written code
- **Excerpt:** Seven questions I go through before AI-generated code goes live. Every one of them comes from a real bug.
- **Tags:** ai, security, code-quality, fine-coding
- **Slug (don't change):** `fine-coding-guidelines-security-quality-and-continuous-learning`

**Content:**

````markdown
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
````

---

## 5. Replaces: Fine Coder's Essential Tools

- **Title:** The tools behind this blog, and what they cost me
- **Excerpt:** No 'top 20 tools' list. Just what this blog actually runs on, what each piece does, and the monthly bill (zero).
- **Tags:** tools, firebase, netlify, ai
- **Slug (don't change):** `fine-coder-s-essential-tools-powering-workflow-with-ai-and-cloud`

**Content:**

````markdown
![A dashboard of connected tool icons with green lines between them.](https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_0000000030e46230bd6b86d6d58d07ac_g4dzh6.png)

# The tools behind this blog, and what they cost me

The first version of this post recommended Docker, Kubernetes, SonarQube, Cloudflare Workers and a dozen other tools. I didn't use most of them.

This version only lists what I actually used to build and run this blog. Total hosting cost so far: **$0 per month.**

## Building it

| Tool | What I used it for |
|---|---|
| **Firebase Studio** | The AI-powered editor where most of the first version was written, by describing features in plain language |
| **Claude Code** | What I use most to write code today: it creates the project's folders and files and pushes straight to GitHub, with results good enough that I review instead of rewrite |
| **VS Code** | Editing projects locally, where I try different coding assistants for quick, surgical edits with well-defined commands |
| **GitHub** | Code history, pull requests and a small CI check that runs the TypeScript compiler on every change |

For everything around the code, I mix models on purpose. Gemini, Grok and DeepSeek for general research. Kimi and Z.ai for complex tasks: their free APIs are slower, but the results are good. ChatGPT sits in the middle for me; it's a bit generic, but useful when I'm exploring ideas. None of them is the best at everything, so I pick by task.

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
````

---

## 6. Replaces: The Git Ecosystem

- **Title:** Git is the undo button for AI-written code
- **Excerpt:** When an AI assistant changes ten files at once, Git is how you see what happened and how you go back. Plus what my own commit history taught me.
- **Tags:** git, github, ai, lessons-learned
- **Slug (don't change):** `the-git-ecosystem-version-control-collaboration-and-the-fine-coder-s-foundation`

**Content:**

````markdown
![A web of connected nodes with glowing green lines, representing Git's distributed history.](https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_0000000039c8622fbd3a9397bac867ef_oblbx2.png)

# Git is the undo button for AI-written code

When you code with AI, changes happen fast. You ask for one fix and the assistant edits six files. Something breaks two changes later and you're not sure which one did it.

That's when Git stops being "the thing you push to GitHub" and becomes the most important tool you have.

## Thirty seconds of history

Git was created in 2005 by Linus Torvalds, after the Linux kernel project lost free access to the version control tool it had been using. He built something fast and distributed: every copy of a repository has the full history, so nothing depends on a single server.

GitHub came in 2008 and made Git social: pull requests, issues, forks. Today it's hard to find a software job that doesn't assume you know both.

That's all the history you need. The interesting part is how they help when an AI is writing a lot of your code.

## How I use Git with AI now

**Commit before every AI change.** A clean commit is a save point. If the next suggestion makes things worse, you go back in one command instead of trying to undo it by hand:

```bash
git add -A && git commit -m "Working: share buttons"
# ...ask the AI for the next change...
git restore .   # didn't like it? throw away everything since the last commit
```

**Read the diff before accepting.** `git diff` shows exactly what the AI changed, including the files you didn't ask it to touch:

```bash
git diff --stat   # which files changed, and how much
git diff          # the actual lines
```

**Use a branch for experiments.** If you're about to let the AI attempt something big, do it on a branch. `main` stays working no matter what:

```bash
git switch -c try-new-search
```

**Bisect when you don't know what broke it.** If something worked last week and doesn't now, `git bisect` finds the exact commit that broke it by testing the history for you.

## What my own commit history taught me

I built the first version of this blog in Firebase Studio, and it used my prompts as commit messages. So my history reads like a diary of talking to an AI:

> "Nothing changed. Can you check before changing something, please?"

> "I don't know what else to do.. nothing works"

Two lessons from that:

1. **Commit messages are for future you.** "nothing works" tells me how I felt, not what changed. When I came back to this project a year later, those messages didn't help me find a single bug. A message like `Fix share links using the post URL instead of the home page` would have.
2. **Your history is public if your repo is.** One of those prompts included an API key, so the key ended up in a commit message on a public repository. Removing it from the history doesn't help once it's been public. The fix is to revoke the key and create a new one.

I learned Git by using it. After taking CS50, I went looking for a free Git course online and practiced on my own projects. It has saved me more times than I can count: being able to go back and forth between versions to track down a bug, and having a history that documents how a project came together. It matters even more when I'm working with other people.

## The short version

- Commit before every AI change, so you always have a way back.
- `git diff` before you accept anything.
- Experiments go on branches.
- Write commit messages that explain *what* changed, not how you felt.
- Never put secrets in prompts that might become commits.

What's your most useful Git command that nobody talks about?
````

---

## 7. Replaces: The Fine Coder's Mindset

- **Title:** Thinking before typing: the part of the job AI doesn't do
- **Excerpt:** AI made writing code cheap. Knowing what to build, and noticing when it's wrong, is still on us.
- **Tags:** ai, career, fine-coding, debugging
- **Slug (don't change):** `the-fine-coder-s-mindset-beyond-syntax-the-strategy-of-the-modern-developer`

**Content:**

````markdown
![A stylized brain with green neural connections surrounded by lines of code.](https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_00000000ea3061fb9c48006473d49daf_pcqduj.png)

# Thinking before typing: the part of the job AI doesn't do

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

My own version of this habit comes before any code at all: **has someone already solved this?** How did they do it, and which solutions worked best for this specific problem? Most problems aren't new. When the existing answers aren't good enough, that's when I start questioning the problem itself, looking for the gaps and the angle nobody tried.

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
````

---

## 8. Replaces: Advanced Prompt Engineering

- **Title:** How I write prompts for code now
- **Excerpt:** My prompts used to be 'still not working, fix it'. Here's the template I use now, and a real before and after.
- **Tags:** ai, prompting, debugging
- **Slug (don't change):** `advanced-prompt-engineering-mastering-communication-with-ai-for-the-fine-coder`

**Content:**

````markdown
![Human thoughts connecting to a neural network, with the words clarity, context and iteration floating around.](https://res.cloudinary.com/dr0weongo/image/upload/v1751655139/file_00000000c928620aa75b5e163d51a8fb_1_mctlle.png)

# How I write prompts for code now

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

Besides the template, there's one prompt I keep coming back to. Long before AI agents were a product, I put together a format that simulates a team of specialists inside a single chat: I describe an idea, and the model answers from several perspectives at once, like a small team brainstorming. It works surprisingly well even with models that can't run real agents.

For everyday work my habit is simpler: I state the final goal, add the details that matter, and ask for suggestions on how to get there, based on research into the best practices people already use for that specific problem.

## When to stop prompting

If you've sent three prompts about the same bug and it's not fixed, stop. Undo the changes (that's what Git is for), and either read the code yourself or start a fresh conversation with the full template. Long conversations full of failed fixes confuse the model as much as they confuse you.

What's the worst prompt you've ever sent? Mine is at the top of this post.
````

---

## 9. Replaces: Automating Repetitive Tasks

- **Title:** What I automate with AI, and what I never will
- **Excerpt:** AI is great at the boring 80%. The trick is knowing which 20% you shouldn't hand over.
- **Tags:** ai, automation, fine-coding
- **Slug (don't change):** `automating-repetitive-tasks-leveraging-ai-for-enhanced-developer-productivity`

**Content:**

````markdown
![A robot arm interacting with code on a screen.](https://res.cloudinary.com/dr0weongo/image/upload/v1751665965/file_00000000dea461fdbfcbd46337d72433_bwuarl.png)

# What I automate with AI, and what I never will

There's a version of this post that lists twenty things AI can automate for developers. You've read it. Probably several times.

This one is shorter. It's what I actually automate, and the line I've learned not to cross.

## What I happily hand over

**Small scripts I'd write once and forget.** This blog has a backup script that exports every post from the database as a Markdown file. I described what I wanted (read every post, write one `.md` file per post with title, date and tags at the top) and reviewed the result. Writing it by hand would have taken an hour of reading docs. Reviewing it took ten minutes.

```bash
npm run backup
# → backups/2026-11-06T23-46-08/posts/*.md + data.json
```

**Boilerplate and repetitive UI.** Form fields, table columns, loading states, the fifth card component that looks like the other four. Easy to check by looking at it.

**Converting things from one shape to another.** CSV to JSON, an API response to a TypeScript type, one date format to another. The output is easy to verify against the input.

**Workflows between tools.** I use n8n to connect services around the blog, like adding new entries to the resource hub. AI helps me write the small bits of code inside those workflows.

I don't have a favorite automation; it really depends on the context. What bothers me isn't the automations themselves, it's where they run. I don't have much access to cloud servers right now, so most of my workflows run locally and depend on my machine being on. What I love is how n8n lets me build them visually, with simple logic I can still read months later.

## What I don't hand over (anymore)

**Permissions and security rules.** The rules that decide who can read or write data look simple and fail silently. An AI asked to "fix the permission error" will often make the rules more permissive, because that makes the error go away. That's the opposite of a fix.

**Error handling on things that matter.** "Catch the error and return an empty list" makes the red message disappear and hides the real problem. On this blog it meant deploys that silently published zero posts.

**Deploy and infrastructure config.** At one point this project was set up to deploy to three platforms at once, because each "fix" added another config file. Nobody asked whether the old ones were still needed.

**Anything I can't verify by looking at the output.** That's the real rule behind this list. If I can check the result in a few seconds (a CSV, a form, a script's output file), AI can write it. If being wrong is invisible until something breaks in production, I write it or review it line by line.

## A simple test before automating something

1. **How will I know if the output is wrong?** If the answer is "I won't, until a user complains", don't delegate it blindly.
2. **What's the worst case?** A broken button is fine. Deleted data or a leaked key is not.
3. **Will I run this again?** If yes, save the prompt next to the script, so next time you start from something that already worked.

What's one task you automated and later regretted? I'm collecting these.
````

---

## 10. Replaces: Code Review in the Age of AI

- **Title:** Let AI review your code, but know what it can't see
- **Excerpt:** The same kind of tool that wrote this blog's bugs also found them. The difference was the question I asked.
- **Tags:** ai, code-review, debugging, code-quality
- **Slug (don't change):** `code-review-in-the-age-of-ai-how-to-use-ai-to-improve-code-quality`

**Content:**

````markdown
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

When I work with other developers, the comment I get most isn't about logic. It's that my code comments switch between Portuguese and English. An AI reviewer doesn't care, because it understands both. But I usually work with English-speaking developers, and a Portuguese comment in the middle of a file is a real question mark for them. That's exactly the kind of thing a person catches and a model doesn't: who's going to read this code next.

## My rule now

AI writes, AI reviews in a fresh conversation, and I make the final call on anything touching permissions, data or deploys. It's not slower. It's the part that keeps a side project from becoming an abandoned one.

Do you use AI for review yet? What's the best thing it ever caught for you?
````

---

## 11. Replaces: Writing Better Documentation with AI Assistance

- **Title:** Write docs for future you (AI makes it almost painless)
- **Excerpt:** I came back to this project after a year and couldn't remember what was broken. The docs I wish I'd had, and how AI helps write them.
- **Tags:** documentation, ai, lessons-learned
- **Slug (don't change):** `writing-better-documentation-with-ai-assistance-clarity-consistency-and-speed`

**Content:**

````markdown
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

I keep ideas, drafts and docs in Obsidian (and Anytype), tasks in matrix-operator, and the up-to-date overview of each project in its README. What I always forget is the changelog. I try to keep one, but when it falls behind I rebuild it from the commit history, which is one more reason to write good commit messages.

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
````

---

## 12. Replaces: The Fine Coder's Guide to Staying Updated

- **Title:** Keeping up with AI without drowning in it
- **Excerpt:** In one year away, my framework jumped two major versions and my AI model was retired. How I try to stay current now, without reading everything.
- **Tags:** learning, ai, career
- **Slug (don't change):** `the-fine-coder-s-guide-to-staying-updated-with-the-latest-ai-and-development`

**Content:**

````markdown
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

My own setup is simple. I follow a few people on social media for tips and opportunities, and I have an email address used only for AI newsletters. Once a week, I ask an AI to read that inbox and write me a report of the news that matters. If something catches my attention, I go deep on that one thing. Everything else can wait.

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
````
