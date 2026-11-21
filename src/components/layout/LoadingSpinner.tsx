import { LogoMark } from '@/components/icons/LogoMark';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <LogoMark glow className="h-16 w-16 animate-pulse" title="Loading" />
    </div>
  );
}
