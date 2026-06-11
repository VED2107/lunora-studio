import type React from "react";

// lucide-react removed brand icons; same 24x24 stroke style as the rest of the app
export default function InstagramIcon({ className, style, strokeWidth }: { className?: string; style?: React.CSSProperties; strokeWidth?: number }) {
  return (
    <svg
      className={className}
      style={style}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth ?? 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
