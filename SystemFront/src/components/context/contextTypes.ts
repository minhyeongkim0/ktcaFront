import type { DummyData } from "@/data/dummyData";

export type ContextCompany = (DummyData["context"]["companies"])[number];

/** 더미 KPI: dummyData에 없을 때 View 내부에서 사용하는 고정/계산 값 */
export function getDummyKpi(company: ContextCompany | null): Record<string, string | number> {
  if (!company) return {};
  const leadTime = company.leadTimeDays != null ? `${company.leadTimeDays} days` : "N/A";
  return {
    "Last Audit Status": "PASS",
    "Quality Rating": "A+",
    "Avg. Defect Rate": "0.02%",
    "Avg. Lead Time": leadTime,
    "OTD": "94%",
    "Yield Rate": "99.2%",
  };
}

export function getCompanySummaryForExport(company: ContextCompany | null): Record<string, string> {
  if (!company) return {};
  const customers = Array.isArray(company.customers) ? company.customers.join(", ") : String(company.customers ?? "");
  const products = Array.isArray(company.products) ? company.products.join(", ") : String(company.products ?? "");
  return {
    "Company Name": company.companyName,
    "Type": company.type,
    "Founded": String(company.founded),
    "CEO": company.ceo,
    "Location": company.location,
    "Customers": customers,
    "Products": products,
    "Capacity": company.capacity ?? "-",
    "Lead Time (days)": company.leadTimeDays != null ? String(company.leadTimeDays) : "-",
  };
}
