"use client";

import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { TableauEmbed } from "@/components/TableauEmbed";
import { FDC_MONITORING_DASHBOARD } from "@/config/tableauDashboards";
import type { DeviceType } from "./DeviceTypeToggle";

interface Device {
  device_id: string;
  device_name: string;
  manufacturer: string;
}

interface SensorData {
  datetime: string;
  CT1: number;
  CT2: number;
  CT3: number;
  CT4: number;
  ir_temp_max: number;
  PM10: number;
  PM2_5: number;
  NTC: number;
  state: number;
}

interface Stats {
  total_records: number;
  avg_ct2: number;
  avg_temp: number;
  avg_pm10: number;
  state_0: number;
  state_1: number;
  state_2: number;
  state_3: number;
}

interface FetchError {
  message: string;
  url: string;
  status?: number;
  cause?: string;
}

const FETCH_TIMEOUT_MS = 10000;

/** fetch with AbortController timeout */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

export interface MonitoringViewProps {
  deviceType?: DeviceType;
}

export function MonitoringView({ deviceType = "AGV" }: MonitoringViewProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [history, setHistory] = useState<SensorData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const [devicesLoading, setDevicesLoading] = useState(true);
  const [devicesError, setDevicesError] = useState<FetchError | null>(null);

  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<FetchError | null>(null);

  const showFdcDebug =
    typeof process !== "undefined" &&
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FDC_DEBUG === "true";

  const { theme } = useTheme();

  const loadDevices = useCallback(async () => {
    const url = "/api/fdc/devices";
    setDevicesLoading(true);
    setDevicesError(null);
    console.log("[MonitoringView] Fetching devices:", url);

    try {
      const res = await fetchWithTimeout(url);
      const text = await res.text();

      if (!res.ok) {
        let parsed: { error?: string; url?: string } = {};
        try {
          parsed = JSON.parse(text || "{}");
        } catch {
          /* ignore */
        }
        const isUpstreamFail =
          res.status === 502 && (parsed.error === "Upstream fetch failed" || text.includes("Upstream fetch failed"));
        const userMessage = isUpstreamFail
          ? "FDC API 서버(localhost:8000)가 실행 중이 아닙니다."
          : `HTTP ${res.status}`;
        if (isUpstreamFail) {
          console.warn("[MonitoringView] FDC API 서버 미실행. localhost:8000에서 백엔드를 실행하세요.");
        } else {
          console.error(`[MonitoringView] ${url} failed: ${res.status}`, text);
        }
        setDevicesError({
          message: "장비 목록을 불러올 수 없습니다",
          url: parsed.url ?? url,
          status: res.status,
          cause: isUpstreamFail ? "localhost:8000 백엔드 미실행" : text.slice(0, 200),
        });
        setDevices([]);
        return;
      }

      const data = JSON.parse(text || "{}");
      const list = data?.devices ?? [];
      setDevices(Array.isArray(list) ? list : []);
      setDevicesError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const cause =
        err instanceof Error && err.name === "AbortError"
          ? "타임아웃 (8~10초 초과)"
          : msg;
      console.error("[MonitoringView] Devices fetch failed:", { url, err: cause });
      setDevicesError({
        message: "장비 목록을 불러오지 못했습니다",
        url,
        cause,
      });
      setDevices([]);
    } finally {
      setDevicesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  useEffect(() => {
    if (!selectedDevice) return;
    setDetailLoading(true);
    setDetailError(null);

    const base = deviceType.toLowerCase();
    const historyUrl = `/api/fdc/${base}/${selectedDevice}/history?limit=200`;
    const statsUrl = `/api/fdc/${base}/${selectedDevice}/stats`;

    const load = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          fetchWithTimeout(historyUrl),
          fetchWithTimeout(statsUrl),
        ]);

        const historyText = await historyRes.text();
        const statsText = await statsRes.text();

        if (!historyRes.ok) {
          console.error(`[MonitoringView] ${historyUrl} failed:`, historyRes.status, historyText);
          setDetailError({ message: `히스토리 ${historyRes.status}`, url: historyUrl, status: historyRes.status });
          setHistory([]);
          setStats(null);
          return;
        }
        if (!statsRes.ok) {
          console.warn(`[MonitoringView] ${statsUrl} failed:`, statsRes.status);
        }

        const historyData = JSON.parse(historyText || "{}");
        const statsData = JSON.parse(statsText || "{}");
        setHistory(historyData?.history ?? []);
        setStats(statsData?.stats ?? null);
        setDetailError(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const cause = err instanceof Error && err.name === "AbortError" ? "타임아웃" : msg;
        console.error("[MonitoringView] Detail fetch failed:", { historyUrl, statsUrl, cause });
        setDetailError({ message: "상세 데이터를 불러오지 못했습니다", url: historyUrl, cause });
        setHistory([]);
        setStats(null);
      } finally {
        setDetailLoading(false);
      }
    };
    load();
  }, [selectedDevice, deviceType ?? "AGV"]);

  const getStateColor = (state: number) => {
    switch (state) {
      case 0: return "bg-green-500";
      case 1: return "bg-yellow-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStateLabel = (state: number) => {
    switch (state) {
      case 0: return "정상";
      case 1: return "주의";
      case 2: return "경고";
      case 3: return "위험";
      default: return "알 수 없음";
    }
  };

  const latestData = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="flex flex-col md:flex-row min-h-0 flex-1">
      <aside className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-[#e5e7eb] dark:border-slate-700 flex flex-col p-4 gap-4 overflow-y-auto shrink-0">
        {/* 장비 목록: 로딩 / 에러 / 성공 */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            장비 선택 ({deviceType}, {devices.length}대)
          </label>
          {devicesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#137fec]" />
            </div>
          ) : devicesError ? (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                장비 목록을 불러올 수 없습니다
              </p>
              <button
                onClick={loadDevices}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#137fec] text-white text-sm font-medium hover:bg-[#0d6dd4]"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                재시도
              </button>
              {showFdcDebug && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p><strong>요청 URL:</strong> {devicesError.url}</p>
                  {devicesError.status != null && <p><strong>상태코드:</strong> {devicesError.status}</p>}
                  {devicesError.cause && <p><strong>원인:</strong> {devicesError.cause}</p>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
              {devices.map((device) => (
                <button
                  key={device.device_id}
                  onClick={() => setSelectedDevice(device.device_id)}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all text-left ${
                    selectedDevice === device.device_id
                      ? "bg-[#137fec] text-white"
                      : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-[#111418] dark:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">precision_manufacturing</span>
                    <span className="font-medium">{device.device_name}</span>
                  </div>
                  <span className="text-xs opacity-70">{device.manufacturer}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">상태 분포</h4>
            <div className="space-y-2">
              {[
                { color: "bg-green-500", label: "정상", count: stats.state_0 },
                { color: "bg-yellow-500", label: "주의", count: stats.state_1 },
                { color: "bg-orange-500", label: "경고", count: stats.state_2 },
                { color: "bg-red-500", label: "위험", count: stats.state_3 },
              ].map(({ color, label, count }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className={`size-3 rounded-full ${color}`} />
                    <span className="text-sm">{label}</span>
                  </span>
                  <span className="text-sm font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 bg-[#f6f7f8] dark:bg-[#0f172a] overflow-y-auto min-w-0">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{FDC_MONITORING_DASHBOARD.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">주/일/분/초 단위로 집계된 AGV/OHT 상태를 BI 차트로 확인합니다.</p>
              </div>
              {FDC_MONITORING_DASHBOARD.url && (
                <a href={FDC_MONITORING_DASHBOARD.url.split("?")[0]} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#137fec] hover:underline flex items-center gap-1">
                  Tableau에서 크게 보기
                  <span className="material-symbols-outlined text-base">open_in_new</span>
                </a>
              )}
            </div>
            <div className="p-4 overflow-hidden min-h-[1000px]">
              <TableauEmbed src={FDC_MONITORING_DASHBOARD.url} title={FDC_MONITORING_DASHBOARD.title} theme={theme} heightDesktop={FDC_MONITORING_DASHBOARD.heightDesktop} heightMobile={FDC_MONITORING_DASHBOARD.heightMobile} />
            </div>
          </div>
        {!selectedDevice ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-slate-600 mb-4">touch_app</span>
            <h3 className="text-xl font-bold text-gray-400 dark:text-slate-500">장비를 선택하세요</h3>
            <p className="text-gray-400 dark:text-slate-500 mt-2">좌측에서 모니터링할 장비를 선택해주세요.</p>
          </div>
        ) : detailLoading ? (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]" />
          </div>
        ) : detailError ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6">
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-6 max-w-md space-y-4">
              <p className="text-amber-800 dark:text-amber-200 font-medium">{detailError.message}</p>
              {showFdcDebug && (
                <div className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                  <p><strong>URL:</strong> {detailError.url}</p>
                  {detailError.cause && <p><strong>원인:</strong> {detailError.cause}</p>}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#111418] dark:text-slate-100">{selectedDevice.toUpperCase()} 모니터링</h2>
                <p className="text-gray-500 dark:text-slate-400">기간별 설비 상태 시계열 및 최신 상태 정보</p>
              </div>
              {latestData && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStateColor(latestData.state)} text-white`}>
                  <span className="size-2 rounded-full bg-white animate-pulse" />
                  <span className="font-bold">{getStateLabel(latestData.state)}</span>
                </div>
              )}
            </div>
            {latestData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "electric_bolt", label: "CT2 전류", value: `${latestData.CT2.toFixed(1)} A` },
                  { icon: "thermostat", label: "최고 온도", value: `${latestData.ir_temp_max.toFixed(1)} ℃` },
                  { icon: "blur_on", label: "PM10", value: `${latestData.PM10.toFixed(0)} ㎍/㎥` },
                  { icon: "device_thermostat", label: "NTC", value: `${latestData.NTC.toFixed(1)} ℃` },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-2">
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                    <p className="text-2xl font-bold text-[#111418] dark:text-slate-100">{value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-bold text-[#111418] dark:text-slate-100">센서 히스토리</h3>
                <span className="text-xs text-gray-500 dark:text-slate-400">최근 {history.length}건</span>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-slate-400">시간</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-slate-400">CT1</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-slate-400">CT2</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-slate-400">CT3</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-slate-400">CT4</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-slate-400">온도</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-slate-400">PM10</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 dark:text-slate-400">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                        <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{row.datetime}</td>
                        <td className="px-4 py-3 text-right">{row.CT1.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{row.CT2.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{row.CT3.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{row.CT4.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">{row.ir_temp_max.toFixed(1)}℃</td>
                        <td className="px-4 py-3 text-right">{row.PM10.toFixed(0)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStateColor(row.state)}`}>
                            {getStateLabel(row.state)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
