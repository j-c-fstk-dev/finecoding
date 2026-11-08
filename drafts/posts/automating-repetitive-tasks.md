---
title: "What I automate with AI, and what I never will"
slug: "automating-repetitive-tasks-leveraging-ai-for-enhanced-developer-productivity"
excerpt: "AI is great at the boring 80%. The trick is knowing which 20% you shouldn't hand over."
tags: ["ai", "automation", "fine-coding"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751665965/file_00000000dea461fdbfcbd46337d72433_bwuarl.png"
---
![A robot arm interacting with code on a screen.](https://res.cloudinary.com/dr0weongo/image/upload/v1751665965/file_00000000dea461fdbfcbd46337d72433_bwuarl.png)

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

> ✍️ **YOUR STORY:** what's the n8n automation you're proudest of (or most annoyed by)? What does it do, and how much time does it save you? A concrete example here is worth more than the rest of this post.

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
