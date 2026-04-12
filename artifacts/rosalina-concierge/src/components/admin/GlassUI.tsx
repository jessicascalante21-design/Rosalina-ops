import type { ReactNode } from "react";

export function GlassButton({ children, onClick, disabled, destructive, testId }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; destructive?: boolean; testId?: string;
}) {
  return (
    <button onClick={onClick} disabled={disabled} data-testid={testId}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all backdrop-blur-sm border disabled:opacity-30 disabled:cursor-not-allowed ${
        destructive ? "bg-red-500/10 border-red-300/20 text-red-300 hover:bg-red-500/20" : "bg-white/8 border-white/12 text-white/70 hover:bg-white/14 hover:text-white"
      }`}>{children}</button>
  );
}

export function GlassInput({ value, onChange, placeholder, className = "" }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className={`bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 w-full ${className}`}
    />
  );
}
