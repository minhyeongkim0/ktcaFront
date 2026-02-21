type Props = {
  className?: string;
  /** "responsive": 모바일↓ 데스크톱→, "right": 항상 →, "down": 항상 ↓ */
  direction?: "responsive" | "right" | "down";
};

export default function FlowArrow({ className, direction = "responsive" }: Props) {
  const iconClass = "text-slate-400 dark:text-slate-500 text-xl";
  return (
    <div
      className={[
        "flex items-center justify-center shrink-0 w-10",
        className ?? "",
      ].join(" ")}
      aria-hidden="true"
    >
      {direction === "right" && (
        <span className={`material-symbols-outlined ${iconClass}`}>arrow_forward</span>
      )}
      {direction === "down" && (
        <span className={`material-symbols-outlined ${iconClass}`}>arrow_downward</span>
      )}
      {direction === "responsive" && (
        <>
          <span className={`material-symbols-outlined ${iconClass} md:hidden`}>arrow_downward</span>
          <span className={`material-symbols-outlined ${iconClass} hidden md:block`}>arrow_forward</span>
        </>
      )}
    </div>
  );
}
