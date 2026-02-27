# ISO Annex SL ↔ 신규 탭 구조 매핑

## 기존 ISO 탭 → 신규 구조 매핑

| 기존 탭 (ISO Annex SL) | 신규 1차 영역 | 신규 2차 탭 | URL |
|------------------------|---------------|-------------|-----|
| 조직상황 (Context) | 경영 | 회사 개요 & 이해관계자 | /management?tab=overview |
| 리더십 (Leadership) | 경영 | 리더십 & 방침 | /management?tab=leadership |
| 기획 (Planning) | 경영 | 목표/계획 | /management?tab=planning |
| 지원 (Support) | 경영 | 자원/역량 | /management?tab=resources |
| 운용 (Operation) | 설비보전 | 실시간 관제 | /fdc?tab=monitoring |
| 성과평가 (Performance) | 설비보전 | 성능/KPI | /fdc?tab=kpi |
| 성과평가 (Performance) | 경영 | 성과/리뷰 | /management?tab=performance |
| 개선 (Improvement) | 설비보전 | 개선/조치 | /fdc?tab=improvement |
| 개선 (Improvement) | 경영 | 개선/감사 대응 | /management?tab=improvement |

## /fdc 설비보전 탭별 ISO 매핑

| 탭 | ISO Clause |
|----|------------|
| 실시간 관제 | Operation |
| 이상/알람 | Operation, Performance |
| 예측/진단 | Planning, Operation, Performance |
| 성능/KPI | Performance |
| 개선/조치 | Improvement |

## /management 경영 탭별 ISO 매핑

| 탭 | ISO Clause |
|----|------------|
| 회사 개요 & 이해관계자 | Context |
| 리더십 & 방침 | Leadership |
| 목표/계획 | Planning |
| 자원/역량 | Support |
| 성과/리뷰 | Performance |
| 개선/감사 대응 | Improvement |

## 리다이렉트 (기존 URL → 신규 URL)

| 기존 URL | 리다이렉트 |
|----------|------------|
| /context | /management?tab=overview |
| /leadership | /management?tab=leadership |
| /planning | /management?tab=planning |
| /support | /management?tab=resources |
| /operation | /fdc?tab=monitoring |
| /performance | /fdc?tab=kpi |
| /improvement | /fdc?tab=improvement |
| /guideline | / |
| /monitoring | /fdc?tab=monitoring |
