const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

// 1. GuidelineView - add onNavigate prop and ISO clause cards section
const gvPath = path.join(ROOT, "src/components/guideline/GuidelineView.tsx");
let gv = fs.readFileSync(gvPath, "utf8");

// Add interface and onNavigate prop
if (!gv.includes("GuidelineViewProps")) {
  gv = gv.replace(
    'export function GuidelineView() {',
    `interface GuidelineViewProps {
  onNavigate?: (url: string) => void;
}

export function GuidelineView({ onNavigate }: GuidelineViewProps = {}) {`
  );
}

// Add ISO clause cards section before Section 5
const isoSection = `
      {/* Section 4b: ISO Clause 4~10 화면 매핑 (해당 화면으로 이동) */}
      <SectionCard
        title="ISO Clause 4~10 대시보드 화면 매핑"
        icon={<span className="material-symbols-outlined text-[#137fec]">map</span>}
      >
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          각 조항에서 대시보드의 확인 위치와 바로 이동할 수 있습니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ISO_MAPPING.map((item) => (
            <div
              key={item.clause}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-900 hover:border-[#137fec]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    Clause {item.clause}: {item.titleKo}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {item.descriptionKo}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                    확인 위치: {item.locationKo}
                  </p>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate(buildIsoNavigationUrl(item.target));
                    }}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-[#0d6dd6]"
                  >
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                    해당 화면으로
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
`;

if (!gv.includes("ISO Clause 4~10 대시보드 화면 매핑")) {
  gv = gv.replace(
    "{/* Section 5: 사용 순서 */}",
    isoSection + "\n      {/* Section 5: 사용 순서 */}"
  );
}

fs.writeFileSync(gvPath, gv);

// 2. IsoGuideModal - add onNavigate and pass to GuidelineView
const modalPath = path.join(ROOT, "src/components/IsoGuideModal.tsx");
let modal = fs.readFileSync(modalPath, "utf8");

if (!modal.includes("onNavigate")) {
  modal = modal.replace(
    "interface IsoGuideModalProps {\n  open: boolean;\n  onClose: () => void;\n  children?: ReactNode;\n}",
    "interface IsoGuideModalProps {\n  open: boolean;\n  onClose: () => void;\n  onNavigate?: (url: string) => void;\n  children?: ReactNode;\n}"
  );
  modal = modal.replace(
    "export function IsoGuideModal({ open, onClose }: IsoGuideModalProps)",
    "export function IsoGuideModal({ open, onClose, onNavigate }: IsoGuideModalProps)"
  );
  modal = modal.replace(
    "<GuidelineView />",
    "<GuidelineView onNavigate={onNavigate} />"
  );
}
fs.writeFileSync(modalPath, modal);

// 3. Home page - pass onNavigate to IsoGuideModal
const homePath = path.join(ROOT, "app/page.tsx");
let home = fs.readFileSync(homePath, "utf8");

if (!home.includes("useRouter")) {
  home = home.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useRouter } from "next/navigation";');
}
if (!home.includes("useRouter()")) {
  home = home.replace("export default function Home() {", "export default function Home() {");
  home = home.replace(
    "const { t } = useLanguage();",
    "const { t } = useLanguage();\n  const router = useRouter();"
  );
}
if (!home.includes("onNavigate")) {
  home = home.replace(
    '<IsoGuideModal open={isoModalOpen} onClose={() => setIsoModalOpen(false)} />',
    '<IsoGuideModal open={isoModalOpen} onClose={() => setIsoModalOpen(false)} onNavigate={(url) => { setIsoModalOpen(false); router.push(url); }} />'
  );
}
fs.writeFileSync(homePath, home);

console.log("Applied GuidelineView, IsoGuideModal, Home changes.");
