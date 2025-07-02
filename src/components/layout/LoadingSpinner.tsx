import { IconFC } from '@/components/icons/IconFC';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-primary">
      <IconFC className="h-16 w-16 animate-pulse-glow" />
    </div>
  );
}
