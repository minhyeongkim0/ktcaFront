#!/usr/bin/env node
/**
 * i18n 하드코딩 문자열 스캔 스크립트
 * 사용자 노출 문자열을 찾아 docs/i18n_remaining.md 형식으로 출력
 *
 * 실행: node scripts/i18n-scan.mjs
 * 또는: npm run i18n:scan
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SCAN_DIRS = ["src", "app", "pages"].filter((d) => existsSync(join(ROOT, d)));

// t("key") 또는 t(`key`) 패턴 - 이미 치환된 것으로 간주
const T_PATTERN = /\bt\s*\(\s*["`]([^"`]+)["`]/g;

// 예외: 숫자, 단위, 아이콘, 변수명 등
const SKIP_PATTERNS = [
  /^[0-9\s.,%+-]+$/,
  /^[a-z_-]+$/,  // 단일 단어
  /^[A-Z][a-zA-Z]+$/,  // PascalCase
  /^\$|#|\.|:|;|{|}|\(|\)/,
  /^material-symbols|className|aria-/,
  /^\s*$/,
  /^[a-z_]+$/,  // 아이콘 이름 (snake_case)
  /^[A-Z]{2,}$/,  // 약어 (ASIL, PPAP 등 - 라벨은 별도)
];

function shouldSkip(str) {
  if (!str || str.length < 2) return true;
  const s = str.trim();
  if (s.length < 2) return true;
  for (const p of SKIP_PATTERNS) {
    if (p.test(s)) return true;
  }
  return false;
}

// 제안 키 매핑 (docs/i18n_key_convention.md 기반)
function suggestKey(str, type, filePath) {
  const s = str.trim();
  const lower = s.toLowerCase();
  const isPage = (path) => path.includes("app/") || path.includes("pages/");
  const pageName = (path) => {
    const m = path.match(/\/(planning|operation|performance|improvement|context|leadership|support|monitoring)\//);
    return m ? m[1] : null;
  };
  const page = pageName(filePath);

  // common.*
  if (lower.includes("검색") || lower.includes("search")) return "common.searchPlaceholder";
  if (lower.includes("필터") || lower === "filter") return "common.filter";
  if (lower.includes("내보내기") || lower === "export") return "common.export";
  if (lower.includes("새로고침") || lower === "refresh") return "common.refresh";
  if (lower.includes("닫기") || lower === "close") return "common.close";
  if (lower.includes("확인") || lower === "confirm") return "common.confirm";
  if (lower.includes("취소") || lower === "cancel") return "common.close";
  if (lower.includes("데이터 없음") || lower.includes("no data")) return "state.empty";
  if (lower.includes("불러오는 중") || lower.includes("loading")) return "state.loading";
  if (lower.includes("오류") || lower.includes("error")) return "state.error";
  if (lower.includes("재시도") || lower.includes("retry")) return "state.retry";

  // severity.*
  if (s === "정상" || s === "Normal") return "severity.normal";
  if (s === "경고" || s === "Warning") return "severity.warning";
  if (s === "주의" || s === "Caution") return "severity.caution";
  if (s === "심각" || s === "Critical" || s === "위험") return "severity.critical";

  // table.columns.*
  if (s === "일자" || s === "Date") return "table.date";
  if (s === "시간" || s === "Time") return "table.time";
  if (s === "상태" || s === "Status") return "table.status";
  if (s === "장비" || s === "Equipment") return "table.equipment";
  if (s === "라인" || s === "Line") return "table.line";
  if (s === "수율" || lower.includes("yield")) return "table.yield";
  if (s === "담당" || s === "Owner") return "table.owner";
  if (s === "조치" || s === "Action") return "table.action";
  if (s === "근본원인" || lower.includes("root cause")) return "table.rootCause";

  // nav / sideMenu
  if (s === "기획" || s === "Planning") return "nav.planning";
  if (s === "운용" || s === "Operation") return "nav.operation";
  if (s === "조직 상황" || s === "Organization") return "nav.organization";
  if (s === "리더십" || s === "Leadership") return "nav.leadership";
  if (s === "지원" || s === "Support") return "nav.support";
  if (s === "성과평가" || s === "Performance") return "nav.performance";
  if (s === "개선" || s === "Improvement") return "nav.improvement";

  // planning.*
  if (page === "planning" && (lower.includes("fmea") || lower.includes("공정") || lower.includes("고장모드"))) return "planning." + (s.length > 10 ? "fmeaTitle" : "process");
  if (s === "사업계획서" || lower.includes("business plan")) return "planning.businessPlanSummary";
  if (s === "추진계획서" || lower.includes("implementation")) return "planning.objectivesTitle";

  // operation.*
  if (page === "operation") return "operation." + (lower.includes("파이프라인") ? "processFlow" : "processVariables");

  // performance.*
  if (s === "모니터링" || s === "Monitoring") return "performance.monitor";
  if (s === "주간보고서" || lower.includes("weekly")) return "performance.weeklyReport";
  if (s === "월간보고서" || lower.includes("monthly")) return "performance.monthlyReport";
  if (lower.includes("작업자 kpi") || lower.includes("employee kpi")) return "performance.employeeKpi";

  return "TODO";
}

function getNote(str, type, filePath) {
  const inCommon = filePath.includes("components/") && (filePath.includes("layout") || filePath.includes("ui") || filePath.includes("DataTable"));
  return inCommon ? "공통" : "페이지전용";
}

function extractStrings(content, filePath) {
  const results = [];
  const lines = content.split("\n");
  const tUsed = (line) => {
    T_PATTERN.lastIndex = 0;
    return T_PATTERN.test(line);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (tUsed(line)) continue;

    // placeholder
    let m = line.match(/placeholder\s*=\s*["']([^"']+)["']/);
    if (m && !line.includes("t(")) {
      const s = m[1];
      if (!shouldSkip(s)) results.push({ file: filePath, line: lineNum, str: s, type: "placeholder" });
    }

    // aria-label
    m = line.match(/aria-label\s*=\s*["']([^"']+)["']/);
    if (m && !line.includes("t(")) {
      const s = m[1];
      if (!shouldSkip(s)) results.push({ file: filePath, line: lineNum, str: s, type: "aria-label" });
    }

    // title (prop)
    m = line.match(/title\s*=\s*["']([^"']+)["']/);
    if (m && !line.includes("t(")) {
      const s = m[1];
      if (!shouldSkip(s)) results.push({ file: filePath, line: lineNum, str: s, type: "title" });
    }

    // label: "..." (table column, etc.)
    m = line.match(/label\s*:\s*["']([^"']+)["']/);
    if (m) {
      const s = m[1];
      if (!shouldSkip(s) && !/^[a-z]+\.[a-z.]+$/.test(s)) results.push({ file: filePath, line: lineNum, str: s, type: "label" });
    }

    // JSX text: >텍스트<
    const textMatch = line.match(/>\s*([^<{]+)\s*</);
    if (textMatch) {
      const raw = textMatch[1].trim();
      if (!raw.includes("{") && !raw.includes("}") && raw.length >= 2) {
        const hasLang = /[\uAC00-\uD7A3]/.test(raw) || /[a-zA-Z]{2,}/.test(raw);
        if (hasLang && !shouldSkip(raw)) results.push({ file: filePath, line: lineNum, str: raw, type: "jsx-text" });
      }
    }
  }

  return results;
}

function walkDir(dir, ext, files = []) {
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory()) {
        if (!["node_modules", ".git", "dist", ".next"].includes(e.name)) walkDir(full, ext, files);
      } else if (e.isFile() && (ext ? e.name.endsWith(ext) : true)) {
        files.push(full);
      }
    }
  } catch (_) {}
  return files;
}

function main() {
  let allFiles = [];
  for (const dir of SCAN_DIRS) {
    const base = join(ROOT, dir);
    if (existsSync(base)) {
      allFiles = allFiles.concat(walkDir(base, ".tsx"), walkDir(base, ".ts"));
    }
  }
  allFiles = allFiles.filter((f) => !f.includes("locales/") && !f.includes("strings.") && !f.includes("node_modules"));

  const seen = new Set();
  const results = [];

  for (const f of allFiles) {
    try {
      const content = readFileSync(f, "utf-8");
      const rel = f.replace(ROOT + "\\", "").replace(ROOT + "/", "").replace(/\\/g, "/");
      const extracted = extractStrings(content, rel);
      for (const r of extracted) {
        const key = `${r.file}:${r.line}:${r.str}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push(r);
        }
      }
    } catch (_) {}
  }

  // Top 80 우선 (발표 우선 페이지: planning, operation, context, leadership)
  const priority = (r) => {
    if (r.file.includes("planning") || r.file.includes("operation") || r.file.includes("context") || r.file.includes("leadership")) return 0;
    if (r.file.includes("performance") || r.file.includes("improvement") || r.file.includes("support")) return 1;
    if (r.file.includes("monitoring")) return 2;
    return 3;
  };
  results.sort((a, b) => priority(a) - priority(b) || a.file.localeCompare(b.file) || a.line - b.line);

  const top80 = results.slice(0, 80);

  let md = `# i18n 남은 문자열 스캔 결과\n\n`;
  md += `생성: ${new Date().toISOString()}\n\n`;
  md += `## 스캔 대상: ${allFiles.length}개 파일\n`;
  md += `## 탐지 항목: ${results.length}개 (Top 80 표시)\n\n`;
  md += `| 파일:라인 | 문자열 | 제안 key | 비고 |\n`;
  md += `|-----------|--------|----------|------|\n`;

  for (const r of top80) {
    const suggested = suggestKey(r.str, r.type, r.file);
    const note = getNote(r.str, r.type, r.file);
    const strDisplay = r.str.length > 60 ? r.str.slice(0, 60) + "…" : r.str;
    md += `| ${r.file}:${r.line} | ${strDisplay} | ${suggested} | ${note} |\n`;
  }

  if (results.length > 80) {
    md += `\n---\n\n## 잔여 ${results.length - 80}개 (전체 목록은 스캔 재실행 시 확인)\n`;
  }

  const outPath = join(ROOT, "docs", "i18n_remaining.md");
  writeFileSync(outPath, md, "utf-8");
  console.log(`✅ 스캔 완료: ${results.length}개 항목 (Top 80 보고) → ${outPath}`);
}

main();
