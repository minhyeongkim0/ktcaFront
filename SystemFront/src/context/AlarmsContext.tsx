"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/** 설비/시스템 이상 발생 시에만 사용. 정상 알림은 표시하지 않음 */
export type AlarmItem = {
  id: string;
  /** 설비 ID (선택) */
  equipmentId?: string;
  /** 알람 제목 (예: 설비 알람, 온도 임계치 초과) */
  title: string;
  /** 상세 메시지 */
  message: string;
  /** 발생 시각 (ISO 문자열 또는 표시용 문자열) */
  at: string;
  /** 심각도 */
  severity?: "warning" | "critical";
  /** 미확인 여부 */
  unread?: boolean;
};

type AlarmsContextValue = {
  /** 현재 이상(알람) 목록 — 실제 데이터가 들어올 때만 채워짐 */
  alarms: AlarmItem[];
  setAlarms: (alarms: AlarmItem[] | ((prev: AlarmItem[]) => AlarmItem[])) => void;
  /** 이상 1건 추가 (API/WebSocket 등에서 호출) */
  addAlarm: (alarm: Omit<AlarmItem, "id">) => void;
  /** 미확인 → 확인 처리 */
  markAsRead: (id: string) => void;
};

const AlarmsContext = createContext<AlarmsContextValue | null>(null);

export function AlarmsProvider({ children }: { children: ReactNode }) {
  const [alarms, setAlarmsState] = useState<AlarmItem[]>([]);

  const setAlarms = useCallback((value: AlarmItem[] | ((prev: AlarmItem[]) => AlarmItem[])) => {
    setAlarmsState((prev) => (typeof value === "function" ? value(prev) : value));
  }, []);

  const addAlarm = useCallback((alarm: Omit<AlarmItem, "id">) => {
    const id = `alarm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setAlarmsState((prev) => [{ ...alarm, id, unread: true }, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAlarmsState((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a))
    );
  }, []);

  const value: AlarmsContextValue = {
    alarms,
    setAlarms,
    addAlarm,
    markAsRead,
  };

  return (
    <AlarmsContext.Provider value={value}>
      {children}
    </AlarmsContext.Provider>
  );
}

export function useAlarms() {
  const ctx = useContext(AlarmsContext);
  if (!ctx) throw new Error("useAlarms must be used within AlarmsProvider");
  return ctx;
}
