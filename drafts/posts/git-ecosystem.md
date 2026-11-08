---
title: "Git is the undo button for AI-written code"
slug: "the-git-ecosystem-version-control-collaboration-and-the-fine-coder-s-foundation"
excerpt: "When an AI assistant changes ten files at once, Git is how you see what happened and how you go back. Plus what my own commit history taught me."
tags: ["git", "github", "ai", "lessons-learned"]
imageUrl: "https://res.cloudinary.com/dr0weongo/image/upload/v1751331160/file_0000000039c8622fbd3a9397bac867ef_oblbx2.png"
---
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

> ✍️ **YOUR STORY:** how did you learn Git? Is there a moment where it saved you (or where not using it cost you)?

## The short version

- Commit before every AI change, so you always have a way back.
- `git diff` before you accept anything.
- Experiments go on branches.
- Write commit messages that explain *what* changed, not how you felt.
- Never put secrets in prompts that might become commits.

What's your most useful Git command that nobody talks about?
