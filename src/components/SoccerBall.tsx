import { cn } from "@/lib/utils";

export function SoccerBall({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Bola de futebol"
    >
      <defs>
        <radialGradient id="ballGlow" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f5f5f0" />
          <stop offset="100%" stopColor="#9aa3c2" />
        </radialGradient>
        <radialGradient id="ballShade" cx="65%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="92" fill="url(#ballGlow)" />

      <g fill="#06080f">
        <polygon points="100,40 122,55 114,82 86,82 78,55" />
        <polygon points="48,72 70,55 78,82 62,108 38,98" />
        <polygon points="152,72 162,98 138,108 122,82 130,55" />
        <polygon points="100,150 78,138 86,112 114,112 122,138" />
        <polygon points="38,140 62,128 78,150 70,176 50,170" />
        <polygon points="162,140 150,170 130,176 122,150 138,128" />
      </g>

      <g stroke="#06080f" strokeWidth="1.6" fill="none" opacity="0.6">
        <path d="M100 40 L100 8" />
        <path d="M122 55 L150 38" />
        <path d="M78 55 L50 38" />
        <path d="M48 72 L20 70" />
        <path d="M152 72 L180 70" />
        <path d="M62 108 L40 130" />
        <path d="M138 108 L160 130" />
        <path d="M100 150 L100 182" />
        <path d="M50 170 L36 188" />
        <path d="M150 170 L164 188" />
      </g>

      <circle cx="100" cy="100" r="92" fill="url(#ballShade)" />
      <circle
        cx="100"
        cy="100"
        r="91.5"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
      />
    </svg>
  );
}
