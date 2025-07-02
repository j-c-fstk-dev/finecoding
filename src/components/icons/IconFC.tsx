import { cn } from "@/lib/utils";

export const IconFC = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 160 160"
    className={cn("h-8 w-8", className)}
    {...props}
  >
    <g stroke="currentColor" fill="none">
        <circle cx="80" cy="80" r="75" strokeWidth="3" />
        <circle cx="80" cy="80" r="71" strokeWidth="1" />

        {/* The F */}
        <g strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M45 40 v 80 M45 75 h 30" />
            <path d="M45 48 h -8" />
            <path d="M45 60 h -8" />
            <path d="M45 90 h -8" />
            <path d="M45 102 h -8" />
            <path d="M45 114 h -8" />

            <path d="M55 75 v -8" />
            <path d="M65 75 v -8" />
        </g>
        
        {/* The dots on F */}
        <g fill="currentColor">
            <circle cx="45" cy="40" r="2.5" />
            <circle cx="45" cy="75" r="2.5" />
            <circle cx="75" cy="75" r="2.5" />
            <circle cx="45" cy="120" r="2.5" />

            <circle cx="37" cy="48" r="1.5" />
            <circle cx="37" cy="60" r="1.5" />
            <circle cx="37" cy="90" r="1.5" />
            <circle cx="37" cy="102" r="1.5" />
            <circle cx="37" cy="114" r="1.5" />

            <circle cx="55" cy="67" r="1.5" />
            <circle cx="65" cy="67" r="1.5" />
        </g>

        {/* The C */}
        <path d="M125 45 A 35 35 90 0 0 125 115" strokeWidth="12" strokeLinecap="round" />
    </g>
    {/* The </> */}
    <text x="105" y="86" fontFamily="monospace" fontSize="20" fill="currentColor" fontWeight="bold">&lt;/&gt;</text>
  </svg>
);
