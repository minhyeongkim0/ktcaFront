# 라우트/기능 매핑표 (IA 개편 후)

## 개요
제품 컨셉: **MES 품질관리** → **FDC 기반 설비 예지보전/관제 시스템**

- 홈(/)에서 2개 진입 카드로 분리: (A) 설비 예지보전(관제), (B) 경영/운영체계(ISO)
- 전역 헤더: 로고/통합 대시보드(홈 링크) + 시간/언어/계정. 업무영역 탭 제거.

---

## 라우트 매핑

| 기존 라우트 | 이동/리다이렉트 | 설명 |
|-------------|-----------------|------|
| `/` | `app/page.tsx` | **변경**: 2개 진입 카드 (FDC / Management) |
| `/monitoring` | `/fdc` (리다이렉트) | 기간별 설비 상태 모니터링 → FDC 해당 탭 |
| `/operation` | `/fdc` (리다이렉트) | Tableau OHT/AGV → FDC "이상/알람", "예측/진단" 탭 |
| `/fdc` | **신규** | 설비 예지보전 메인 (5개 탭) |
| `/management` | **신규** | 경영/운영체계 (4개 탭) |
| `/context` | `/management` → 회사개요 | 원자재/납품/본사/고객/SWOT |
| `/guideline` | `/management` → 운영체계(ISO) | ISO Annex SL 가이드 한 화면 |
| `/leadership` | `/management` (선택적 통합) | 리더십 메시지 |
| `/support` | `/management` → 조직/RACI | 조직도, 장비 목록 |
| `/planning` | `/management` → 품질목표 | FMEA, 사업계획, 추진계획 |
| `/performance` | `/management` (품질목표에 통합) | 성과/리포트 |
| `/improvement` | `/management` (품질목표에 통합) | 개선 이력 |

---

## FDC (`/fdc`) 탭 구조

| 탭 ID | 탭명 | 컴포넌트/콘텐츠 |
|-------|------|-----------------|
| monitoring | 기간별 설비 상태 모니터링 | `MonitoringView` (기존 monitoring API 연동) |
| alarms | 이상/알람 | `TableauEmbed` (OHT_DASHBOARDS) |
| prediction | 예측/진단 | `TableauEmbed` (anomaly 관련) |
| reports | 리포트 | 다운로드 버튼, 주간/월간 리포트 플레이스홀더 |
| assets | 자산/장비 | 장비 목록 테이블 플레이스홀더 |

---

## Management (`/management`) 탭 구조

| 탭 ID | 탭명 | 컴포넌트/콘텐츠 |
|-------|------|-----------------|
| overview | 회사 개요 | `ContextPage` (원자재/납품/본사/고객/SWOT) |
| iso | 운영체계(ISO) | `GuidelineView` (ISO Annex SL 가이드) |
| organization | 조직/RACI | `OrganizationChartView`, `EquipmentView` |
| qualityGoals | 품질 목표 | `PlanningView` (FMEA, 사업계획, 추진계획) |

---

## 컴포넌트 재사용

| 기존 컴포넌트 | 새 위치 |
|---------------|---------|
| `app/monitoring/page.tsx` | `MonitoringView` → `app/fdc/page.tsx` (monitoring 탭) |
| `TableauEmbed` + OHT_DASHBOARDS | `app/fdc/page.tsx` (alarms, prediction 탭) |
| `GuidelineView` | `app/management/page.tsx` (iso 탭) |
| `ContextPage` | `app/management/page.tsx` (overview 탭) |
| `OrganizationChartView`, `EquipmentView` | `app/management/page.tsx` (organization 탭) |
| `PlanningView` | `app/management/page.tsx` (qualityGoals 탭) |

---

## 카피/타이틀 변경

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 제품명 | MES 품질관리 | FDC Predictive Maintenance / FDC 설비 예지보전 |
| metadata title | (기존) | FDC Predictive Maintenance |
| metadata description | (기존) | FDC 기반 설비 예지보전/관제 시스템 |
