# i18n 키 네이밍 규칙

## 도메인 구조

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `nav.*` | 상단 네비게이션 탭 | nav.planning, nav.operation |
| `sideMenu.*` | 사이드바 메뉴, 선택 안내 | sideMenu.menu, sideMenu.selectFromContext |
| `common.*` | 공통 라벨, 버튼 | common.search, common.filter, common.export |
| `state.*` | 상태 문구 | state.loading, state.empty, state.error |
| `severity.*` | 심각도 배지 | severity.normal, severity.warning, severity.critical |
| `table.*` | 테이블 컬럼 | table.date, table.status, table.equipment |
| `planning.*` | 기획 모듈 | planning.fmea, planning.businessPlanSummary |
| `operation.*` | 운용 모듈 | operation.processFlow, operation.processVariables |
| `performance.*` | 성과평가 모듈 | performance.monitor, performance.weeklyReport |
| `improvement.*` | 개선 모듈 | improvement.capa, improvement.defectsBeforeAfter |
| `org.*` | 조직 상황 | org.rawMaterial, org.suppliers, org.swot |
| `leadership.*` | 리더십 | leadership.title |
| `support.*` | 지원 모듈 | support.equipment, support.orgChart |
| `header.*` | 헤더 | header.title, header.welcomeSuffix |
| `context.*` | 조직 상세 카드 | context.supplyCommitment, context.keyCustomers |
| `swot.*` | SWOT 화면 | swot.recallRiskDriver, swot.top6Actions |
| `modal.*` | 모달 (필요 시) | modal.confirm, modal.cancel |
| `toast.*` | 토스트 (필요 시) | toast.success, toast.error |
| `form.*` | 폼 라벨/placeholder (필요 시) | form.searchPlaceholder |

## 중복 방지 규칙

- **같은 의미 = 같은 키**: "검색", "Search" → `common.searchPlaceholder`
- **테이블 컬럼**: 모든 페이지에서 동일 컬럼명은 `table.*` 재사용 (예: `table.date`)
- **버튼**: 검색/필터/내보내기/확인/닫기 → `common.*`

## 예외(번역 제외)

- 고유명사: 현대자동차, 회사명
- 숫자, 단위: 100, 23.5, %, kg
- 코드/약어: ASIL, PPAP (라벨은 번역: "ASIL 등급" → planning.asilLabel)

## 파라미터 치환

- `{{count}}`: `t("improvement.totalCount", { count: n })`
- `{{name}}`: `t("common.hello", { name: userName })`
