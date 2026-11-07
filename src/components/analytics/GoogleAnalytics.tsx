
'use client';

import Script from 'next/script';

export function GoogleAnalytics() {
  // Accept both names: Netlify was configured with NEXT_PUBLIC_GA_ID.
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;

  // Se o ID do Google Analytics não estiver definido, não renderize nada.
  if (!gaId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Google Analytics ID (NEXT_PUBLIC_GA_ID) is not set. Tracking is disabled.");
    }
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
