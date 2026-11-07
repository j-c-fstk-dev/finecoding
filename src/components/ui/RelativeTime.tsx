'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { formatShortDate } from '@/lib/dates';

/**
 * Shows "5 minutes ago". The relative text depends on the current time, which
 * differs between the server (or a cached page) and the browser, so the first
 * render uses a stable absolute date and switches to relative after mounting.
 */
export function RelativeTime({ date, className }: { date: Date | string | number; className?: string }) {
  const value = new Date(date);
  const [relative, setRelative] = useState<string | null>(null);

  useEffect(() => {
    setRelative(formatDistanceToNow(value, { addSuffix: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.getTime()]);

  return (
    <time dateTime={value.toISOString()} title={formatShortDate(value)} className={className}>
      {relative ?? formatShortDate(value)}
    </time>
  );
}
