# Fine Coding — Writing Style Guide

The voice of this blog in one line: **a builder telling other builders what actually happened.**
Not a textbook, not a press release, not a motivational speech.

Use this guide for every new post and every rewrite. When in doubt, read the post
out loud: if it sounds like something you'd never say to a friend over coffee, rewrite it.

---

## 1. Voice

- **First person, singular.** "I", not "we" or "our team". It's one person's blog.
- **Talk to one reader.** "You", like a message to a friend who codes.
- **Plain words.** Prefer "use" to "leverage", "help" to "empower", "important" to "paramount".
- **Opinions are allowed.** Say what you think and why. "I don't use X anymore because…" beats
  "X has pros and cons".
- **Admit mistakes.** The bugs, wrong turns and things you didn't understand are the most
  valuable part of the post. They're also the part nobody else can write.

## 2. Every post needs at least one thing only you could write

Before publishing, point to it. One of:

- something that happened to you (a bug, a decision, a failure, a small win);
- real code, a real prompt, a real screenshot or a real number from your projects;
- an opinion you'd defend in a discussion.

If a post has none of these, it's a summary of the internet. Don't publish it yet.

## 3. Structure

1. **Hook (1–3 sentences):** start with the situation, the problem or the surprising fact.
   Never with a greeting.
2. **Context:** what you were trying to do and why it matters.
3. **The meat:** what you did, with real examples. Code blocks, before/after, commands.
4. **What you learned:** short, specific, honest. Include what you'd do differently.
5. **Ending:** a question to the reader, or a link to the next step. One line is enough.

Length: 500–1,200 words. Shorter and true beats longer and generic.

## 4. Things to cut (the "AI voice")

| Avoid | Why |
|---|---|
| "Hello, Fine Coders!" at the start of every post | Repetition makes everything feel templated. Use it rarely, if at all. |
| An emoji in every heading, ✅ bullet lists of benefits | Looks auto-generated; the reader skims and trusts less. |
| "In today's fast-paced world", "landscape", "delve", "crucial", "paramount", "seamless", "unlock", "harness", "elevate" | Filler words that sound like a model wrote them. |
| "Stay tuned!" | Link to the next post, or ask a question instead. |
| Promising posts you haven't written | Readers remember. Only announce what's drafted. |
| Lists of 4+ benefits with no example | Pick one, show it working. |
| Bold on half the sentences | Bold only the one thing you want remembered from a section. |
| Tool lists you haven't used | Only recommend what you actually use, and say how. |

## 5. Formatting

- Headings in sentence case: "What I'd do differently", not "What I'd Do Differently".
- Code blocks always have a language (` ```ts `, ` ```bash `).
- One idea per paragraph. Paragraphs of 1–4 sentences.
- Images: real screenshots over AI illustrations whenever possible. Alt text describes what's
  in the image, not the mood.
- Tags: 3–5, consistent across posts (`ai`, `nextjs`, `firebase`, `debugging`, `career`…).
  Avoid one-off tags like "Fine Coding Principles" vs "Fine Coding Practices".

## 6. How AI fits in the writing

AI is the **editor**, not the **author**:

1. Write the messy first draft yourself: bullet points, voice notes, Obsidian notes, whatever.
2. Ask AI to organize, cut, fix grammar and suggest a clearer structure.
3. Read the result and put back anything that stopped sounding like you.

## 7. Placeholders in drafts

Rewrites in `drafts/posts/` use this marker where only the author can fill in:

> ✍️ **YOUR STORY:** what to write here, with a guiding question.

Never invent a personal anecdote to fill one. Remove the marker once it's written,
or cut the paragraph if there's no real story for it.

## 8. Checklist before publishing

- [ ] The first sentence is not a greeting.
- [ ] There's at least one real example, story or opinion (section 2).
- [ ] No ✍️ placeholders left.
- [ ] Nothing from the "things to cut" table.
- [ ] Every technical claim is true for *this* project today.
- [ ] Code blocks run (or are clearly marked as simplified).
- [ ] Title says what the reader gets, in under ~60 characters if possible.
- [ ] Excerpt is one plain sentence (the card on the home page shows it).
