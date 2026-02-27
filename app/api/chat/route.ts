import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("KEY CHECK:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "존재함" : "비어있음");

/** 무료 티어용 모델명. 404 시 순서대로: gemini-2.0-flash → v1 + gemini-pro 시도 */
const GEMINI_MODEL = "gemini-2.0-flash";

/** 챗봇이 참고할 KPI 데이터 (FDC 보고서/KPI와 동기화) */
const REPORT_KPI_ROWS = [
  { label: "가동률", value: "94.2%", valueNum: 94.2, targetNum: 95, higherIsBetter: true, note: "목표 95%" },
  { label: "이상률", value: "1.2%", valueNum: 1.2, targetNum: 2, higherIsBetter: false, note: "목표 2% 이하" },
  { label: "MTBF", value: "72h", valueNum: 72, targetNum: 70, higherIsBetter: true, note: "목표 70h" },
  { label: "MTTR", value: "1.2h", valueNum: 1.2, targetNum: 1.5, higherIsBetter: false, note: "목표 1.5h 이하" },
  { label: "OEE", value: "78%", valueNum: 78, targetNum: 80, higherIsBetter: true, note: "목표 80%" },
  { label: "알람 건수", value: "12건", note: "미조치 3건" },
  { label: "조치 완료", value: "8건", note: "-" },
];

/** 장비별 조치 이력 (마지막 점검 등 질문 시 참고) */
const ACTION_HISTORY: Record<string, { date: string; action: string }[]> = {
  "AGV-01": [
    { date: "2025-01-28", action: "CT1 접점 점검 및 정리" },
    { date: "2024-12-10", action: "모터 쿨링팬 교체" },
  ],
  "AGV-02": [
    { date: "2025-02-12", action: "베어링 교체" },
    { date: "2024-11-05", action: "축 정렬 및 볼트 체결" },
  ],
  "AGV-03": [
    { date: "2025-02-14", action: "온도 센서 교정 및 로그 확인" },
    { date: "2025-01-15", action: "냉각팬 교체" },
  ],
  "AGV-05": [
    { date: "2025-02-10", action: "센서 교정" },
  ],
};

/** 장비별 고장 이력 (마지막 점검/고장 문의 시 참고) */
const FAILURE_HISTORY: Record<string, { date: string; failureType: string; description: string }[]> = {
  "AGV-01": [
    { date: "2025-02-14", failureType: "전류 임계", description: "CT2 전류 임계 초과" },
    { date: "2025-01-28", failureType: "전류 임계", description: "CT1 전류 순간 상승" },
    { date: "2024-12-10", failureType: "온도", description: "모터 온도 상승" },
  ],
  "AGV-02": [
    { date: "2025-02-12", failureType: "진동", description: "베어링 마모 추정" },
    { date: "2024-11-05", failureType: "진동", description: "이상 진동 감지" },
  ],
  "AGV-03": [
    { date: "2025-02-14", failureType: "온도 이상", description: "온도 일시 상승" },
    { date: "2025-01-15", failureType: "온도 이상", description: "냉각팬 응답 지연" },
  ],
  "AGV-05": [
    { date: "2025-02-10", failureType: "센서", description: "센서 오차 발생" },
  ],
};

/** 표준 조치 절차(SOP) — FDC 코드베이스와 동기화 */
const SOP_BY_FAILURE_TYPE: Record<string, { title: string; steps: string[] }> = {
  "전류 임계": {
    title: "전류 임계 초과 시 표준 조치 절차(SOP)",
    steps: [
      "1. 해당 설비 즉시 감속 또는 정지 후 전원 확인",
      "2. 전류계·접점 상태 점검 및 과부하 원인 기록",
      "3. 부하 원인 제거 후 저부하로 재기동하여 확인",
      "4. 동일 재발 시 부품(접점/케이블) 교체 검토 및 조치 이력 연계",
    ],
  },
  "온도 이상": {
    title: "온도 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 설비 가동 중단 및 환기/냉각 상태 확인",
      "2. 온도 센서·냉각팬·필터 점검 및 이력 확인",
      "3. 원인 제거 후 서서히 재기동, 온도 추이 모니터링",
      "4. 재발 시 냉각 시스템 또는 부품 교체 및 재발 방지 대책 등록",
    ],
  },
  진동: {
    title: "진동 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 설비 정지 후 육안·청각 점검(이물, 풀림, 마모)",
      "2. 베어링·커플링·볼트 체결 상태 점검 및 진동치 기록",
      "3. 이상 부품 교체 또는 조정 후 무부하→유부하 순차 시운전",
      "4. 조치 내용·재발 방지 대책을 조치 이력(개선/조치 탭)에 기록",
    ],
  },
  온도: {
    title: "온도 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 설비 가동 중단 및 환기/냉각 상태 확인",
      "2. 온도 센서·냉각팬·필터 점검 및 이력 확인",
      "3. 원인 제거 후 서서히 재기동, 온도 추이 모니터링",
      "4. 재발 시 냉각 시스템 또는 부품 교체 및 재발 방지 대책 등록",
    ],
  },
  센서: {
    title: "센서 이상 시 표준 조치 절차(SOP)",
    steps: [
      "1. 해당 센서 신호값·배선·접촉 상태 점검",
      "2. 교정 가능 여부 확인 후 교정 또는 임시 우회 절차 적용",
      "3. 교정/교체 후 기준치 대비 검증 및 이력 기록",
      "4. 동일 유형 재발 시 설비/센서 교체 검토 및 개선/조치 탭에 재발 방지 대책 기록",
    ],
  },
};

