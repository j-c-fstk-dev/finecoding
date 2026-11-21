import Link from 'next/link';
import type { Metadata } from 'next';
import { PostCover } from '@/components/blog/PostCover';
import { SITE } from '@/lib/site';

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
  },
};

const whoami = [
  ['name', SITE.author],
  ['role', 'freelance developer'],
  ['builds', 'web & native apps, automations, dApps'],
  ['stack', 'Next.js · Firebase · n8n · AI assistants'],
  ['status', 'writing again'],
];

const built = [
  'A task app with shared workspaces and cloud sync',
  'dApps that reward communities working in regenerative finance (ReFi)',
  'Websites for people and companies',
  'Lightweight Linux desktop setups with i3 for old, low-end PCs',
  'A clipboard manager',
  'Python game bots that use computer vision',
  'Productivity and family apps, web and native',
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-14 sm:px-6 md:pt-20 lg:px-10">
      <header className="text-center">
        <div className="mb-5 font-mono text-[13px] text-muted-foreground/80">
          ~/fine-coding/<span className="text-phosphor">about</span>
        </div>
        <h1 className="mx-auto max-w-[880px] font-headline text-4xl font-[590] leading-[1.05] tracking-[-0.035em] text-foreground md:text-[52px]">
          Notes from someone building real things with AI
        </h1>
      </header>

      <PostCover seed="about" motif="tree" className="mx-auto mb-14 mt-12 max-w-[880px] md:mt-14" />

      <div className="mx-auto max-w-[640px]">
        <div className="mb-12 overflow-hidden rounded-lg border bg-card font-mono text-[13.5px]">
          <div className="border-b px-4 py-2 text-xs text-muted-foreground/80">
            <span className="text-phosphor">$</span> whoami
          </div>
          <dl className="grid grid-cols-[88px_1fr] gap-y-2 px-4 py-4">
            {whoami.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-phosphor-dim">{k}</dt>
                <dd className="text-foreground/90">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="article-prose">
          <h2 id="why">Why this blog exists</h2>
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
            AI makes it easy to write code. Fine coding is understanding it well enough to keep it running.
          </blockquote>

          <h2 id="case-study">This blog is the first case study</h2>
          <p>
            I built this site with AI-assisted tools. It worked, then it didn&apos;t: posts disappeared,
            the dashboard stopped saving, and I got tired of fighting errors I didn&apos;t understand, so I
            walked away for a while. Coming back meant finding the real cause, fixing it properly and
            learning from it. That is the kind of story you&apos;ll find here.
          </p>

          <h2 id="built">Things I&apos;ve built</h2>
          <ul>
            {built.map((b) => <li key={b}>{b}</li>)}
          </ul>
          <p>
            Today I work as a freelancer, build tools for the audience of my social media profiles, and make
            apps that simply make my own life easier, like{' '}
            <a href="https://matrix-operator.netlify.app/" target="_blank" rel="noopener noreferrer">matrix-operator</a>,
            the retro-terminal workspace where I keep my tasks.
          </p>

          <h2 id="topics">What you&apos;ll find here</h2>
          <ul>
            <li><strong>Building with AI:</strong> practical workflows, prompts that actually help, and where AI-generated code tends to go wrong.</li>
            <li><strong>Automation &amp; no-code:</strong> n8n flows, integrations and the glue that connects tools together.</li>
            <li><strong>Web development:</strong> Next.js, Firebase and the details that matter once a project is live.</li>
            <li><strong>Lessons learned:</strong> post-mortems, refactors and the habits that keep side projects alive.</li>
          </ul>
          <p>
            Start with the <Link href="/posts">latest posts</Link>, or browse the{' '}
            <Link href="/resources">Resource Hub</Link> for the tools I use and recommend. If something here helps
            you, or you think I got it wrong, I&apos;d love to hear about it in the comments.
          </p>
        </div>
      </div>
    </div>
  );
}
