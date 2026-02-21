/**
 * 반도체 공정 흐름 데이터 (원자재 → 반제품 → 완제품)
 * 실제 반도체 프론트엔드·백엔드 공정 반영
 */

export type FlowStepType = "raw" | "process" | "semi" | "finished";

export interface FlowStep {
  id: string;
  label: string;
  subLabel?: string;
  type: FlowStepType;
  /** Unsplash 이미지 URL (실제 반도체 설비/웨이퍼/클린룸) */
  imageUrl: string;
}

/** 원자재 → 반제품(웨이퍼) → 완제품(출하) 파이프라인 */
export const SEMICONDUCTOR_FLOW_STEPS: FlowStep[] = [
  {
    id: "raw",
    label: "원자재",
    subLabel: "Si 웨이퍼 / 리드프레임 / EMC",
    type: "raw",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: "photo",
    label: "노광",
    subLabel: "Stepper",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: "etch",
    label: "식각",
    subLabel: "Etcher",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
  },
  {
    id: "deposit",
    label: "증착",
    subLabel: "CVD / PVD",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
  },
  {
    id: "cmp",
    label: "CMP",
    subLabel: "화학기계연마",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80",
  },
  {
    id: "semi",
    label: "반제품",
    subLabel: "웨이퍼",
    type: "semi",
    imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80",
  },
  {
    id: "dicing",
    label: "다이싱",
    subLabel: "Dicing",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
  },
  {
    id: "die-attach",
    label: "다이 부착",
    subLabel: "Die Attach",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: "wire-bond",
    label: "와이어 본딩",
    subLabel: "Wire Bond",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
  },
  {
    id: "molding",
    label: "몰딩",
    subLabel: "Molding",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80",
  },
  {
    id: "cure",
    label: "경화",
    subLabel: "Cure",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
  },
  {
    id: "trim-form",
    label: "리드 가공",
    subLabel: "Trim & Form",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: "final-test",
    label: "최종 검사",
    subLabel: "Final Test",
    type: "process",
    imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&q=80",
  },
  {
    id: "finished",
    label: "자동차용 반도체",
    subLabel: "PMIC / 파워 MCU",
    type: "finished",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];
