"use client";

import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { slugifyHeading } from '@/lib/post-content';

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (node && typeof node === 'object' && 'props' in node) return textOf((node as { props: { children?: ReactNode } }).props.children);
  return '';
}

export function MarkdownRenderer({ content }: { content: string }) {
  // Code blocks are always dark "terminal windows" (see .screen in globals.css),
  // in both themes, so they never depend on the reader's theme.
  const codeTheme = oneDark;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => <h2 id={slugifyHeading(textOf(children))}>{children}</h2>,
        h3: ({ children }) => <h3 id={slugifyHeading(textOf(children))}>{children}</h3>,
        a: ({ href, children }) => {
          const external = href?.startsWith('http');
          return (
            <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              {children}
            </a>
          );
        },
        pre: ({ children }) => <>{children}</>,
        code({ className, children }) {
          const match = /language-([\w-]+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');
          const isBlock = Boolean(match) || code.includes('\n');
          if (!isBlock) return <code className="inline-code">{children}</code>;
          const language = match?.[1] ?? 'text';
          return (
            <div className="screen not-prose relative overflow-hidden rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-2 font-mono text-xs text-muted-foreground/80">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-phosphor-dim" />
                  <span className="h-2 w-2 rounded-full bg-input" />
                  <span className="h-2 w-2 rounded-full bg-input" />
                </span>
                <span className="text-phosphor-dim">{language}</span>
              </div>
              <SyntaxHighlighter
                style={codeTheme}
                language={language}
                PreTag="div"
                customStyle={{ margin: 0, padding: '16px 18px', background: 'transparent', fontSize: '14px', lineHeight: 1.6 }}
                codeTagProps={{ style: { fontFamily: '"JetBrains Mono", ui-monospace, monospace', background: 'transparent' } }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
