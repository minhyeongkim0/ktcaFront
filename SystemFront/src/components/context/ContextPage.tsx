"use client";

import { getContextCompanyBySideKey } from "@/data/dummyData";
import { useLanguage } from "@/i18n/LanguageProvider";
import { CustomerView } from "./views/CustomerView";
import { HeadquartersView } from "./views/HeadquartersView";
import { SupplierView } from "./views/SupplierView";
import { RawMaterialView } from "./views/RawMaterialView";
import { SwotView } from "./views/SwotView";

export type ContextSideTab = "RawMaterials" | "Suppliers" | "Headquarters" | "Customers" | "Swot";

type ContextPageProps = {
  selectedSideTab: string | null;
};

/** Context 탭 전용 컨테이너: sideTab에 따라 해당 회사 데이터를 바인딩해 뷰 렌더 */
export function ContextPage({ selectedSideTab }: ContextPageProps) {
  const { t } = useLanguage();
  const company = getContextCompanyBySideKey(selectedSideTab);

  switch (selectedSideTab) {
    case "RawMaterials":
      return <RawMaterialView company={company} />;
    case "Suppliers":
      return <SupplierView company={company} />;
    case "Headquarters":
      return <HeadquartersView company={company} />;
    case "Customers":
      return <CustomerView company={company} />;
    case "Swot":
      return <SwotView />;
    default:
      return (
        <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-slate-200 bg-white p-8">
          <p className="text-slate-500">{t("sideMenu.selectFromContext")}</p>
        </div>
      );
  }
}
