"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const API_URL = "http://localhost:8000";

export default function OperationPage() {
  const [equipmentType, setEquipmentType] = useState<"AGV" | "OHT">("AGV");
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [history, setHistory] = useState<SensorData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // 장비 목록 불러오기
  useEffect(() => {
    fetch(`${API_URL}/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data.devices))
      .catch((err) => console.error("장비 목록 로드 실패:", err));
  }, []);

  // 장비 선택 시 히스토리 & 통계 불러오기
  useEffect(() => {
    if (!selectedDevice) return;

    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/agv/${selectedDevice}/history?limit=200`).then((res) => res.json()),
      fetch(`${API_URL}/agv/${selectedDevice}/stats`).then((res) => res.json()),
    ])
      .then(([historyData, statsData]) => {
        setHistory(historyData.history);
        setStats(statsData.stats);
      })
      .catch((err) => console.error("데이터 로드 실패:", err))
      .finally(() => setLoading(false));
  }, [selectedDevice]);

  // State 색상
  const getStateColor = (state: number) => {
    switch (state) {
      case 0: return "bg-green-500";
      case 1: return "bg-yellow-500";
      case 2: return "bg-orange-500";
      case 3: return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStateBorderColor = (state: number) => {
    switch (state) {
      case 0: return "border-green-200";
      case 1: return "border-yellow-200";
      case 2: return "border-orange-200";
      case 3: return "border-red-200";
      default: return "border-gray-200";
    }
  };

  const getStateLabel = (state: number) => {
    switch (state) {
      case 0: return "NORMAL";
      case 1: return "CAUTION";
      case 2: return "WARNING";
      case 3: return "CRITICAL";
      default: return "UNKNOWN";
    }
  };

  const getStateLabelColor = (state: number) => {
    switch (state) {
      case 0: return "bg-green-100 text-green-700 border-green-200";
      case 1: return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 2: return "bg-orange-100 text-orange-700 border-orange-200";
      case 3: return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // 최신 데이터
  const latestData = history.length > 0 ? history[history.length - 1] : null;

  return (
    <>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto z-10 hidden lg:flex">
        <div className="p-4 space-y-6">
          {/* Section 1 */}
          <div>
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Equipment Type</p>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setEquipmentType("AGV")}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition group ${
                  equipmentType === "AGV"
                    ? "bg-blue-50 text-[#137fec]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className={`material-symbols-outlined ${equipmentType === "AGV" ? "text-[#137fec]" : "text-slate-400"}`}>
                  precision_manufacturing
                </span>
                <span className="text-sm font-medium">AGV</span>
              </button>
              <button
                onClick={() => setEquipmentType("OHT")}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition group ${
                  equipmentType === "OHT"
                    ? "bg-blue-50 text-[#137fec]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className={`material-symbols-outlined ${equipmentType === "OHT" ? "text-[#137fec]" : "text-slate-400"}`}>
                  conveyor_belt
                </span>
                <span className="text-sm font-medium">OHT</span>
              </button>
            </div>
          </div>

          {/* Section 2: Device List */}
          <div>
            <div className="px-3 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {equipmentType} List ({devices.length})
              </p>
            </div>
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {devices.map((device) => (
                <button
                  key={device.device_id}
                  onClick={() => setSelectedDevice(device.device_id)}
                  className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg w-full transition ${
                    selectedDevice === device.device_id
                      ? "bg-blue-50 text-[#137fec]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium">{device.device_name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{device.manufacturer}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-auto p-4 border-t border-slate-200">
          <div className="bg-slate-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">System Status</span>
              <span className="size-2 rounded-full bg-green-500"></span>
            </div>
            <p className="text-xs text-slate-600">AGV Prediction System v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#f6f7f8]">
        <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">
          {/* Breadcrumbs & Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-[#137fec] transition">Home</Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-slate-900 font-medium">Operation - AGV Prediction</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {selectedDevice ? `${selectedDevice.toUpperCase()} Monitoring` : "AGV Prediction System"}
                </h1>
                <p className="text-slate-500 mt-1">
                  {selectedDevice ? "Real-time sensor data and state prediction" : "Select an AGV from the sidebar to begin monitoring"}
                </p>
              </div>
              {latestData && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span> Live
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStateLabelColor(latestData.state)}`}>
                    {getStateLabel(latestData.state)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {!selectedDevice ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 rounded-full bg-slate-100 mb-6">
                <span className="material-symbols-outlined text-5xl text-slate-300">touch_app</span>
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">Select an AGV</h3>
              <p className="text-slate-400 text-center max-w-md">
                Choose an AGV from the sidebar to view real-time sensor data, historical trends, and state predictions.
              </p>
            </div>
          ) : loading ? (
            /* Loading State */
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]"></div>
            </div>
          ) : (
            <>
              {/* Current Sensor Values */}
              {latestData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#137fec]">
                        <span className="material-symbols-outlined">electric_bolt</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">CT2 Current</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">{latestData.CT2.toFixed(1)}</span>
                      <span className="text-sm text-slate-500">A</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                        <span className="material-symbols-outlined">thermostat</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Max Temperature</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">{latestData.ir_temp_max.toFixed(1)}</span>
                      <span className="text-sm text-slate-500">°C</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                        <span className="material-symbols-outlined">blur_on</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">PM10</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">{latestData.PM10.toFixed(0)}</span>
                      <span className="text-sm text-slate-500">㎍/㎥</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-10 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                        <span className="material-symbols-outlined">device_thermostat</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">NTC Temp</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">{latestData.NTC.toFixed(1)}</span>
                      <span className="text-sm text-slate-500">°C</span>
                    </div>
                  </div>
                </div>
              )}

              {/* State Distribution */}
              {stats && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* State Chart */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900">State Distribution</h3>
                      <span className="material-symbols-outlined text-slate-400">info</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-3 rounded-full bg-green-500"></span>
                          <span className="text-sm text-slate-600">Normal (0)</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stats.state_0}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.state_0 / stats.total_records) * 100}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-3 rounded-full bg-yellow-500"></span>
                          <span className="text-sm text-slate-600">Caution (1)</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stats.state_1}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.state_1 / stats.total_records) * 100}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-3 rounded-full bg-orange-500"></span>
                          <span className="text-sm text-slate-600">Warning (2)</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stats.state_2}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(stats.state_2 / stats.total_records) * 100}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-3 rounded-full bg-red-500"></span>
                          <span className="text-sm text-slate-600">Critical (3)</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{stats.state_3}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.state_3 / stats.total_records) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Average Values */}
                  <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <span className="size-2 rounded-full bg-[#137fec]"></span>
                          Sensor Averages
                        </h3>
                        <p className="text-sm text-slate-500">Historical average values for {selectedDevice.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Avg CT2</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.avg_ct2?.toFixed(1) || "N/A"}</p>
                        <p className="text-xs text-slate-400">Ampere</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Avg Temp</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.avg_temp?.toFixed(1) || "N/A"}</p>
                        <p className="text-xs text-slate-400">°C</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Avg PM10</p>
                        <p className="text-2xl font-bold text-slate-900">{stats.avg_pm10?.toFixed(0) || "N/A"}</p>
                        <p className="text-xs text-slate-400">㎍/㎥</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensor History Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Sensor History</h3>
                  <span className="text-sm text-slate-500">Latest {history.length} records</span>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                      <tr>
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3 text-right">CT1</th>
                        <th className="px-6 py-3 text-right">CT2</th>
                        <th className="px-6 py-3 text-right">CT3</th>
                        <th className="px-6 py-3 text-right">CT4</th>
                        <th className="px-6 py-3 text-right">Temp</th>
                        <th className="px-6 py-3 text-right">PM10</th>
                        <th className="px-6 py-3 text-center">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[...history].reverse().map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-6 py-3 text-slate-900">{row.datetime}</td>
                          <td className="px-6 py-3 text-right text-slate-600">{row.CT1.toFixed(2)}</td>
                          <td className="px-6 py-3 text-right text-slate-600">{row.CT2.toFixed(2)}</td>
                          <td className="px-6 py-3 text-right text-slate-600">{row.CT3.toFixed(2)}</td>
                          <td className="px-6 py-3 text-right text-slate-600">{row.CT4.toFixed(2)}</td>
                          <td className="px-6 py-3 text-right text-slate-600">{row.ir_temp_max.toFixed(1)}°C</td>
                          <td className="px-6 py-3 text-right text-slate-600">{row.PM10.toFixed(0)}</td>
                          <td className="px-6 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-white ${getStateColor(row.state)}`}>
                              {getStateLabel(row.state)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
