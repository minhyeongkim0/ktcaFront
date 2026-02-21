/**
 * Equipment Management 더미 데이터
 */

export type EquipmentStatus = "Operating" | "Maintenance" | "Idle";

export interface EquipmentItem {
  id: string;
  machineName: string;
  machineType: string;
  role: string;
  function: string;
  status: EquipmentStatus;
  /** e.g. "Uptime 4d 12h" | "Est. Completion 2h" | "Last active 4h ago" */
  statusDetail: string;
  capacity: string;
  spec: string;
  /** 24h efficiency label or "No data for 4h" */
  efficiencyLabel: string;
  /** Sparkline data (0–1 normalized). Empty = no sparkline / show "No data" */
  sparklineData?: number[];
  /** true = declining trend (orange/red) */
  sparklineDeclining?: boolean;
}

export interface EquipmentKpi {
  totalEquipment: string;
  totalSub: string;
  operationRate: string;
  operationRateSub: string;
  maintenanceDue: string;
  maintenanceDueSub: string;
  powerUsage: string;
  powerUsageSub: string;
}

export const equipmentKpis: EquipmentKpi = {
  totalEquipment: "12",
  totalSub: "+2 new this month",
  operationRate: "92%",
  operationRateSub: "4.2% vs last week",
  maintenanceDue: "2",
  maintenanceDueSub: "Requires attention",
  powerUsage: "45.2",
  powerUsageSub: "1.5% optimization",
};

/** Sparkline 샘플: 상승/유지/하락 패턴 */
const up = [0.3, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.72, 0.78, 0.82, 0.88, 0.92];
const flat = [0.88, 0.86, 0.9, 0.87, 0.91, 0.89, 0.9, 0.88, 0.92, 0.9, 0.91, 0.92];
const down = [0.9, 0.85, 0.82, 0.78, 0.75, 0.72, 0.68, 0.65, 0.6, 0.55, 0.5, 0.45];

export const equipmentList: EquipmentItem[] = [
  {
    id: "DB-1200-01",
    machineName: "Die Bonder DB-1200",
    machineType: "Chip Attachment",
    role: "Chip Attachment",
    function: "Chip Attachment",
    status: "Operating",
    statusDetail: "Uptime 4d 12h",
    capacity: "8,000 UPH ±8µm",
    spec: "8,000 UPH ±8µm",
    efficiencyLabel: "98.2%",
    sparklineData: up,
  },
  {
    id: "WB-700-03",
    machineName: "Wire Bonder WB-700",
    machineType: "Wire Bonding",
    role: "Wire Bonding",
    function: "Wire Bonding",
    status: "Operating",
    statusDetail: "Uptime 12h 45m",
    capacity: "10,500 UPH",
    spec: "35ms/bond, Au/Cu",
    efficiencyLabel: "96.1%",
    sparklineData: flat,
  },
  {
    id: "MP-500-02",
    machineName: "Molding Press MP-500",
    machineType: "Molding",
    role: "Molding",
    function: "Molding",
    status: "Maintenance",
    statusDetail: "Est. Completion 2h",
    capacity: "3,000 UPH",
    spec: "175°C, 70bar",
    efficiencyLabel: "—",
    sparklineData: down,
    sparklineDeclining: true,
  },
  {
    id: "CO-900-01",
    machineName: "Curing Oven CO-900",
    machineType: "Curing",
    role: "Curing",
    function: "Curing",
    status: "Operating",
    statusDetail: "Uptime 20d 2h",
    capacity: "2 lot/day",
    spec: "150~200°C ±2°C",
    efficiencyLabel: "94.5%",
    sparklineData: flat,
  },
  {
    id: "TF-300-01",
    machineName: "Trim&Form TF-300",
    machineType: "Lead Processing",
    role: "Lead Processing",
    function: "Lead Processing",
    status: "Idle",
    statusDetail: "Last active 4h ago",
    capacity: "6,000 UPH ±0.05mm",
    spec: "±0.05mm",
    efficiencyLabel: "4시간 데이터 없음",
    sparklineData: undefined,
  },
];
