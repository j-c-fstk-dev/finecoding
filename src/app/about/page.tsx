import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Fine Coding is a hands-on blog about building real things with AI, code and no-code tools: what works, what breaks, and how to fix it.',
  openGraph: {
    title: 'About | Fine Coding',
    description: 'A hands-on blog about building real things with AI, code and no-code tools.',
  },
  twitter: {
    title: 'About | Fine Coding',
    description: 'A hands-on blog about building real things with AI, code and no-code tools.',
  }
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-primary">Fine Coding</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Notes from someone building real things with AI, code and no-code tools.
        </p>
      </section>

      <section className="mt-12 prose prose-lg dark:prose-invert max-w-none font-body">
        <Image
          src="https://res.cloudinary.com/dr0weongo/image/upload/v1751168647/file_00000000591c61f59c33352b1d8f37fd_ncuhov.png"
          alt="Fine Coding banner with a digital, Matrix-inspired look"
          width={800}
          height={400}
          className="rounded-lg object-cover aspect-[2/1]"
        />

        <h2>Why this blog exists</h2>
        <p>
          I like building things. Lately that means pairing with AI, wiring up automations in n8n,
          and shipping web apps with Next.js and Firebase, often faster than I fully understand them.
          That speed is exciting. It is also how projects quietly break.
        </p>
        <p>
          Fine Coding is where I slow down and write about it: what I built, the decisions behind it,
          the bugs that cost me days, and what I would do differently. Not polished success stories.
          Working notes from the middle of the process.
        </p>

        <blockquote>
          <p>
            AI makes it easy to write code. Fine coding is understanding it well enough to keep it running.
          </p>
        </blockquote>

        <h2>This blog is the first case study</h2>
        <p>
          I built this site with AI-assisted tools. It worked, then it didn&apos;t: posts disappeared,
          the dashboard stopped saving, and I got tired of fighting errors I didn&apos;t understand, so I
          walked away for a while. Coming back meant finding the real cause, fixing it properly and
          learning from it. That is the kind of story you&apos;ll find here.
        </p>

        <h2>What you&apos;ll find here</h2>
        <ul>
          <li><strong>Building with AI:</strong> practical workflows, prompts that actually help, and where AI-generated code tends to go wrong.</li>
          <li><strong>Automation &amp; no-code:</strong> n8n flows, integrations and the glue that connects tools together.</li>
          <li><strong>Web development:</strong> Next.js, Firebase and the details that matter once a project is live.</li>
          <li><strong>Lessons learned:</strong> post-mortems, refactors and the habits that keep side projects alive.</li>
        </ul>
        <p>
          Start with the <Link href="/posts">latest posts</Link>, or browse the{' '}
          <Link href="/resources">Resource Hub</Link> for the tools I use and recommend.
          If something here helps you, or you think I got it wrong, I&apos;d love to hear about it in the comments.
        </p>
      </section>
    </div>
  );
}
