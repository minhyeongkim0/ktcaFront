import fs from "fs";

const path = "src/i18n/locales/ko.ts";
let c = fs.readFileSync(path, "utf8");

// Fix dashboard
c = c.replace(/dashboard: "MES .*?"/, 'dashboard: "통합 대시보드"');

// Fix tabFirstB1 (MES 대시보드 -> 통합 대시보드)
c = c.replace(/tabFirstB1: "[^"]*MES[^"]*"/, 'tabFirstB1: "상단: 통합 대시보드 타이틀 + 오늘 날짜/시간 + 관리자 계정 정보"');

// Fix tabFirstB4
c = c.replace(/tabFirstB4: "[^"]*MES[^"]*"/, 'tabFirstB4: "주 화면: 통합 대시보드 큰 타이틀 + 희미한 회사 로고 배경"');

fs.writeFileSync(path, c, "utf8");
console.log("ko.ts fixes applied");
