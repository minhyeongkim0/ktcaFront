# Tableau OHT_3 임베딩 (운영 > 공정관리)

## 요약

- **앱에서 가능한 조치**: embed URL 파라미터(`:device=desktop`, 선택 `:toolbar=no`), iframe **반응형 높이**(폭 기반 + clamp 1300~2100), ResizeObserver 기반 재계산, iframe 폭 확대, "Tableau에서 크게 보기" 링크.
- **Tableau에서 해야 할 조치**: 범례 잘림(대시보드 크기/범례 배치), 범례 순서(정상→주의→경고→위험), 2×2 배치 — 워크북 수정 후 재게시.

iframe은 cross-origin이라 **앱에서 Tableau 내부 DOM/CSS 조작 불가**.

---

## 앱에서 가능한 조치

| 조치 | 적용 여부 |
|------|-----------|
| **:device=desktop** | embed URL에 포함. desktop 레이아웃 유지. |
| **iframe 높이** | **반응형 + clamp.** 폭 기준: ≥1280→1500px, 1024~1279→1650px, 900~1023→1850px, &lt;900→2100px. min 1300, max 2100. (2400~2600 고정 폐기) |
| **ResizeObserver** | iframe 컨테이너 폭 관측, 폭 변동 시에만 높이를 debounce(200ms)로 재계산. window resize 대신 사용. |
| **iframe 폭** | width:100%, min-width:0. 카드 본문 `-mx-2 md:-mx-4`로 가용 폭 확대. |
| **스크롤** | ShellLayout 본문 `overflow-y-auto`. 상위에 잘림(max-height/overflow:hidden) 없음. |
| **Tableau에서 크게 보기** | 카드 우측 상단 링크 → Tableau Public 원본 새 탭. |
| **toolbar=no** (선택) | QA 시 `.env.local`에 `NEXT_PUBLIC_TABLEAU_HIDE_TOOLBAR=true` 설정 시 `:toolbar=no` 적용. 범례 공간 확보 비교용. |

높이 미세 조정이 필요하면 `TableauOHT3Embed.tsx`의 `EMBED_HEIGHT.widthBreakpoints` 값을 100~200px 단위로 조정하면 된다.

---

## 결론: 범례 잘림이 앱에서 해결되지 않는 경우

**위 조치 후에도 "iframe 박스 자체는 충분히 큰데, iframe 내부에서만 legend가 잘린다"면**  
이는 **Tableau 대시보드가 Fixed size / Device layout**으로 내부에서 클리핑되는 문제이며, **앱에서는 100% 해결 불가**이다.

이 경우 **Tableau 워크북**에서 아래를 수정한 뒤 재게시해야 한다.

### 1) 범례 잘림

- **Dashboard Size**: **Automatic** 또는 **Range**로 변경.
- 범례를 **우측/상단**으로 이동하거나, 범례 영역 **높이 확보**.

### 2) 범례 순서 (정상 → 주의 → 경고 → 위험)

- 해당 차원 **Default Properties** → **Sort** → **Manual** 후 위 순서로 배치.
- 또는 **계산 필드**로 정렬 키 생성 후 **Sort by Field** 오름차순:

  ```
  CASE [Status]
    WHEN "정상가동" THEN 1  WHEN "정상" THEN 1
    WHEN "주의(모니터링)" THEN 2  WHEN "주의" THEN 2
    WHEN "경고(고장전조)" THEN 3  WHEN "경고" THEN 3
    WHEN "위험(즉시점검)" THEN 4  WHEN "위험" THEN 4
    ELSE 99
  END
  ```

### 3) 범례 2×2 배치

- **Format Legend**에서 열 수·배치 조정.

수정 후 **Tableau Public에 재게시**하면 앱 iframe에 자동 반영된다.

---

## 원인 구분 (검증용)

- **페이지 끝까지 스크롤해도 iframe DOM 박스가 잘려 보인다**  
  → **클리핑/스크롤 구조 문제.** 상위 `height`/`max-height`/`overflow:hidden` 점검.
- **iframe 박스는 넉넉한데, 내부에서만 legend가 잘린다**  
  → **Tableau 내부 fixed/device layout 문제.** 위 “결론”대로 Tableau 쪽 수정 필요.

---

## CSP

Content-Security-Policy 사용 시:

- `frame-src`: `https://public.tableau.com`
- `img-src`: `https://public.tableau.com`
