"use client";

import { Suspense, useState, useEffect, useRef, type ReactNode, type UIEvent } from "react";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PageShell from "@/src/components/common/PageShell";
import SectionCard from "@/src/components/common/SectionCard";
import TableauEmbed from "@/src/components/common/TableauEmbed";
import type { IsoMappingItem } from "@/src/components/common/IsoMappingBadge";

type ReportKpiRow = { label: string; value: string; valueNum?: number; targetNum?: number; higherIsBetter?: boolean; note: string };
const REPORT_KPI_ROWS: ReportKpiRow[] = [
  { label: "가동률", value: "94.2%", valueNum: 94.2, targetNum: 95, higherIsBetter: true, note: "목표 95%" },
  { label: "이상률", value: "1.2%", valueNum: 1.2, targetNum: 2, higherIsBetter: false, note: "목표 2% 이하" },
  { label: "MTBF", value: "72h", valueNum: 72, targetNum: 70, higherIsBetter: true, note: "목표 70h" },
  { label: "MTTR", value: "1.2h", valueNum: 1.2, targetNum: 1.5, higherIsBetter: false, note: "목표 1.5h 이하" },
  { label: "OEE", value: "78%", valueNum: 78, targetNum: 80, higherIsBetter: true, note: "목표 80%" },
  { label: "알람 건수", value: "12건", note: "미조치 3건" },
  { label: "조치 완료", value: "8건", note: "-" },
];
const OVERALL_PERFORMANCE = [
  { metric: "Accuracy", value: "91.2%", desc: "예측 정확도" },
  { metric: "F1-Score", value: "0.89", desc: "이상 탐지 F1" },
  { metric: "Precision", value: "88.5%", desc: "정밀도" },
  { metric: "Recall", value: "87.1%", desc: "재현율" },
];

