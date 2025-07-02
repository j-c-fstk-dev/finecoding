import { cn } from "@/lib/utils";

export const IconFC = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    <g>
      <circle cx="50" cy="50" r="50" fill="#1A1A1A"/>
      <circle cx="50" cy="50" r="48" fill="none" stroke="#6B7280" strokeWidth="3"/>
      
      <path d="M28 25 V 75 H 38 V 57 H 48 V 47 H 38 V 35 H 52 V 25 H 28 Z" fill="#9CA3AF" />

      <path d="M78 28 C 68 28, 58 36, 58 50 C 58 64, 68 72, 78 72 L 78 62 C 72 62, 68 57, 68 50 C 68 43, 72 38, 78 38 Z" fill="#2C6E49" />

      <path d="M72 42 L 65 50 L 72 58" stroke="#9CA3AF" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M62 58 L 75 42" stroke="#9CA3AF" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);
