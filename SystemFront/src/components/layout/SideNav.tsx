type SideItem = { id: string; label: string };

type SideNavProps = {
  items: SideItem[];
  selected: string | null;
  onSelect: (id: string) => void;
};

export function SideNav({ items, selected, onSelect }: SideNavProps) {
  if (!items?.length) return null;

  return (
    <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-3">
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                selected === item.id
                  ? "bg-[#137fec]/10 text-[#137fec]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
