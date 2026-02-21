# 인코딩 손상 파일 복구 안내

PowerShell `Get-Content`/`Set-Content`로 인해 다음 파일의 UTF-8 인코딩이 손상되었을 수 있습니다.

- `src/i18n/locales/ko.ts`
- `src/i18n/locales/en.ts` (일부)
- `src/data/support/orgChart.ts` (일부)
- `src/data/dummyData.ts` (일부)

## 복구 방법

1. **Git/백업에서 복원** (가능한 경우):
   ```powershell
   git checkout -- src/i18n/locales/ko.ts src/i18n/locales/en.ts src/data/support/orgChart.ts src/data/dummyData.ts
   ```
   (src가 untracked인 경우 해당되지 않음)

2. **수동 수정** – 아래 브랜딩 변경만 적용:

### ko.ts (header, guideline)
- `header.title`: "통합 대시보드"
- `header.dashboard`: "통합 대시보드"
- `tabFirstB1`: "상단: 통합 대시보드 타이틀 + 오늘 날짜/시간 + 관리자 계정 정보"
- `tabFirstB4`: "주 화면: 통합 대시보드 큰 타이틀 + 희미한 회사 로고 배경"

### en.ts
- `header.title`: "Integrated Dashboard"
- `header.dashboard`: "Integrated Dashboard"
- `tabFirstB1`: "Top: Integrated Dashboard title + date/time + admin account info"
- `tabFirstB4`: "Main: Integrated Dashboard title + subtle company logo background"

### orgChart.ts
- `fakeEmail` 함수: `@ams.co.kr` → `@qms.local`
- `ceo.email`: `ceo@ams.co.kr` → `ceo@qms.local`

### dummyData.ts
- `header.title`: "통합 대시보드"

## 인코딩 주의사항

- UTF-8 (BOM 없음)로 저장하세요.
- PowerShell에서 수정 시: `-Encoding UTF8` 옵션 사용.
- VS Code: 하단 상태바에서 "UTF-8" 인코딩 확인.