function downloadReportHtml(title: string, periodLabel: string, filename: string) {
  const rowsHtml = REPORT_KPI_ROWS.map((r) => {
    let belowTarget = false;
    if (r.valueNum != null && r.targetNum != null && r.higherIsBetter != null) {
      belowTarget = r.higherIsBetter ? r.valueNum < r.targetNum : r.valueNum > r.targetNum;
    }
    const redClass = belowTarget ? " below-target" : "";
    return `<tr${redClass}><td>${r.label}</td><td>${r.value}</td><td>${r.note}</td></tr>`;
  }).join("\n");
  const perfRows = OVERALL_PERFORMANCE.map((p) => `<tr><td>${p.metric}</td><td>${p.value}</td><td>${p.desc}</td></tr>`).join("\n");
  const html = `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><title>${title}</title>
<style>
body{font-family:Malgun Gothic,sans-serif;padding:24px;max-width:800px;margin:0 auto}
h1{font-size:1.5rem;border-bottom:2px solid #137fec;padding-bottom:8px}
h2{font-size:1.1rem;margin-top:24px;margin-bottom:8px}
table{width:100%;border-collapse:collapse;margin-top:16px}
th,td{border:1px solid #ddd;padding:8px;text-align:left}
th{background:#f6f7f8}
.meta{color:#666;font-size:0.875rem;margin-bottom:16px}
.below-target{background:#fef2f2 !important;color:#dc2626 !important;font-weight:bold}
.below-target td{color:#dc2626}
</style>
</head>
<body>
<h1>${title}</h1>
<p class="meta">${periodLabel} · 생성일시: ${new Date().toLocaleString("ko-KR")}</p>

<h2>KPI 요약</h2>
<table>
<thead><tr><th>항목</th><th>값</th><th>비고</th></tr></thead>
<tbody>${rowsHtml}</tbody>
</table>

<h2>Overall Performance (예측·성능 지표)</h2>
<table>
<thead><tr><th>지표</th><th>값</th><th>설명</th></tr></thead>
<tbody>${perfRows}</tbody>
</table>

<p style="margin-top:24px;color:#888;font-size:0.75rem">통합 대시보드 · 설비보전(FDC) 보고서</p>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadReportCsv(periodLabel: string, filename: string) {
  const rows = [
    ["항목", "값", "비고"],
    ["가동률", "94.2%", "목표 95%"],
    ["이상률", "1.2%", "-"],
    ["MTBF", "72h", "목표 70h"],
    ["MTTR", "1.2h", "목표 1.5h"],
    ["알람 건수", "12건", "미조치 3건"],
    ["조치 완료", "8건", "-"],
  ];
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** 알람 탭 태블로 임베드 URL (나중에 변경 가능) — .env의 NEXT_PUBLIC_* 로도 설정 가능 */
const TABLEAU_ALARM_URLS = {
  alarmPareto: process.env.NEXT_PUBLIC_TABLEAU_ALARM_PARETO_URL ?? "",
  sensorCorr: process.env.NEXT_PUBLIC_TABLEAU_SENSOR_CORR_URL ?? "",
  /** 최근 알람 리스트 — 설정 시 테이블 대신 태블로 임베드 표시 */
  alarmList: process.env.NEXT_PUBLIC_TABLEAU_ALARM_LIST_URL ?? "",
};
/** 예측/진단 탭 — 핵심 피처 기여도는 태블로에서 보기 위해 비워둠 */
const TABLEAU_FEATURE_IMPORTANCE_URL = process.env.NEXT_PUBLIC_TABLEAU_FEATURE_IMPORTANCE_URL ?? "";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";
const LOG_BATCH_SIZE = 5;
const MAX_LOG_ROWS = 50;
const MAX_ALARM_ROWS = 20;

const FDC_TABS = [
  { id: "monitoring", label: "실시간 관제", icon: "monitoring" },
  { id: "alarms", label: "이상/알람", icon: "warning" },
  { id: "prediction", label: "예측/진단", icon: "psychology" },
  { id: "improvement", label: "개선/조치", icon: "build" },
  { id: "reports", label: "보고서", icon: "description" },
] as const;

const TAB_ISO_MAPPING: Record<string, IsoMappingItem[]> = {
  monitoring: [{ iso: "Operation", label: "운영" }],
  alarms: [{ iso: "Operation", label: "운영" }, { iso: "Performance", label: "성과평가" }],
  prediction: [
    { iso: "Planning", label: "기획" },
    { iso: "Operation", label: "운영" },
    { iso: "Performance", label: "성과평가" },
  ],
  improvement: [{ iso: "Improvement", label: "개선" }],
  reports: [{ iso: "Performance", label: "성과평가" }],
};

const TAB_DESCRIPTIONS: Record<string, string> = {
  monitoring: "실시간 설비 상태 및 센서 모니터링",
  alarms: "위험/경고 비율, 알람 리스트, 주요 원인 분석",
  prediction: "예측 결과(위험도), 모델 설명",
  improvement: "조치 이력, 효과성(전후 비교), 재발 방지 대책",
  reports: "월별·주간 설비보전 보고서 다운로드",
};

/* 알람·조치 연동 데이터 — occurredTime 기준 실시간 조치 지연 계산 */
type AlarmRow = {
  id: string;
  equipment: string;
  type: "AGV" | "OHT" | string;
  datetime: string;
  alarmEnd: string;
  state: number;
  delayMinutes: number;
  durationMinutes: number;
  level: string;
  message: string;
  failureType: string;
  actionStatus: string;
  status: string;
  sensors: Record<string, number | null>;
  actionAdvice: string;
};
type FailureHistoryItem = { date: string; failureType: string; description: string };
type ActionHistoryItem = { date: string; action: string };

// 조치 이력은 DB(corrective_logs)에서 동적으로 로드됩니다.

const SOP_BY_FAILURE_TYPE: Record<string, { title: string; steps: string[] }> = {
  "전류 임계": {
    title: "전류 임계 초과 시 표준 조치 절차(SOP)",
    steps: [
      "1. 해당 설비 즉시 감속 또는 정지 후 전원 확인",
      "2. 전류계·접점 상태 점검 및 과부하 원인 기록",
      "3. 부하 원인 제거 후 저부하로 재기동하여 확인",
      "4. 동일 재발 시 부품(접점/케이블) 교체 검토 및 조치 이력 연계",
    ],
  },
  "온도 이상": {
    title: "온도 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 설비 가동 중단 및 환기/냉각 상태 확인",
      "2. 온도 센서·냉각팬·필터 점검 및 이력 확인",
      "3. 원인 제거 후 서서히 재기동, 온도 추이 모니터링",
      "4. 재발 시 냉각 시스템 또는 부품 교체 및 재발 방지 대책 등록",
    ],
  },
  "진동": {
    title: "진동 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 설비 정지 후 육안·청각 점검(이물, 풀림, 마모)",
      "2. 베어링·커플링·볼트 체결 상태 점검 및 진동치 기록",
      "3. 이상 부품 교체 또는 조정 후 무부하→유부하 순차 시운전",
      "4. 조치 내용·재발 방지 대책을 조치 이력(개선/조치 탭)에 기록",
    ],
  },
  "온도": {
    title: "온도 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 설비 가동 중단 및 환기/냉각 상태 확인",
      "2. 온도 센서·냉각팬·필터 점검 및 이력 확인",
      "3. 원인 제거 후 서서히 재기동, 온도 추이 모니터링",
      "4. 재발 시 냉각 시스템 또는 부품 교체 및 재발 방지 대책 등록",
    ],
  },
  "센서": {
    title: "센서 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 해당 센서 신호값·배선·접촉 상태 점검",
      "2. 교정 가능 여부 확인 후 교정 또는 임시 우회 절차 적용",
      "3. 교정/교체 후 기준치 대비 검증 및 이력 기록",
      "4. 동일 유형 재발 시 설비/센서 교체 검토 및 개선/조치 탭에 재발 방지 대책 기록",
    ],
  },
};
const DEFAULT_SOP = { title: "기타 고장 유형 표준 조치 절차(SOP)", steps: ["1. 설비 안전 정지", "2. 현상 및 원인 기록", "3. 점검·조치 후 시운전", "4. 조치 이력 및 재발 방지 대책 등록(개선/조치 탭)"] };

function AlarmDetailModal({
  alarm,
  onClose,
  onGoToImprovement,
  failureHistory,
  actionHistory,
  sop,
}: {
  alarm: AlarmRow;
  onClose: () => void;
  onGoToImprovement: () => void;
  failureHistory: FailureHistoryItem[];
  actionHistory: ActionHistoryItem[];
  sop: { title: string; steps: string[] };
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="alarm-detail-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white dark:bg-[#182635] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-600"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-start justify-between gap-4">
          <div>
            <h2 id="alarm-detail-title" className="text-lg font-bold text-[#111418] dark:text-[#ededed]">알람 상세 · 해당 설비 이력</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{alarm.equipment} · {alarm.message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#111418] dark:text-[#ededed] mb-2">현재 알람</h3>
            <div className="rounded-lg border border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:bg-[#1e293b] text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-500 dark:text-gray-400">발생시간</span><span>{alarm.time}</span>
                <span className="text-gray-500 dark:text-gray-400">장비</span><span>{alarm.equipment}</span>
                <span className="text-gray-500 dark:text-gray-400">등급</span><span>{alarm.level}</span>
                <span className="text-gray-500 dark:text-gray-400">내용</span><span>{alarm.message}</span>
                <span className="text-gray-500 dark:text-gray-400">고장 유형</span><span>{alarm.failureType}</span>
                <span className="text-gray-500 dark:text-gray-400">조치 상태</span><span>{alarm.actionStatus}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111418] dark:text-[#ededed] mb-2">과거 고장 이력 ({alarm.equipment})</h3>
            {failureHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">과거 고장 이력이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1e293b]">
                      <th className="text-left py-2 px-3">일자</th>
                      <th className="text-left py-2 px-3">고장 유형</th>
                      <th className="text-left py-2 px-3">내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failureHistory.map((f, i) => (
                      <tr key={i} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 px-3">{f.date}</td>
                        <td className="py-2 px-3">{f.failureType}</td>
                        <td className="py-2 px-3">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111418] dark:text-[#ededed] mb-2">조치 내용 ({alarm.equipment})</h3>
            {actionHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">조치 이력이 없습니다.</p>
            ) : (
              <ul className="list-disc list-inside text-sm text-[#111418] dark:text-gray-200 space-y-1">
                {actionHistory.map((a, i) => (
                  <li key={i}><span className="text-gray-500 dark:text-gray-400">{a.date}</span> {a.action}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111418] dark:text-[#ededed] mb-2">가이드라인 (표준 조치 절차 SOP)</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{sop.title}</p>
            <ol className="list-decimal list-inside text-sm text-[#111418] dark:text-gray-200 space-y-1 rounded-lg border border-gray-200 dark:border-gray-600 p-3 bg-gray-50 dark:bg-[#1e293b]">
              {sop.steps.map((step, i) => (
                <li key={i}>{step.replace(/^\d+\.\s*/, "")}</li>
              ))}
            </ol>
          </div>
        </div>
        <div className="shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-2">
          <button
            type="button"
            onClick={onGoToImprovement}
            className="px-4 py-2 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors text-sm inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">build</span>
            개선/조치 탭에서 조치 이력 · 재발 방지 대책 입력
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg font-medium border border-gray-200 dark:border-gray-600 text-[#111418] dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors text-sm">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

type EquipmentTypeFilter = "AGV" | "OHT";

type RecentLog = {
  id: string;
  datetime: string;
  equipment: string;
  type: EquipmentTypeFilter;
  status: "정상" | "경고" | "고장" | string;
};

function matchEquipmentType(equipment: string, logType: string, type: EquipmentTypeFilter): boolean {
  if (logType === type) return true;
  const normalized = equipment.toUpperCase();
  return type === "AGV" ? normalized.startsWith("AGV") : normalized.startsWith("OHT");
}





function FdcPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "monitoring";
  const validTab = FDC_TABS.some((t) => t.id === tab) ? tab : "monitoring";
  const alarmId = searchParams.get("alarmId");
  const [equipmentType, setEquipmentType] = useState<EquipmentTypeFilter>("AGV");
  const [pendingDismissed, setPendingDismissed] = useState(false);
  const [recentAlarms, setRecentAlarms] = useState<AlarmRow[]>([]);
  const [alarmsLoading, setAlarmsLoading] = useState(true);
  const [alarmsError, setAlarmsError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setAlarmsLoading(true);
    setAlarmsError(null);
    fetch(`${API_URL}/alarms/recent?limit=${MAX_ALARM_ROWS}&equipment_type=${equipmentType}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("알람 API 응답이 정상이 아닙니다.");
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const normalized: AlarmRow[] = (Array.isArray(data?.alarms) ? data.alarms : []).map((alarm: any, idx: number) => {
          const normalizedType = alarm?.type === "OHT" ? "OHT" : "AGV";
          const delayMinutes = Number(alarm?.delayMinutes ?? alarm?.delay_minutes ?? 0);
          const durationMinutes = Number(alarm?.durationMinutes ?? alarm?.duration_minutes ?? 0);
          const state = Number(alarm?.state ?? 0);
          const level = alarm?.level ?? (state >= 3 ? "위험" : "경고");
          return {
            id: alarm?.id ?? `${normalizedType}-${alarm?.equipment ?? ""}-${idx}`,
            equipment: alarm?.equipment ?? "",
            type: normalizedType,
            datetime: alarm?.datetime ?? "",
            alarmEnd: alarm?.alarmEnd ?? "",
            state,
            delayMinutes,
            durationMinutes,
            level,
            message: alarm?.message ?? "",
            failureType: alarm?.failureType ?? "기타",
            actionStatus: alarm?.actionStatus ?? "대기",
            status: alarm?.status ?? "고장",
            actionAdvice: alarm?.actionAdvice ?? alarm?.message ?? "",
            sensors: alarm?.sensors ?? {},
          };
        });
        setRecentAlarms(normalized);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("최근 알람을 불러오지 못했습니다:", err);
        setAlarmsError("최근 알람을 불러오지 못했습니다.");
        setRecentAlarms([]);
      })
      .finally(() => {
        if (!cancelled) {
          setAlarmsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [equipmentType]);

  const filteredAlarms = recentAlarms.filter((a) => matchEquipmentType(a.equipment, a.type, equipmentType));
  const pendingList = filteredAlarms.filter((a) => a.actionStatus === "대기");
  const oldestPending = pendingList.length > 0
    ? [...pendingList].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0]
    : null;


  const delayLabel = isClient && oldestPending
    ? formatElapsed(Math.max(0, Math.floor((now - new Date(oldestPending.datetime).getTime()) / 60000)))
    : "계산 중";

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    params.delete("alarmId");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const clearAlarmIdFromUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("alarmId");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const equipmentFilterUI = (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">장비 유형 선택</span>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1e293b] p-0.5">
          {(["AGV", "OHT"] as const).map((value) => {
            const isActive = equipmentType === value;
            const isAGV = value === "AGV";
            const isOHT = value === "OHT";
            const accentColor = isAGV ? "bg-blue-500" : "bg-orange-500";
            return (
              <button
                key={value}
                type="button"
                onClick={() => setEquipmentType(value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white dark:bg-[#0f172a] text-[#111418] dark:text-[#ededed] shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-[#111418] dark:hover:text-[#e2e8f0]"
                }`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${accentColor} ${!isActive ? "opacity-50" : ""}`}
                  aria-hidden
                />
                {value}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2 text-right">
        {pendingList.length === 0 ? (
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">
            ✅ 모든 설비 정상 운행 중
          </span>
        ) : pendingDismissed ? null : (
          <>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0" aria-hidden />
            <span
              className={`text-sm font-semibold text-[#111418] dark:text-[#ededed] ${
                pendingList.length > 0 ? "animate-pulse" : ""
              }`}
            >
              정비 대기: {pendingList.length}건
            </span>
            {pendingList.length > 0 && (
              <span className="material-symbols-outlined text-red-500 text-lg" aria-hidden title="조치 대기">
                error
              </span>
            )}
            {oldestPending && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap ml-1">
                {oldestPending.equipment} (
                {delayLabel} 경과)
              </span>
            )}
            <button
              type="button"
              onClick={() => setPendingDismissed(true)}
              className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 hover:text-[#111418] dark:hover:text-[#ededed] transition-colors"
              aria-label="알림 숨기기"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <PageShell
      title="설비보전(FDC)"
      description="설비 예지보전 및 이상감지 대시보드"
      breadcrumb={[{ label: "설비보전", href: "/fdc" }]}
      isoMapping={TAB_ISO_MAPPING[validTab] ?? TAB_ISO_MAPPING.monitoring}
      isoNote="Annex SL 기준 매핑"
      aboveTabs={equipmentFilterUI}
      tabs={FDC_TABS.map((t) => ({ id: t.id, label: t.label, icon: t.icon }))}
      activeTab={validTab}
      onTabChange={setTab}
    >
      <FdcTabContent
        tab={validTab}
        alarmId={searchParams.get("alarmId")}
        equipmentType={equipmentType}
        onGoToImprovement={() => setTab("improvement")}
        onCloseAlarmModal={clearAlarmIdFromUrl}
      />
    </PageShell>
  );
}

export default function FdcPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-[#f6f7f8]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]" /></div>}>
      <FdcPageContent />
    </Suspense>
  );
}

const CAUSE_4M_OPTIONS = ["작업자", "설비", "재료", "공법"] as const;
type Cause4M = (typeof CAUSE_4M_OPTIONS)[number];

const FOUR_M_CHANGE_TYPES = [
  { value: "작업자변경", label: "작업자 변경" },
  { value: "자재변경",   label: "자재 변경" },
  { value: "방법변경",   label: "방법 변경" },
  { value: "설비기계변경", label: "설비/기계 변경" },
] as const;
type FourMChangeType = (typeof FOUR_M_CHANGE_TYPES)[number]["value"];

type FourMChangeLog = { id: number; change_type: FourMChangeType; content: string; created_at: string };

type CorrectiveLog = {
  id: number;
  device_id: string;
  device_type: "AGV" | "OHT" | string;
  description: string | null;
  technician: string | null;
  category: string | null;
  before_state: number | null;
  after_state: number | null;
  actioned_at: string | null;
  completed_at: string | null;
  created_at: string | null;
};

type PreventiveLog = {
  id: number;
  device_id: string;
  device_type: "AGV" | "OHT" | string;
  detected_at: string;
  description: string;
  predicted_state_before: number | null;
  predicted_state_after: number | null;
  result: "성공" | "실패" | null;
  technician: string;
  category: string;
  corrective_id: number | null;
  created_at: string;
};

function stateLabel(s: number | null) {
  if (s === null || s === undefined) return "—";
  const map: Record<number, string> = { 0: "정상", 1: "주의", 2: "경고", 3: "위험" };
  return map[s] ?? String(s);
}
function stateBadgeClass(s: number | null) {
  if (s === null || s === undefined) return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300";
  if (s === 0) return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
  if (s === 1) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
  if (s === 2) return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
  return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
}

function AddPreventiveModal({
  open,
  onClose,
  onAdd,
  equipmentType,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (log: PreventiveLog) => void;
  equipmentType: string;
}) {
  const [deviceId, setDeviceId]     = useState("");
  const [devType, setDevType]       = useState<"AGV" | "OHT">(equipmentType === "OHT" ? "OHT" : "AGV");
  const [detectedAt, setDetectedAt] = useState("");
  const [desc, setDesc]             = useState("");
  const [stateBefore, setStateBefore] = useState<string>("");
  const [stateAfter, setStateAfter]   = useState<string>("");
  const [result, setResult]         = useState<"성공" | "실패" | "">("");
  const [technician, setTechnician] = useState("");
  const [category, setCategory]     = useState("");
  const [saving, setSaving]         = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!deviceId.trim()) { alert("장비 ID를 입력하세요."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/preventive-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: deviceId.trim(),
          device_type: devType,
          detected_at: detectedAt || null,
          description: desc || null,
          predicted_state_before: stateBefore !== "" ? Number(stateBefore) : null,
          predicted_state_after: stateAfter !== "" ? Number(stateAfter) : null,
          result: result || null,
          technician: technician || null,
          category: category || null,
        }),
      });
      const data = await res.json();
      onAdd({
        id: data.id,
        device_id: deviceId.trim(),
        device_type: devType,
        detected_at: detectedAt,
        description: desc,
        predicted_state_before: stateBefore !== "" ? Number(stateBefore) : null,
        predicted_state_after: stateAfter !== "" ? Number(stateAfter) : null,
        result: result || null,
        technician,
        category,
        corrective_id: null,
        created_at: new Date().toLocaleString("ko-KR"),
      });
      onClose();
    } catch {
      alert("등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#182635] rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-gray-600">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111418] dark:text-[#ededed]">예방 이력 등록</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">장비 ID *</label>
              <input value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder="예: AGV-01" className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">장비 유형</label>
              <select value={devType} onChange={(e) => setDevType(e.target.value as "AGV" | "OHT")} className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm">
                <option value="AGV">AGV</option>
                <option value="OHT">OHT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">감지 시각</label>
            <input type="datetime-local" value={detectedAt} onChange={(e) => setDetectedAt(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">예방 내용</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="예방 조치 내용 입력" className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">개입 전 예측 state</label>
              <select value={stateBefore} onChange={(e) => setStateBefore(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm">
                <option value="">-</option>
                <option value="0">0 · 정상</option>
                <option value="1">1 · 주의</option>
                <option value="2">2 · 경고</option>
                <option value="3">3 · 위험</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">개입 후 예측 state</label>
              <select value={stateAfter} onChange={(e) => setStateAfter(e.target.value)} className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm">
                <option value="">-</option>
                <option value="0">0 · 정상</option>
                <option value="1">1 · 주의</option>
                <option value="2">2 · 경고</option>
                <option value="3">3 · 위험</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">결과</label>
              <select value={result} onChange={(e) => setResult(e.target.value as "성공" | "실패" | "")} className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm">
                <option value="">미정</option>
                <option value="성공">성공</option>
                <option value="실패">실패</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">부서</label>
              <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="예: 설비보전팀" className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">담당자</label>
            <input value={technician} onChange={(e) => setTechnician(e.target.value)} placeholder="담당자 이름" className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">취소</button>
          <button type="button" onClick={handleSubmit} disabled={saving} className="px-4 py-2 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-[#0d6bd6] transition-colors disabled:opacity-50">
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatElapsed(minutes: number): string {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}시간 ${m}분` : `${h}시간`;
}

function SafetyCheckModal({
  open,
  onClose,
  onConfirm,
  title = "안전 확인",
  children,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children?: ReactNode;
}) {
  const [ppeChecked, setPpeChecked] = useState(false);
  const [lotoChecked, setLotoChecked] = useState(false);
  const canConfirm = ppeChecked && lotoChecked;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm();
    setPpeChecked(false);
    setLotoChecked(false);
    onClose();
  };

  const handleClose = () => {
    setPpeChecked(false);
    setLotoChecked(false);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="safety-modal-title">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div
        className="relative bg-white dark:bg-[#182635] rounded-xl shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-600 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 id="safety-modal-title" className="text-lg font-bold text-[#111418] dark:text-[#ededed]">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">조치 저장 전 안전 확인이 필요합니다.</p>
        </div>
        <div className="p-6 space-y-4">
          {children}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={ppeChecked} onChange={(e) => setPpeChecked(e.target.checked)} className="rounded border-gray-300 text-[#137fec] focus:ring-[#137fec]" />
            <span className="text-sm font-medium text-[#111418] dark:text-[#ededed]">안전 보호구 착용 여부</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={lotoChecked} onChange={(e) => setLotoChecked(e.target.checked)} className="rounded border-gray-300 text-[#137fec] focus:ring-[#137fec]" />
            <span className="text-sm font-medium text-[#111418] dark:text-[#ededed]">전원 차단(LOTO) 확인</span>
          </label>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-2">
          <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg font-medium border border-gray-200 dark:border-gray-600 text-[#111418] dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors text-sm">
            취소
          </button>
          <button type="button" onClick={handleConfirm} disabled={!canConfirm} className="px-4 py-2 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

function AddActionModal({
  open,
  onClose,
  onAdd,
  equipmentType = "AGV",
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (log: CorrectiveLog) => void;
  equipmentType?: string;
}) {
  const todayDT = new Date().toISOString().slice(0, 16); // datetime-local format
  const [deviceId, setDeviceId]     = useState("");
  const [devType, setDevType]       = useState<"AGV" | "OHT">(equipmentType === "OHT" ? "OHT" : "AGV");
  const [desc, setDesc]             = useState("");
  const [technician, setTechnician] = useState("");
  const [category, setCategory]     = useState("");
  const [beforeState, setBeforeState] = useState<string>("");
  const [afterState, setAfterState]   = useState<string>("");
  const [actionedAt, setActionedAt] = useState(todayDT);
  const [completedAt, setCompletedAt] = useState("");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [sensorType, setSensorType] = useState("");
  const [actualBefore, setActualBefore] = useState<string>("");
  const [actualAfter, setActualAfter]   = useState<string>("");
  const [suspicious, setSuspicious] = useState(false); // 의심 수치 확인 여부

  const canSave = deviceId.trim().length > 0 && desc.trim().length > 0;

  // ── 가이드 목표치 룩업테이블 ──
  type GuideTarget = { target: number; unit: string; label: string };
  const GUIDE_TARGETS: Record<string, Record<string, GuideTarget>> = {
    AGV: {
      NTC:        { target: 40,    unit: "°C", label: "시스템 온도 (NTC)" },
      PM10:       { target: 40,    unit: "",   label: "미세먼지 PM10" },
      PM2_5:      { target: 27.13, unit: "",   label: "미세먼지 PM2.5" },
      CT1:        { target: 1.86,  unit: "A",  label: "전류 CT1" },
      CT2:        { target: 72.10, unit: "A",  label: "전류 CT2" },
      CT3:        { target: 49.91, unit: "A",  label: "전류 CT3" },
      CT4:        { target: 19.65, unit: "A",  label: "전류 CT4" },
      ir_temp_max:{ target: 50.4,  unit: "°C", label: "소자 온도 (ir_temp_max)" },
    },
    OHT: {
      NTC:        { target: 40, unit: "°C", label: "시스템 온도 (NTC)" },
      CT2:        { target: 2,  unit: "A",  label: "전류 CT2" },
      ir_temp_max:{ target: 40, unit: "°C", label: "소자 온도 (ir_temp_max)" },
    },
  };
  const sensorOptions = Object.keys(GUIDE_TARGETS[devType] ?? {});
  const guideTarget: GuideTarget | null = sensorType ? (GUIDE_TARGETS[devType]?.[sensorType] ?? null) : null;

  // ── 가이드 기준 수치 경고 ──
  const beforeNum = beforeState !== "" ? Number(beforeState) : null;
  const afterNum  = afterState  !== "" ? Number(afterState)  : null;
  const actualBeforeNum = actualBefore !== "" ? Number(actualBefore) : null;
  const actualAfterNum  = actualAfter  !== "" ? Number(actualAfter)  : null;
  const stateLabel: Record<number, string> = { 0: "정상", 1: "주의", 2: "경고", 3: "위험" };

  const guideWarnings: string[] = [];
  // 상태 레벨 기반 체크
  if (beforeNum !== null && afterNum !== null) {
    if (afterNum >= beforeNum && beforeNum >= 1) {
      guideWarnings.push(`조치 전(${stateLabel[beforeNum]}) → 조치 후(${stateLabel[afterNum]}) 상태가 개선되지 않았습니다.`);
    }
    if (afterNum >= 2) {
      guideWarnings.push(`조치 후에도 ${stateLabel[afterNum]} 상태입니다. 가이드 기준 수치를 재확인해 주세요.`);
    }
    if (beforeNum === 3 && afterNum === 0) {
      guideWarnings.push(`위험(3) → 정상(0) 한 번에 전환은 드문 경우입니다. 실제 수치와 다를 수 있으니 다시 확인해 주세요.`);
    }
  }
  // 실제 센서 수치 기반 체크
  if (guideTarget && actualAfterNum !== null) {
    if (actualAfterNum > guideTarget.target) {
      const diff = (actualAfterNum - guideTarget.target).toFixed(1);
      guideWarnings.push(
        `${guideTarget.label} 가이드 목표치(${guideTarget.target}${guideTarget.unit})보다 ` +
        `${diff}${guideTarget.unit} 높습니다. (입력값: ${actualAfterNum}${guideTarget.unit})`
      );
    }
  }
  if (guideTarget && actualBeforeNum !== null && actualAfterNum !== null && actualAfterNum >= actualBeforeNum) {
    guideWarnings.push(`실제 수치가 조치 전(${actualBeforeNum}) → 조치 후(${actualAfterNum})로 개선되지 않았습니다.`);
  }

  // ── 물리적으로 의심스러운 수치 (확인 버튼 필요) ──
  const isTempSensor = ["NTC", "ir_temp_max"].includes(sensorType);
  const suspiciousReasons: string[] = [];
  if (guideTarget && actualBeforeNum !== null && actualAfterNum !== null) {
    const drop = actualBeforeNum - actualAfterNum;
    // 30°C / 30A 이상 급감
    if (drop >= 30) {
      suspiciousReasons.push(
        `${drop.toFixed(1)}${guideTarget.unit} 급감 — 단시간에 발생하기 어려운 변화입니다.`
      );
    }
    // 온도 센서가 0°C 이하
    if (isTempSensor && actualAfterNum <= 0) {
      suspiciousReasons.push(
        `온도가 ${actualAfterNum}°C — 상온 이하로 내려가기 어렵습니다.`
      );
    }
    // 가이드 목표보다 50% 이상 낮음 (온도 0 제외)
    if (actualAfterNum > 0 && actualAfterNum < guideTarget.target * 0.5) {
      suspiciousReasons.push(
        `가이드 목표(${guideTarget.target}${guideTarget.unit})보다 훨씬 낮은 ` +
        `${actualAfterNum}${guideTarget.unit} — 수치를 다시 확인해 주세요.`
      );
    }
  }
  // state만 있을 때: 위험→정상 한번에 + 온도 0
  if (!sensorType && beforeNum === 3 && afterNum === 0) {
    suspiciousReasons.push("위험(3) → 정상(0) 한 번에 전환은 드문 경우입니다.");
  }
  const needsConfirm = suspiciousReasons.length > 0 && !suspicious;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      const body = {
        device_id: deviceId.trim(),
        device_type: devType,
        description: desc.trim(),
        technician: technician.trim() || null,
        category: category.trim() || null,
        before_state: beforeState !== "" ? Number(beforeState) : null,
        after_state: afterState !== "" ? Number(afterState) : null,
        actioned_at: actionedAt || null,
        completed_at: completedAt || null,
      };
      const res = await fetch(`${API_URL}/corrective-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("저장에 실패했습니다.");
      const data = await res.json();
      onAdd({
        id: data.id ?? Date.now(),
        ...body,
        created_at: new Date().toISOString(),
      } as CorrectiveLog);
      // reset
      setDeviceId(""); setDesc(""); setTechnician(""); setCategory("");
      setBeforeState(""); setAfterState(""); setActionedAt(todayDT); setCompletedAt("");
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  const inputCls = "w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#137fec]";
  const labelCls = "block text-sm font-medium text-[#111418] dark:text-[#ededed] mb-1";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-corrective-modal-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#182635] rounded-xl shadow-xl max-w-lg w-full border border-gray-200 dark:border-gray-600 overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
          <h2 id="add-corrective-modal-title" className="text-lg font-bold text-[#111418] dark:text-[#ededed]">조치 등록</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">조치 내용을 입력한 뒤 저장하세요.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>장비 ID *</label>
              <input type="text" value={deviceId} onChange={(e) => setDeviceId(e.target.value)} placeholder="예: AGV-01" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>장비 유형</label>
              <select value={devType} onChange={(e) => setDevType(e.target.value as "AGV" | "OHT")} className={inputCls}>
                <option value="AGV">AGV</option>
                <option value="OHT">OHT</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>조치 내용 *</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="조치 내용 입력" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>조치 전 상태</label>
              <select value={beforeState} onChange={(e) => setBeforeState(e.target.value)} className={inputCls}>
                <option value="">선택</option>
                <option value="0">정상</option>
                <option value="1">주의</option>
                <option value="2">경고</option>
                <option value="3">위험</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>조치 후 상태</label>
              <select value={afterState} onChange={(e) => setAfterState(e.target.value)} className={inputCls}>
                <option value="">선택</option>
                <option value="0">정상</option>
                <option value="1">주의</option>
                <option value="2">경고</option>
                <option value="3">위험</option>
              </select>
            </div>
          </div>
          {/* 실제 센서 수치 입력 */}
          <div>
            <label className={labelCls}>센서 유형 (가이드 비교용)</label>
            <select value={sensorType} onChange={(e) => { setSensorType(e.target.value); setActualBefore(""); setActualAfter(""); }} className={inputCls}>
              <option value="">선택 안 함</option>
              {sensorOptions.map((k) => (
                <option key={k} value={k}>{GUIDE_TARGETS[devType][k].label}</option>
              ))}
            </select>
          </div>
          {sensorType && guideTarget && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700 px-4 py-2.5">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                {devType} 가이드 목표: <span className="font-bold ml-1">{guideTarget.target}{guideTarget.unit} 이하</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>조치 전 실제 수치</label>
                  <div className="flex items-center gap-1">
                    <input type="number" step="0.1" value={actualBefore} onChange={(e) => { setActualBefore(e.target.value); setSuspicious(false); }} placeholder="예: 65" className={inputCls} />
                    <span className="text-xs text-gray-400 shrink-0">{guideTarget.unit}</span>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>조치 후 실제 수치</label>
                  <div className="flex items-center gap-1">
                    <input type="number" step="0.1" value={actualAfter} onChange={(e) => { setActualAfter(e.target.value); setSuspicious(false); }} placeholder={`목표: ${guideTarget.target}`} className={inputCls} />
                    <span className="text-xs text-gray-400 shrink-0">{guideTarget.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>담당자</label>
              <input type="text" value={technician} onChange={(e) => setTechnician(e.target.value)} placeholder="담당자명" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>부서</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="예: 설비보전팀" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>조치 일시</label>
              <input type="datetime-local" value={actionedAt} onChange={(e) => setActionedAt(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>완료 일시</label>
              <input type="datetime-local" value={completedAt} onChange={(e) => setCompletedAt(e.target.value)} className={inputCls} />
            </div>
          </div>
          {/* 일반 가이드 경고 (노란색) */}
          {guideWarnings.length > 0 && suspiciousReasons.length === 0 && (
            <div className="rounded-lg border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 space-y-1">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-sm">warning</span>
                가이드 기준과 차이가 있습니다 — 다시 한번 확인해 주세요
              </p>
              {guideWarnings.map((w, i) => (
                <p key={i} className="text-xs text-amber-700 dark:text-amber-300">• {w}</p>
              ))}
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 pt-1 border-t border-amber-200 dark:border-amber-700">
                실제 수치와 다를 수 있습니다. 조치 내용을 재확인한 후 등록해 주세요.
              </p>
            </div>
          )}

          {/* 물리적 의심 수치 경고 (주황색 + 확인 버튼) */}
          {suspiciousReasons.length > 0 && (
            <div className="rounded-lg border border-orange-400 dark:border-orange-500 bg-orange-50 dark:bg-orange-900/20 px-4 py-3 space-y-2">
              <p className="text-sm font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-base">gpp_maybe</span>
                수치를 제대로 확인하셨나요?
              </p>
              {suspiciousReasons.map((r, i) => (
                <p key={i} className="text-xs text-orange-700 dark:text-orange-300">• {r}</p>
              ))}
              <p className="text-xs text-orange-600 dark:text-orange-400 border-t border-orange-200 dark:border-orange-700 pt-2">
                실제 수치와 다를 수 있습니다. 장비를 직접 재확인한 후 등록해 주세요.
              </p>
              {!suspicious ? (
                <button
                  type="button"
                  onClick={() => setSuspicious(true)}
                  className="mt-1 w-full py-2 rounded-lg text-sm font-semibold border-2 border-orange-400 dark:border-orange-500 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors"
                >
                  수치를 직접 확인했습니다 — 그대로 등록
                </button>
              ) : (
                <p className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1 pt-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  확인 완료 — 저장 버튼을 눌러 등록하세요
                </p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg font-medium border border-gray-200 dark:border-gray-600 text-[#111418] dark:text-[#ededed] hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors text-sm">취소</button>
          <button type="button" onClick={handleSave} disabled={!canSave || saving || needsConfirm} className="px-4 py-2 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
            {saving ? "저장 중…" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FourMChangeSection() {
  const [logs, setLogs] = useState<FourMChangeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<FourMChangeType>("작업자변경");
  const [content, setContent] = useState("");

  const typeLabel = (v: string) => FOUR_M_CHANGE_TYPES.find((t) => t.value === v)?.label ?? v;

  // 오늘 데이터 fetch
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/four-m-changes`)
      .then((r) => r.json())
      .then((data) => setLogs(Array.isArray(data?.four_m_changes) ? data.four_m_changes : []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const addLog = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/four-m-changes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change_type: type, content: content.trim() }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const newLog: FourMChangeLog = {
        id: data.id,
        change_type: type,
        content: content.trim(),
        created_at: new Date().toLocaleString("ko-KR"),
      };
      setLogs((prev) => [newLog, ...prev]);
      setContent("");
    } catch {
      alert("등록에 실패했습니다. 백엔드 연결을 확인하세요.");
    } finally {
      setSaving(false);
    }
  };

  const removeLog = async (id: number) => {
    try {
      await fetch(`${API_URL}/four-m-changes/${id}`, { method: "DELETE" });
      setLogs((prev) => prev.filter((l) => l.id !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <SectionCard title="금일 공정 변경점" icon="swap_horiz">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">작업자 변경, 자재 변경, 방법 변경, 설비/기계 변경 사항을 등록합니다. 금일 등록 내역만 표시됩니다.</p>
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as FourMChangeType)}
          className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] px-3 py-2 text-sm min-w-[140px]"
        >
          {FOUR_M_CHANGE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addLog()}
          placeholder="변경 내용 입력"
          className="flex-1 min-w-[200px] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] px-3 py-2 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#137fec]"
        />
        <button
          type="button"
          onClick={addLog}
          disabled={!content.trim() || saving}
          className="px-4 py-2 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          {saving ? "등록 중…" : "등록"}
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-600">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#14213d]">
              <th className="text-left py-2 px-3 w-40">시간</th>
              <th className="text-left py-2 px-3 w-32">유형</th>
              <th className="text-left py-2 px-3">변경 내역</th>
              <th className="text-right py-2 px-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">불러오는 중…</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">금일 등록된 공정 변경점이 없습니다.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1e293b]">
                  <td className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{log.created_at}</td>
                  <td className="py-2 px-3">
                    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {typeLabel(log.change_type)}
                    </span>
                  </td>
                  <td className="py-2 px-3">{log.content}</td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeLog(log.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      aria-label="삭제"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function FdcTabContent({ tab, alarmId, equipmentType = "AGV", onGoToImprovement, onCloseAlarmModal }: { tab: string; alarmId?: string | null; equipmentType?: EquipmentTypeFilter; onGoToImprovement?: () => void; onCloseAlarmModal?: () => void }) {
  const isDark = useIsDark();
  const [recentLogs, setRecentLogs] = useState<RecentLog[]>([]);
  const [visibleLogCount, setVisibleLogCount] = useState(LOG_BATCH_SIZE);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isClient, setIsClient] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmRow | null>(null);
  const [recentAlarms, setRecentAlarms] = useState<AlarmRow[]>([]);
  const [alarmsLoading, setAlarmsLoading] = useState(true);
  const [alarmsError, setAlarmsError] = useState<string | null>(null);
  const [alarmDate, setAlarmDate] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setAlarmsLoading(true);
    setAlarmsError(null);
    const dateParam = alarmDate ? `&date=${alarmDate}` : "";
    fetch(`${API_URL}/alarms/recent?limit=${MAX_ALARM_ROWS}&equipment_type=${equipmentType}${dateParam}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("알람 API 응답이 정상이 아닙니다.");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const normalized: AlarmRow[] = (Array.isArray(data?.alarms) ? data.alarms : []).map((alarm: any, idx: number) => {
          const normalizedType = alarm?.type === "OHT" ? "OHT" : "AGV";
          const delayMinutes = Number(alarm?.delayMinutes ?? alarm?.delay_minutes ?? 0);
          const durationMinutes = Number(alarm?.durationMinutes ?? alarm?.duration_minutes ?? 0);
          const state = Number(alarm?.state ?? 0);
          const level = alarm?.level ?? (state >= 3 ? "위험" : "경고");
          return {
            id: alarm?.id ?? `${normalizedType}-${alarm?.equipment ?? ""}-${idx}`,
            equipment: alarm?.equipment ?? "",
            type: normalizedType,
            datetime: alarm?.datetime ?? "",
            alarmEnd: alarm?.alarmEnd ?? "",
            state,
            delayMinutes,
            durationMinutes,
            level,
            message: alarm?.message ?? "",
            failureType: alarm?.failureType ?? "기타",
            actionStatus: alarm?.actionStatus ?? "대기",
            status: alarm?.status ?? "고장",
            actionAdvice: alarm?.actionAdvice ?? alarm?.message ?? "",
            sensors: alarm?.sensors ?? {},
          };
        });
        setRecentAlarms(normalized);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("최근 알람을 불러오지 못했습니다:", err);
        setAlarmsError("최근 알람을 불러오지 못했습니다.");
        setRecentAlarms([]);
      })
      .finally(() => {
        if (!cancelled) setAlarmsLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [equipmentType, alarmDate]);

  const filteredLogs = recentLogs.filter((log) => matchEquipmentType(log.equipment, log.type, equipmentType));
  const filteredAlarms = recentAlarms.filter((a) => matchEquipmentType(a.equipment, a.type, equipmentType));
  // 최신이 아래, 위로 올릴수록 과거 — slice 후 reverse
  const visibleLogs = filteredLogs.slice(0, visibleLogCount).reverse();
  const canLoadMoreLogs = visibleLogCount < filteredLogs.length;

  const logContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  const handleLogScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (!canLoadMoreLogs) return;
    // 위로 스크롤해서 상단 근처에 도달하면 과거 로그 추가 로드
    if (target.scrollTop <= 40) {
      prevScrollHeightRef.current = target.scrollHeight;
      setVisibleLogCount((prev) => Math.min(prev + LOG_BATCH_SIZE, filteredLogs.length));
    }
  };

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setLogsLoading(true);
    setLogsError(null);
    fetch(`${API_URL}/logs/recent?limit=${MAX_LOG_ROWS}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error("API 응답이 정상이 아닙니다.");
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const normalizedLogs: RecentLog[] = (Array.isArray(data?.logs) ? data.logs : []).map((log, idx) => {
          const normalizedType = log?.type === "OHT" ? "OHT" : "AGV";
          return {
            id: log?.id ?? `${normalizedType}-${log?.equipment ?? ""}-${idx}`,
            datetime: log?.datetime ?? "",
            equipment: log?.equipment ?? "",
            type: normalizedType,
            status: log?.status ?? "정상",
          };
        });
        setRecentLogs(normalizedLogs);
        setVisibleLogCount(Math.min(LOG_BATCH_SIZE, normalizedLogs.length));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("최근 장비 로그를 불러오지 못했습니다:", err);
        setLogsError("최근 장비 로그를 불러오지 못했습니다.");
        setRecentLogs([]);
        setVisibleLogCount(0);
      })
      .finally(() => {
        if (!cancelled) {
          setLogsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setVisibleLogCount(Math.min(LOG_BATCH_SIZE, filteredLogs.length));
  }, [filteredLogs.length, equipmentType]);

  // 로그 추가 로드 후 스크롤 위치 복원 (위에서 내용이 추가되므로 scrollHeight 차만큼 보정)
  useEffect(() => {
    const container = logContainerRef.current;
    if (!container || prevScrollHeightRef.current === 0) return;
    const diff = container.scrollHeight - prevScrollHeightRef.current;
    container.scrollTop = diff;
    prevScrollHeightRef.current = 0;
  }, [visibleLogCount]);

  // 초기 로드 완료 시 맨 아래(최신)로 스크롤
  useEffect(() => {
    if (!logsLoading && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logsLoading]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (tab === "alarms" && alarmId) {
      const alarm = recentAlarms.find((a) => a.id === alarmId);
      if (alarm) setSelectedAlarm(alarm);
    }
  }, [tab, alarmId, recentAlarms]);
  const [correctiveLogs, setCorrectiveLogs] = useState<CorrectiveLog[]>([]);
  const [correctiveLoading, setCorrectiveLoading] = useState(false);
  const [correctiveError, setCorrectiveError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (tab !== "improvement") return;
    let cancelled = false;
    const controller = new AbortController();
    setCorrectiveLoading(true);
    setCorrectiveError(null);
    fetch(`${API_URL}/corrective-logs?device_type=${equipmentType}&limit=100`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("조치 이력 API 응답이 정상이 아닙니다.");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setCorrectiveLogs(Array.isArray(data?.corrective_logs) ? data.corrective_logs : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("조치 이력을 불러오지 못했습니다:", err);
        setCorrectiveError("조치 이력을 불러오지 못했습니다.");
        setCorrectiveLogs([]);
      })
      .finally(() => { if (!cancelled) setCorrectiveLoading(false); });
    return () => { cancelled = true; controller.abort(); };
  }, [tab, equipmentType]);

  const [preventiveLogs, setPreventiveLogs] = useState<PreventiveLog[]>([]);
  const [preventiveLogsLoading, setPreventiveLogsLoading] = useState(false);
  const [preventiveLogsError, setPreventiveLogsError] = useState<string | null>(null);
  const [showPreventiveModal, setShowPreventiveModal] = useState(false);

  useEffect(() => {
    if (tab !== "improvement") return;
    let cancelled = false;
    const controller = new AbortController();
    setPreventiveLogsLoading(true);
    setPreventiveLogsError(null);
    const typeParam = `?device_type=${equipmentType}`;
    fetch(`${API_URL}/preventive-logs${typeParam}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("예방 이력 API 응답이 정상이 아닙니다.");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPreventiveLogs(Array.isArray(data?.logs) ? data.logs : Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("예방 이력을 불러오지 못했습니다:", err);
        setPreventiveLogsError("예방 이력을 불러오지 못했습니다.");
        setPreventiveLogs([]);
      })
      .finally(() => {
        if (!cancelled) setPreventiveLogsLoading(false);
      });
    return () => { cancelled = true; controller.abort(); };
  }, [tab, equipmentType]);

  // ── 조치 가이드 ──
  const [guideData, setGuideData] = useState<Record<string, any> | null>(null);
  const [guideLoading, setGuideLoading] = useState(false);

  useEffect(() => {
    if (tab !== "improvement") return;
    setGuideLoading(true);
    fetch(`${API_URL}/maintenance-guide?device_type=${equipmentType}`)
      .then((r) => r.json())
      .then((data) => setGuideData(data.guide ?? null))
      .catch(() => setGuideData(null))
      .finally(() => setGuideLoading(false));
  }, [tab, equipmentType]);

  const tabContentClass = "w-full min-h-full flex flex-col items-stretch space-y-6";

  if (tab === "monitoring") {
    const monitoringTitle =
      equipmentType === "AGV" ? "AGV 상태 시계열 (센서값)" : "OHT 상태 시계열 (센서값)";
    const monitoringUrl =
      equipmentType === "AGV"
        ? "https://public.tableau.com/views/AGV_BI_state/AGV?:embed=true&:showVizHome=no&:language=ko-KR&:toolbar=yes&:tabs=no&:display_count=yes"
        : "https://public.tableau.com/views/OHT_BI_state/OHT?:embed=true&:showVizHome=no&:language=ko-KR&:toolbar=yes&:tabs=no&:display_count=yes";

    return (
      <div className={tabContentClass}>
        <SectionCard title={monitoringTitle} icon="show_chart">
          <TableauEmbed
            url={monitoringUrl}
            height={900}
            hideTabs
            hideToolbar={false}
            className="bg-gray-50 dark:bg-[#1e293b]"
          />
        </SectionCard>
        <SectionCard title="최근 장비 로그" icon="list">
          {/* 상단: 과거 로그 더 보기 표시 */}
          {canLoadMoreLogs && (
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {visibleLogs.length} / {filteredLogs.length}건 표시 중
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-base leading-none">arrow_upward</span>
                위로 스크롤하면 과거 로그 {filteredLogs.length - visibleLogs.length}건 더 보기
              </span>
            </div>
          )}
          <div
            ref={logContainerRef}
            className="h-[200px] overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-600"
            onScroll={handleLogScroll}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#14213d]">
                  <th className="text-left py-2 px-3">시간</th>
                  <th className="text-left py-2 px-3">장비</th>
                  <th className="text-left py-2 px-3">상태</th>
                </tr>
              </thead>
              <tbody>
                {logsLoading ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">
                      최근 장비 로그를 로드하는 중입니다.
                    </td>
                  </tr>
                ) : logsError ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-3 text-center text-red-500 dark:text-red-400">
                      {logsError}
                    </td>
                  </tr>
                ) : visibleLogs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">
                      {filteredLogs.length === 0 ? "해당 유형의 로그가 없습니다." : "더 과거의 로그를 불러오는 중입니다."}
                    </td>
                  </tr>
                ) : (
                  visibleLogs.map((log) => {
                    const colorClass =
                      log.status === "정상"
                        ? "bg-green-500"
                        : log.status === "경고"
                          ? "bg-amber-500"
                          : "bg-red-500";
                    return (
                      <tr key={log.id} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-2 px-3">{log.datetime}</td>
                        <td className="py-2 px-3">{log.equipment}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-block size-3 rounded-full shrink-0 mr-2 ${colorClass}`} title={log.status} aria-label={log.status} />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{log.status}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!canLoadMoreLogs && filteredLogs.length > 0 && (
            <div className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
              전체 {filteredLogs.length}건 모두 표시됨 · 최신 순 ↓
            </div>
          )}
        </SectionCard>

        <FourMChangeSection />
      </div>
    );
  }

  if (tab === "alarms") {
    const filteredAlarmList = filteredAlarms;
    const getDelayMinutes = (occurredTime: string) => Math.max(0, Math.floor((now - new Date(occurredTime).getTime()) / 60000));
    const levelClass = (level: string) =>
      level === "경고" ? "text-amber-600 dark:text-amber-400" : level === "해결" ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400";

    const alarmParetoTitle =
      equipmentType === "AGV" ? "AGV 이상 상태" : "OHT 이상 상태";
    const alarmParetoUrl =
      equipmentType === "AGV"
        ? "https://public.tableau.com/views/AGV_BI_risk/AGV_3?:embed=true&:showVizHome=no&:language=ko-KR&:toolbar=yes&:tabs=no&:display_count=yes"
        : "https://public.tableau.com/views/OHT_BI_risk/OHT_3?:embed=true&:showVizHome=no&:language=ko-KR&:toolbar=yes&:tabs=no&:display_count=yes";

    return (
      <div className={tabContentClass}>
        <SectionCard title={alarmParetoTitle} icon="bar_chart">
          <TableauEmbed
            url={alarmParetoUrl}
            height={900}
            hideTabs
            hideToolbar={false}
            placeholder="알람 파레토 분석 태블로 URL을 설정해 주세요."
            className="w-full"
          />
        </SectionCard>
        <SectionCard title="최근 알람 리스트" icon="list">
          {/* 날짜 선택 + 설명 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              지속시간 20분 이상 알람만 표시됩니다. 항목 클릭 시 상세 이력·SOP를 확인할 수 있습니다.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">날짜</label>
              <input
                type="date"
                value={alarmDate}
                onChange={(e) => setAlarmDate(e.target.value)}
                className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 bg-white dark:bg-[#182635] text-[#111418] dark:text-[#ededed] focus:outline-none focus:ring-2 focus:ring-[#137fec]"
              />
              {alarmDate && (
                <button
                  type="button"
                  onClick={() => setAlarmDate("")}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  aria-label="날짜 초기화"
                >
                  <span className="material-symbols-outlined text-base leading-none">close</span>
                </button>
              )}
            </div>
          </div>

          {TABLEAU_ALARM_URLS.alarmList ? (
            <TableauEmbed
              url={TABLEAU_ALARM_URLS.alarmList}
              height={420}
              hideToolbar
              hideTabs
              filterParams={{ EquipmentType: equipmentType }}
              placeholder="최근 알람 리스트 태블로 URL을 확인해 주세요."
              className="w-full"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#14213d]">
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">발생시간</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">종료시간</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">지속시간</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">장비</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">등급</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">내용</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">조치</th>
                  </tr>
                </thead>
                <tbody>
                  {alarmsLoading ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">
                        알람 데이터를 불러오는 중입니다…
                      </td>
                    </tr>
                  ) : alarmsError ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-3 text-center text-red-500 dark:text-red-400">
                        {alarmsError}
                      </td>
                    </tr>
                  ) : filteredAlarmList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-6 px-3 text-center text-gray-500 dark:text-gray-400">
                        {alarmDate ? `${alarmDate} 에 해당하는 알람 내역이 없습니다.` : "알람 내역이 없습니다."}
                      </td>
                    </tr>
                  ) : filteredAlarmList.map((a) => {
                    const dur = a.durationMinutes ?? 0;
                    const durLabel = dur >= 60
                      ? `${Math.floor(dur / 60)}시간 ${dur % 60}분`
                      : `${dur}분`;
                    const isLong = dur >= 60;
                    return (
                      <tr
                        key={a.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedAlarm(a)}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedAlarm(a)}
                        className="border-b border-gray-100 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors"
                      >
                        <td className="py-2 px-3 whitespace-nowrap">{a.datetime}</td>
                        <td className="py-2 px-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{a.alarmEnd || "—"}</td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${
                            isLong
                              ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-300 dark:border-red-700"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                          }`}>
                            {durLabel}
                          </span>
                        </td>
                        <td className="py-2 px-3">{a.equipment}</td>
                        <td className="py-2 px-3"><span className={`font-medium ${levelClass(a.level)}`}>{a.level}</span></td>
                        <td className="py-2 px-3">{a.message}</td>
                        <td className="py-2 px-3">{a.actionStatus}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {selectedAlarm && (
          <AlarmDetailModal
            alarm={selectedAlarm}
            onClose={() => { setSelectedAlarm(null); onCloseAlarmModal?.(); }}
            onGoToImprovement={() => { setSelectedAlarm(null); onCloseAlarmModal?.(); onGoToImprovement?.(); }}
            failureHistory={correctiveLogs
              .filter((l) => l.device_id === selectedAlarm.equipment)
              .map((l) => ({ date: l.actioned_at?.slice(0, 10) ?? "", failureType: l.category ?? "기타", description: l.description ?? "" }))}
            actionHistory={correctiveLogs
              .filter((l) => l.device_id === selectedAlarm.equipment)
              .map((l) => ({ date: l.actioned_at?.slice(0, 10) ?? "", action: l.description ?? "" }))}
            sop={SOP_BY_FAILURE_TYPE[selectedAlarm.failureType] ?? DEFAULT_SOP}
          />
        )}
      </div>
    );
  }

  if (tab === "prediction") {
    const featureImportanceTitle =
      equipmentType === "AGV" ? "AGV 데이터 분석 및 예측 모델 현황" : "OHT 데이터 분석 및 예측 모델 현황";
    const featureImportanceUrl =
      equipmentType === "AGV"
        ? "https://public.tableau.com/views/AGV_BI_data/sheet8?:embed=true&:showVizHome=no&:language=ko-KR&:toolbar=yes&:tabs=no&:display_count=yes"
        : "https://public.tableau.com/views/OHT_BI_data/sheet9?:embed=true&:showVizHome=no&:language=ko-KR&:toolbar=yes&:tabs=no&:display_count=yes";
    return (
      <div className={tabContentClass}>
        <SectionCard title={featureImportanceTitle} icon="bar_chart">
          <TableauEmbed
            url={featureImportanceUrl}
            height={900}
            hideTabs
            hideToolbar={false}
            placeholder="핵심 피처 기여도 태블로 URL을 설정해 주세요."
            className="w-full"
          />
        </SectionCard>
        <SectionCard title="모델 설명" icon="description">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            LSTM 기반 시계열 예측 모델. 센서 데이터(CT, 온도, PM 등)를 입력하여 7일 내 설비 이상 위험도를 산출합니다.
          </p>
        </SectionCard>
      </div>
    );
  }

  if (tab === "improvement") {
    const THREE_MONTH_MS = 90 * 24 * 60 * 60 * 1000;
    // DB 데이터로 타임라인 구성
    const timelineByDevice = correctiveLogs.reduce<Record<string, CorrectiveLog[]>>((acc, log) => {
      if (!acc[log.device_id]) acc[log.device_id] = [];
      acc[log.device_id].push(log);
      return acc;
    }, {});
    const isRecurringFromDB = (deviceId: string, category: string | null, actionedAt: string | null) => {
      if (!category || !actionedAt) return false;
      const items = (timelineByDevice[deviceId] ?? []).filter((l) => l.category === category);
      if (items.length < 2) return false;
      const thisTime = new Date(actionedAt).getTime();
      return items.some((l) => l.actioned_at !== actionedAt && Math.abs(new Date(l.actioned_at ?? "").getTime() - thisTime) <= THREE_MONTH_MS);
    };

    return (
      <div className={tabContentClass}>
        {/* ────── 조치 이력 ────── */}
        <SectionCard title="조치 이력" icon="history">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              DB에서 불러온 조치 이력입니다. 장비 유형 필터({equipmentType})가 적용됩니다.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors text-sm inline-flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-base">add</span>
              조치 등록
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#14213d]">
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">조치일시</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">완료일시</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">장비</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">유형</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400 min-w-[160px]">내용</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">조치 전</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">조치 후</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">담당자</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">부서</th>
                </tr>
              </thead>
              <tbody>
                {correctiveLoading ? (
                  <tr>
                    <td colSpan={9} className="py-8 px-3 text-center text-gray-500 dark:text-gray-400">
                      조치 이력을 불러오는 중입니다…
                    </td>
                  </tr>
                ) : correctiveError ? (
                  <tr>
                    <td colSpan={9} className="py-8 px-3 text-center text-red-500 dark:text-red-400">
                      {correctiveError}
                    </td>
                  </tr>
                ) : correctiveLogs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 px-3 text-center text-gray-500 dark:text-gray-400">
                      등록된 조치 이력이 없습니다.
                    </td>
                  </tr>
                ) : (
                  correctiveLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
                      <td className="py-2 px-3 whitespace-nowrap text-xs">{log.actioned_at ?? "—"}</td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{log.completed_at ?? "—"}</td>
                      <td className="py-2 px-3 font-medium">{log.device_id}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          log.device_type === "OHT"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}>{log.device_type}</span>
                      </td>
                      <td className="py-2 px-3 max-w-[200px] truncate" title={log.description ?? ""}>{log.description ?? "—"}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stateBadgeClass(log.before_state)}`}>
                          {stateLabel(log.before_state)}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stateBadgeClass(log.after_state)}`}>
                          {stateLabel(log.after_state)}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm">{log.technician ?? "—"}</td>
                      <td className="py-2 px-3 text-sm">{log.category ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AddActionModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            equipmentType={equipmentType}
            onAdd={(log) => {
              setCorrectiveLogs((prev) => [log, ...prev]);
              setShowAddModal(false);
            }}
          />
        </SectionCard>

        {/* ────── 예방 이력 ────── */}
        <SectionCard title="예방 이력" icon="health_and_safety">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              예방 조치 등록 내역입니다. 장비 유형 필터({equipmentType})가 적용됩니다.
            </p>
            <button
              type="button"
              onClick={() => setShowPreventiveModal(true)}
              className="px-3 py-1.5 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors text-sm inline-flex items-center gap-1.5 shrink-0"
            >
              <span className="material-symbols-outlined text-base">add</span>
              예방 조치 등록
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#14213d]">
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">등록일시</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">장비 ID</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">유형</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">감지일시</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400 min-w-[160px]">내용</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">조치 전 상태</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">조치 후 상태</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">결과</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">담당자</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">부서</th>
                </tr>
              </thead>
              <tbody>
                {preventiveLogsLoading ? (
                  <tr><td colSpan={10} className="py-8 px-3 text-center text-gray-500 dark:text-gray-400">예방 이력을 불러오는 중입니다…</td></tr>
                ) : preventiveLogsError ? (
                  <tr><td colSpan={10} className="py-8 px-3 text-center text-red-500 dark:text-red-400">{preventiveLogsError}</td></tr>
                ) : preventiveLogs.length === 0 ? (
                  <tr><td colSpan={10} className="py-8 px-3 text-center text-gray-500 dark:text-gray-400">등록된 예방 이력이 없습니다.</td></tr>
                ) : (
                  preventiveLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#1e293b] transition-colors">
                      <td className="py-2 px-3 whitespace-nowrap text-gray-500 dark:text-gray-400 text-xs">{log.created_at ?? "—"}</td>
                      <td className="py-2 px-3 font-medium">{log.device_id}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.device_type === "OHT" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"}`}>
                          {log.device_type}
                        </span>
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-xs">{log.detected_at ?? "—"}</td>
                      <td className="py-2 px-3 max-w-[200px] truncate" title={log.description ?? ""}>{log.description ?? "—"}</td>
                      <td className="py-2 px-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stateBadgeClass(log.predicted_state_before)}`}>{stateLabel(log.predicted_state_before)}</span></td>
                      <td className="py-2 px-3"><span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stateBadgeClass(log.predicted_state_after)}`}>{stateLabel(log.predicted_state_after)}</span></td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${log.result === "성공" ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : log.result === "실패" ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"}`}>
                          {log.result ?? "—"}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm">{log.technician ?? "—"}</td>
                      <td className="py-2 px-3 text-sm">{log.category ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AddPreventiveModal
            open={showPreventiveModal}
            onClose={() => setShowPreventiveModal(false)}
            equipmentType={equipmentType}
            onAdd={(log) => { setPreventiveLogs((prev) => [log, ...prev]); setShowPreventiveModal(false); }}
          />
        </SectionCard>

        {/* ────── 조치 가이드 ────── */}
        <SectionCard title={`${equipmentType} 조치 가이드`} icon="menu_book">
          {guideLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4">가이드를 불러오는 중…</p>
          ) : !guideData ? (
            <p className="text-sm text-red-500 py-4">가이드를 불러오지 못했습니다. 백엔드 연결을 확인하세요.</p>
          ) : (
            <div className="space-y-5">
              {Object.entries(guideData).map(([sensorKey, sensorVal]: [string, any]) => {
                const isAGV = equipmentType === "AGV";
                const state2: any[] = sensorVal.state2 ?? [];
                const state3: any[] = sensorVal.state3 ?? [];
                const actions: any[] = sensorVal.actions ?? [];
                const target: Record<string, any> = sensorVal.target ?? {};

                const ActionRow = ({ item }: { item: any }) => (
                  <tr className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="py-2 pr-3 text-sm font-medium text-gray-800 dark:text-gray-200 align-top w-40">{item.action}</td>
                    <td className="py-2 pr-3 text-xs text-gray-500 dark:text-gray-400 align-top">{item.detail}</td>
                    <td className="py-2 pr-3 text-xs text-center align-top whitespace-nowrap">
                      {item.before != null && item.after != null ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-semibold text-red-500">{item.before}</span>
                          <span className="material-symbols-outlined text-sm text-gray-400">arrow_forward</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">{item.after}</span>
                        </span>
                      ) : item.before != null ? (
                        <span className="text-red-500 font-semibold">{item.before} → 즉시차단</span>
                      ) : (
                        <span className="text-gray-400">진단</span>
                      )}
                    </td>
                    <td className="py-2 text-xs text-center text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap align-top">{item.duration}</td>
                  </tr>
                );

                return (
                  <div key={sensorKey} className="rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                    {/* 센서 헤더 */}
                    <div className="px-4 py-2.5 bg-gray-50 dark:bg-[#14213d] flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-blue-500">sensors</span>
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{sensorVal.label}</span>
                    </div>

                    {isAGV ? (
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {/* State 2 */}
                        {state2.length > 0 && (
                          <div className="px-4 py-3">
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">warning</span>
                              State 2 — 경고 단계 조치
                            </p>
                            <table className="w-full">
                              <thead>
                                <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                  <th className="text-left pb-1 pr-3 w-40">조치 방법</th>
                                  <th className="text-left pb-1 pr-3">상세</th>
                                  <th className="text-center pb-1 pr-3">수치 변화</th>
                                  <th className="text-center pb-1">소요시간</th>
                                </tr>
                              </thead>
                              <tbody>{state2.map((item: any, i: number) => <ActionRow key={i} item={item} />)}</tbody>
                            </table>
                          </div>
                        )}
                        {/* State 3 */}
                        {state3.length > 0 && (
                          <div className="px-4 py-3">
                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">dangerous</span>
                              State 3 — 위험 단계 즉시 조치
                            </p>
                            <table className="w-full">
                              <thead>
                                <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                                  <th className="text-left pb-1 pr-3 w-40">조치 방법</th>
                                  <th className="text-left pb-1 pr-3">상세</th>
                                  <th className="text-center pb-1 pr-3">수치 변화</th>
                                  <th className="text-center pb-1">소요시간</th>
                                </tr>
                              </thead>
                              <tbody>{state3.map((item: any, i: number) => <ActionRow key={i} item={item} />)}</tbody>
                            </table>
                          </div>
                        )}
                        {/* 목표 수치 */}
                        {Object.keys(target).length > 0 && (
                          <div className="px-4 py-2.5 bg-green-50 dark:bg-green-900/10 flex flex-wrap gap-3">
                            <span className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">verified</span>개선 목표
                            </span>
                            {Object.entries(target).map(([k, v]: [string, any]) => (
                              <span key={k} className="text-xs text-green-700 dark:text-green-400">
                                {k}: <span className="font-semibold">{v.before} → {v.after}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // OHT: 단순 actions 표
                      <div className="px-4 py-3">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                              <th className="text-left pb-1 pr-3 w-48">조치 방법</th>
                              <th className="text-left pb-1 pr-3">상세</th>
                              <th className="text-center pb-1 pr-3">수치 변화</th>
                              <th className="text-center pb-1">소요시간</th>
                            </tr>
                          </thead>
                          <tbody>{actions.map((item: any, i: number) => <ActionRow key={i} item={item} />)}</tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* ────── 설비별 정비 이력 타임라인 (DB 기반) ────── */}
        <SectionCard title="설비별 정비 이력 타임라인" icon="timeline">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            조치 이력 DB 기준으로 설비별 타임라인을 표시합니다. 같은 부서의 같은 분류 조치가 3개월 내 2회 이상이면 반복 고장으로 표시됩니다.
          </p>
          {Object.keys(timelineByDevice).length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4">
              {correctiveLoading ? "불러오는 중…" : "해당 기종의 정비 이력이 없습니다."}
            </p>
          ) : (
            <div className="space-y-10">
              {Object.entries(timelineByDevice).map(([deviceId, logs]) => {
                const sorted = [...logs].sort((a, b) =>
                  new Date(b.actioned_at ?? "").getTime() - new Date(a.actioned_at ?? "").getTime()
                );
                return (
                  <div key={deviceId}>
                    <h4 className="text-sm font-semibold text-[#111418] dark:text-[#ededed] mb-4">{deviceId}</h4>
                    <div className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-600">
                      {sorted.map((entry, i) => {
                        const recurring = isRecurringFromDB(deviceId, entry.category, entry.actioned_at);
                        const dateLabel = entry.actioned_at?.slice(0, 10) ?? "—";
                        return (
                          <div key={`${deviceId}-${entry.id}-${i}`} className="relative pb-6 last:pb-0">
                            <span className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-[#137fec] dark:bg-[#3b82f6] border-2 border-white dark:border-[#1e293b] -translate-x-[7px]" aria-hidden />
                            <div className="ml-2">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <span className="text-sm font-medium text-[#111418] dark:text-[#ededed]">{dateLabel}</span>
                                {recurring && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                    반복 고장 주의
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${stateBadgeClass(entry.before_state)}`}>
                                  {stateLabel(entry.before_state)} → {stateLabel(entry.after_state)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">{entry.category ?? "기타"}</span>
                                {entry.description && <span className="text-gray-500 dark:text-gray-400"> · {entry.description}</span>}
                              </p>
                              {entry.technician && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">담당자: {entry.technician}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    );
  }

  if (tab === "reports") {
    return (
      <div className={tabContentClass}>
        <ReportsTabContent equipmentType={equipmentType} />
      </div>
    );
  }

  return null;
}

function ReportsTabContent({ equipmentType = "AGV" }: { equipmentType?: EquipmentTypeFilter }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [monthYear, setMonthYear] = useState(() => `${currentYear}-${String(now.getMonth() + 1).padStart(2, "0")}`);
  const [weekYear, setWeekYear] = useState(() => {
    const oneJan = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil((((now.getTime() - oneJan.getTime()) / 86400000) + oneJan.getDay() + 1) / 7);
    return `${currentYear}-W${String(weekNum).padStart(2, "0")}`;
  });

  const monthOptions = (() => {
    const out: { value: string; label: string }[] = [];
    for (let y = currentYear; y >= currentYear - 2; y--) {
      for (let m = 1; m <= 12; m++) {
        const v = `${y}-${String(m).padStart(2, "0")}`;
        out.push({ value: v, label: `${y}년 ${m}월` });
      }
    }
    return out;
  })();

  const weekOptions = (() => {
    const out: { value: string; label: string }[] = [];
    for (let y = currentYear; y >= currentYear - 1; y--) {
      for (let w = 1; w <= 53; w++) {
        const v = `${y}-W${String(w).padStart(2, "0")}`;
        out.push({ value: v, label: `${y}년 ${w}주차` });
      }
    }
    return out;
  })();

  const handleDownloadMonthly = () => {
    const [y, m] = monthYear.split("-");
    const periodLabel = `${y}년 ${parseInt(m, 10)}월`;
    downloadReportHtml(`설비보전 월별 보고서 - ${periodLabel}`, periodLabel, `FDC_monthly_${monthYear}.html`);
  };

  const handleDownloadMonthlyCsv = () => {
    const [y, m] = monthYear.split("-");
    downloadReportCsv(`${y}년 ${parseInt(m, 10)}월`, `FDC_monthly_${monthYear}.csv`);
  };

  const handleDownloadWeekly = () => {
    const periodLabel = weekYear.replace("-W", "년 ") + "주차";
    downloadReportHtml(`설비보전 주간 보고서 - ${periodLabel}`, periodLabel, `FDC_weekly_${weekYear}.html`);
  };

  const handleDownloadWeeklyCsv = () => {
    downloadReportCsv(weekYear.replace("-W", "년 ") + "주차", `FDC_weekly_${weekYear}.csv`);
  };

  return (
    <>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        기준 장비: <span className="font-medium text-[#111418] dark:text-[#ededed]">{equipmentType}</span>
      </p>
      <SectionCard title="월별 보고서" icon="calendar_month">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          월 단위 설비 가동률, 이상/알람, KPI 요약을 다운로드합니다.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[#111418] dark:text-[#ededed]">기간 선택</label>
          <select
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] px-3 py-2 text-sm min-w-[140px]"
          >
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleDownloadMonthly}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            다운로드
          </button>
          <button
            type="button"
            onClick={handleDownloadMonthlyCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 text-[#111418] dark:text-[#ededed] hover:border-[#137fec] hover:text-[#137fec] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">table_chart</span>
            CSV 다운로드
          </button>
        </div>
      </SectionCard>
      <SectionCard title="주간 보고서" icon="date_range">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          주 단위 설비 현황 및 알람·조치 요약을 다운로드합니다.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-[#111418] dark:text-[#ededed]">주차 선택</label>
          <select
            value={weekYear}
            onChange={(e) => setWeekYear(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1e293b] text-[#111418] dark:text-[#ededed] px-3 py-2 text-sm min-w-[140px]"
          >
            {weekOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleDownloadWeekly}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-[#137fec] text-white hover:bg-[#0d6bd6] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            다운로드
          </button>
          <button
            type="button"
            onClick={handleDownloadWeeklyCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-600 text-[#111418] dark:text-[#ededed] hover:border-[#137fec] hover:text-[#137fec] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-lg">table_chart</span>
            CSV 다운로드
          </button>
        </div>
      </SectionCard>
    </>
  );
}
