/**
 * Server Actions that throw lose their message in production (Next.js replaces
 * it with a generic "An error occurred in the Server Components render").
 * Admin actions therefore return a result object instead, so the dashboard can
 * show the real reason (wrong admin email, bad credentials, etc.).
 */
export type ActionResult<T = void> = { ok: true; data: T } | { ok: false; error: string };

export async function runAction<T>(name: string, fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    console.error(`[action:${name}]`, error);
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message || 'Unexpected error.' };
  }
}

/** Client-side helper: turns a failed ActionResult back into a thrown Error. */
export function unwrap<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new Error(result.error);
  return result.data;
}
