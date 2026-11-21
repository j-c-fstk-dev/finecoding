import Link from 'next/link';
import { Github, Twitter, Instagram } from '@/components/icons/brands';
import { EmailSignup } from '@/components/blog/EmailSignup';
import { SITE } from '@/lib/site';

const columns = [
  { title: 'Blog', links: [{ href: '/posts', label: 'Posts' }, { href: '/sitemap.xml', label: 'Sitemap' }] },
  { title: 'Explore', links: [{ href: '/resources', label: 'Resources' }, { href: '/radio', label: 'Radio' }, { href: '/about', label: 'About' }] },
];

const social = [
  { href: SITE.links.github, label: 'GitHub', Icon: Github },
  { href: SITE.links.x, label: 'X (Twitter)', Icon: Twitter },
  { href: SITE.links.instagram, label: 'Instagram', Icon: Instagram },
];

export function Footer() {
  return (
    <footer id="main-footer" className="w-full flex-shrink-0">
      <section id="newsletter" className="scroll-mt-20 px-4 py-24 text-center md:py-32">
        <h2 className="font-headline text-4xl font-[560] leading-[1.05] tracking-[-0.04em] text-foreground md:text-[56px]">
          Code with AI.
          <br />
          <span className="text-phosphor phosphor-glow">Understand</span> what you ship.
        </h2>
        <p className="mx-auto mb-8 mt-5 max-w-md text-[17px] text-muted-foreground">
          New posts about building real things with AI, straight to your inbox.
        </p>
        <EmailSignup />
      </section>

      <div className="border-t">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr] lg:px-10">
          <div>
            <Link href="/" className="font-mono text-[15px] font-medium text-foreground">
              <span className="text-phosphor">&lt;/&gt;</span> fine_coding
            </Link>
            <p className="mt-3 font-mono text-xs text-muted-foreground/80">Built with Next.js, Firebase &amp; a lot of commits.</p>
            <a href={SITE.links.beregen} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-mono text-xs text-muted-foreground/80 transition-colors hover:text-foreground">
              Powered by BeRegen®
            </a>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-[13px] font-medium text-foreground">{col.title}</h5>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href} className="mb-3 block text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
          <div>
            <h5 className="mb-4 text-[13px] font-medium text-foreground">Connect</h5>
            {social.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="mb-3 flex items-center gap-2 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
                <Icon size={15} /> {label}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-4 pb-10 font-mono text-xs text-muted-foreground/60 sm:px-6 lg:px-10">
          © {new Date().getFullYear()} {SITE.author}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