const DEFAULT_SOP = {
  title: "기타 고장 유형 표준 조치 절차(SOP)",
  steps: [
    "1. 설비 안전 정지",
    "2. 현상 및 원인 기록",
    "3. 점검·조치 후 시운전",
    "4. 조치 이력 및 재발 방지 대책 등록(개선/조치 탭)",
  ],
};

function buildSystemPrompt(): string {
  const sopText = Object.entries(SOP_BY_FAILURE_TYPE)
    .map(
      ([type, { title, steps }]) =>
        `[${type}]\n${title}\n${steps.map((s) => `  ${s}`).join("\n")}`
    )
    .join("\n\n");
  const defaultSopText = `${DEFAULT_SOP.title}\n${DEFAULT_SOP.steps.map((s) => `  ${s}`).join("\n")}`;

  const kpiText = REPORT_KPI_ROWS.map(
    (r) => `- ${r.label}: ${r.value} (${r.note})`
  ).join("\n");

  const actionHistoryText = Object.entries(ACTION_HISTORY)
    .map(
      ([equipment, items]) =>
        `[${equipment}]\n${items.map((i) => `  ${i.date}: ${i.action}`).join("\n")}`
    )
    .join("\n\n");

  const failureHistoryText = Object.entries(FAILURE_HISTORY)
    .map(
      ([equipment, items]) =>
        `[${equipment}]\n${items.map((i) => `  ${i.date} ${i.failureType}: ${i.description}`).join("\n")}`
    )
    .join("\n\n");

  return `너는 현장 작업자를 돕는 베테랑 선임이야. 말투는 친절하고 든든하게 해 줘.

## 역할
- 사용자가 설비보전·고장·안전·가동률 등에 대해 물으면, 아래 SOP(표준 조치 절차)를 참고해서 쉽고 친절하게 답해 줘.
- "오늘 가동률", "가동률이 왜 낮아", "마지막 점검", "이 장비 점검" 등 질문이 오면 반드시 아래 [KPI 데이터]와 [조치 이력], [고장 이력]을 참고해서 구체적인 숫자와 일자를 들어 답해 줘.
- 전류 임계, 온도 이상, 진동, 센서 등 고장 유형별로 물으면 해당 SOP를 기반으로 단계별로 안내해 줘.

## KPI 데이터 (가동률·OEE·MTBF 등 질문 시 이 값을 사용할 것)
${kpiText}

## 장비별 조치 이력 (마지막 점검/조치 일자 질문 시 참고)
${actionHistoryText}

## 장비별 고장 이력 (마지막 고장/점검 질문 시 참고)
${failureHistoryText}

## 고장 유형별 SOP (반드시 이 내용을 기준으로 답변할 것)
${sopText}

## 기타 고장 시 공통 SOP
${defaultSopText}

## 톤
- 선배가 후배에게 말해 주는 것처럼 친절하고 든든하게.`;
}

