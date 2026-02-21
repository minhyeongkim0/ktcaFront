/**
 * Maps dummyData capacity strings to i18n keys and params so capacity
 * (e.g. "월 45,000장(wafer)") is shown in the current language.
 */
export type TCapacity = (key: string, params?: Record<string, string>) => string;

export function formatCapacity(capacity: string | undefined, t: TCapacity): string {
  if (!capacity || capacity === "-" || capacity === "—") return capacity;
  const wafer = capacity.match(/월\s*([\d,]+)장\(wafer\)/);
  if (wafer) return t("context.capacityWafer", { count: wafer[1] });
  const module = capacity.match(/월\s*([\d,]+)EA\(모듈\)/);
  if (module) return t("context.capacityModule", { count: module[1] });
  const pkg = capacity.match(/월\s*([\d,]+)EA\(패키지 기준\)/);
  if (pkg) return t("context.capacityPackage", { count: pkg[1] });
  return capacity;
}
