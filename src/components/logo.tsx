import { useId } from "react";
import { cn } from "@/lib/utils";

/** Stroke path of the mark: one continuous line tracing the "u-n" of "ungu". */
export const LOGO_PATH = "M14 20v14a9 9 0 0 0 18 0v-4a9 9 0 0 1 18 0v14";

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn("size-8 shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <path
        d={LOGO_PATH}
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="size-8 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="text-lg font-semibold tracking-tight">ungu</span>
    </span>
  );
}
