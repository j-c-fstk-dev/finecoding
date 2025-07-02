import { cn } from "@/lib/utils";

export const IconFC = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    <g>
      {/* This background circle remains a fixed color */}
      <circle cx="50" cy="50" r="50" fill="#1A1A1A"/>
      
      {/* These elements will now inherit color from Tailwind's text color utilities */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5"/>
      <path d="M28 25 V 75 H 38 V 57 H 48 V 47 H 38 V 35 H 52 V 25 H 28 Z" fill="currentColor" opacity="0.8" />
      <path d="M78 28 C 68 28, 58 36, 58 50 C 58 64, 68 72, 78 72 L 78 62 C 72 62, 68 57, 68 50 C 68 43, 72 38, 78 38 Z" fill="currentColor" />
      <path d="M72 42 L 65 50 L 72 58" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
      <path d="M62 58 L 75 42" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
    </g>
  </svg>
);
