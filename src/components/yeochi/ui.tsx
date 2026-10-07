import { ButtonHTMLAttributes, ReactNode } from "react";

// Shared building blocks so every screen follows the same spacing, type and
// surface rules: hairline-bordered white cards on a warm off-white page, one
// solid primary action per screen, no glow shadows.

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className={`bg-card rounded-[20px] border border-border ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
  action,
}: {
  children: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between px-1 mb-3">
      <div>
        <h3 className="text-[17px] font-semibold tracking-[-0.02em]">{children}</h3>
        {hint && <p className="text-[13px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="text-[13px] text-muted-foreground">{children}</div>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function PrimaryButton({ children, className = "", ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`w-full h-[52px] rounded-[14px] bg-primary text-primary-foreground text-[15px] font-semibold active:scale-[0.98] transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={`w-full h-12 rounded-[14px] bg-surface text-foreground text-[14px] font-medium active:scale-[0.98] transition disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 h-9 px-4 rounded-full text-[14px] transition active:scale-95 border ${
        active
          ? "bg-foreground text-background border-foreground font-semibold"
          : "bg-card text-secondary-foreground border-border"
      }`}
    >
      {children}
    </button>
  );
}

export const inputClass =
  "w-full h-12 px-4 rounded-[14px] bg-surface text-[15px] placeholder:text-muted-foreground/70 border border-transparent focus:border-primary focus:bg-card focus:outline-none transition";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[13px] font-medium text-muted-foreground mb-1.5 px-0.5">
      {children}
    </label>
  );
}

export function Divider() {
  return <div className="h-px bg-border" />;
}
