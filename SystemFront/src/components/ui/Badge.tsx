type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "primary" | "amber";
  className?: string;
};

const variants = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  primary: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
