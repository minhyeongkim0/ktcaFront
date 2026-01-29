"use client";

import { useState, useEffect } from "react";

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

export default function MonitoringPage() {
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

  const getStateLabel = (state: number) => {
    switch (state) {
      case 0: return "정상";
      case 1: return "주의";
      case 2: return "경고";
      case 3: return "위험";
      default: return "알 수 없음";
    }
  };

  // 최신 데이터
  const latestData = history.length > 0 ? history[history.length - 1] : null;

  return (
    <>
      {/* Sidebar - 장비 선택 */}
      <aside className="w-72 bg-white border-r border-[#e5e7eb] flex flex-col p-4 gap-4 overflow-y-auto hidden md:flex">
        {/* 장비 타입 선택 */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">장비 타입</label>
          <div className="flex gap-2">
            <button
              onClick={() => setEquipmentType("AGV")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                equipmentType === "AGV"
                  ? "bg-[#137fec] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              AGV
            </button>
            <button
              onClick={() => setEquipmentType("OHT")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                equipmentType === "OHT"
                  ? "bg-[#137fec] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              OHT
            </button>
          </div>
        </div>

        {/* 장비 목록 */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
            장비 선택 ({devices.length}대)
          </label>
          <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
            {devices.map((device) => (
              <button
                key={device.device_id}
                onClick={() => setSelectedDevice(device.device_id)}
                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                  selectedDevice === device.device_id
                    ? "bg-[#137fec] text-white"
                    : "bg-gray-50 hover:bg-gray-100 text-[#111418]"
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
        </div>

        {/* 통계 요약 */}
        {stats && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">상태 분포</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-green-500"></span>
                  <span className="text-sm">정상</span>
                </span>
                <span className="text-sm font-bold">{stats.state_0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm">주의</span>
                </span>
                <span className="text-sm font-bold">{stats.state_1}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-orange-500"></span>
                  <span className="text-sm">경고</span>
                </span>
                <span className="text-sm font-bold">{stats.state_2}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-500"></span>
                  <span className="text-sm">위험</span>
                </span>
                <span className="text-sm font-bold">{stats.state_3}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#f6f7f8] overflow-y-auto">
        {!selectedDevice ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">touch_app</span>
            <h3 className="text-xl font-bold text-gray-400">장비를 선택하세요</h3>
            <p className="text-gray-400 mt-2">좌측 사이드바에서 모니터링할 장비를 선택해주세요.</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#137fec]"></div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#111418]">{selectedDevice.toUpperCase()} 모니터링</h2>
                <p className="text-gray-500">실시간 센서 데이터 및 상태 정보</p>
              </div>
              {latestData && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStateColor(latestData.state)} text-white`}>
                  <span className="size-2 rounded-full bg-white animate-pulse"></span>
                  <span className="font-bold">{getStateLabel(latestData.state)}</span>
                </div>
              )}
            </div>

            {/* 현재 센서값 카드 */}
            {latestData && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <span className="material-symbols-outlined text-lg">electric_bolt</span>
                    <span className="text-xs font-medium">CT2 전류</span>
                  </div>
                  <p className="text-2xl font-bold text-[#111418]">{latestData.CT2.toFixed(1)} <span className="text-sm font-normal text-gray-400">A</span></p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <span className="material-symbols-outlined text-lg">thermostat</span>
                    <span className="text-xs font-medium">최고 온도</span>
                  </div>
                  <p className="text-2xl font-bold text-[#111418]">{latestData.ir_temp_max.toFixed(1)} <span className="text-sm font-normal text-gray-400">℃</span></p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <span className="material-symbols-outlined text-lg">blur_on</span>
                    <span className="text-xs font-medium">PM10</span>
                  </div>
                  <p className="text-2xl font-bold text-[#111418]">{latestData.PM10.toFixed(0)} <span className="text-sm font-normal text-gray-400">㎍/㎥</span></p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <span className="material-symbols-outlined text-lg">device_thermostat</span>
                    <span className="text-xs font-medium">NTC</span>
                  </div>
                  <p className="text-2xl font-bold text-[#111418]">{latestData.NTC.toFixed(1)} <span className="text-sm font-normal text-gray-400">℃</span></p>
                </div>
              </div>
            )}

            {/* 센서 데이터 테이블 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-[#111418]">센서 히스토리</h3>
                <span className="text-xs text-gray-500">최근 {history.length}건</span>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500">시간</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">CT1</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">CT2</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">CT3</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">CT4</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">온도</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500">PM10</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().map((row, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600">{row.datetime}</td>
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
      </main>
    </>
  );
}