export async function POST(request: NextRequest) {
  console.log("KEY CHECK:", process.env.GOOGLE_GENERATIVE_AI_API_KEY ? "존재함" : "비어있음");
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey || typeof apiKey !== "string" || apiKey.trim() === "") {
    console.error("❌ API 키를 찾을 수 없습니다");
    return NextResponse.json(
      { error: "API 키가 설정되지 않았습니다. .env.local에 GOOGLE_GENERATIVE_AI_API_KEY를 추가해 주세요." },
      { status: 500 }
    );
  }

  let body: unknown = null;
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error("[Chat API] request.json() 실패:", {
      error: parseErr instanceof Error ? parseErr.message : String(parseErr),
      stack: parseErr instanceof Error ? parseErr.stack : undefined,
    });
    return NextResponse.json(
      { error: "요청 본문을 읽을 수 없습니다." },
      { status: 400 }
    );
  }

  const { messages } = (body ?? {}) as { messages?: { role: string; content: string }[] };

  if (!Array.isArray(messages) || messages.length === 0) {
    console.error("[Chat API] 요청 오류: messages 배열이 없거나 비어 있음.", {
      bodyKeys: Object.keys((body as object) ?? {}),
      messagesType: typeof messages,
      messagesLength: Array.isArray(messages) ? messages.length : "not array",
    });
    return NextResponse.json(
      { error: "messages 배열이 필요합니다." },
      { status: 400 }
    );
  }

  const lastUserContent = messages[messages.length - 1]?.content ?? "";
  const errorMessageToSend = (e: unknown): string =>
    e instanceof Error ? e.message : String(e);

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: buildSystemPrompt(),
    });

    const history = messages.slice(0, -1).map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserContent);
    const response = result.response;

    if (!response || !response.text) {
      const detail = "Gemini response.text 없음";
      console.error("[Chat API]", detail, {
        hasResponse: !!result.response,
        responseKeys: result.response ? Object.keys(result.response) : [],
        raw: JSON.stringify(result).slice(0, 800),
      });
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    const text = response.text();
    if (typeof text !== "string" || !text.trim()) {
      const detail = "Gemini 응답 텍스트 비어 있음";
      console.error("[Chat API]", detail, {
        textType: typeof text,
        textLength: typeof text === "string" ? text.length : 0,
      });
      return NextResponse.json({ error: detail }, { status: 502 });
    }

    return NextResponse.json({ content: text });
  } catch (e: unknown) {
    const err = e as Error & { status?: number; statusText?: string; cause?: unknown };
    const msg = String(err?.message ?? e).toLowerCase();

    console.error("[Chat API] 예외:", {
      message: err?.message,
      name: err?.name,
      stack: err?.stack,
      cause: err?.cause,
      full: String(e),
    });

    if (
      msg.includes("resource exhausted") ||
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("rate limit")
    ) {
      return NextResponse.json(
        { error: errorMessageToSend(e) },
        { status: 429 }
      );
    }

    if (
      msg.includes("api key") ||
      msg.includes("invalid") ||
      msg.includes("invalid_api_key") ||
      msg.includes("401") ||
      msg.includes("403") ||
      msg.includes("permission") ||
      msg.includes("forbidden")
    ) {
      return NextResponse.json(
        { error: errorMessageToSend(e) },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: errorMessageToSend(e) },
      { status: 500 }
    );
  }
}
