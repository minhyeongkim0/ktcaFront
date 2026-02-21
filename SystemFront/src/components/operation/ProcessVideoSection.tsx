"use client";

import { useState } from "react";
import { SectionCard } from "@/components/ui/SectionCard";

export interface ProcessVideoSectionProps {
  title?: string;
  src?: string;
  description?: string;
  bullets?: string[];
}

const DEFAULT_TITLE = "공정 영상";
const DEFAULT_SRC = "/media/flow_video.mp4";
const DEFAULT_DESCRIPTION =
  "공정 흐름(원자재 → 전공정 → 패키징/테스트 → 완제품) 전 구간을 요약한 데모 영상입니다. MES 운용 탭의 공정흐름도와 동일한 순서로 구성되어 추적성과 교육 효율을 높입니다.";
const DEFAULT_BULLETS = [
  "설비 단계별 흐름 이해",
  "이상 발생 지점(공정 단계) 식별 보조",
  "신규 인력 교육/감사 대응 자료로 활용",
];

export function ProcessVideoSection({
  title = DEFAULT_TITLE,
  src = DEFAULT_SRC,
  description = DEFAULT_DESCRIPTION,
  bullets = DEFAULT_BULLETS,
}: ProcessVideoSectionProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <SectionCard
      title={title}
      icon={<span className="material-symbols-outlined text-[#137fec] text-xl">videocam</span>}
      badge={
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#137fec]/10 text-[#137fec] dark:bg-[#137fec]/20 dark:text-[#60a5fa]">
            Operation
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            Traceability
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
            ISO Annex SL
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 영상: 데스크탑 2/3, 모바일 전체 */}
        <div className="lg:col-span-2">
          <div className="relative w-full aspect-video rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-sm overflow-hidden">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl text-slate-400">error_outline</span>
                <p className="text-sm font-medium text-center">영상 파일을 불러올 수 없습니다.</p>
                <p className="text-xs text-center">경로를 확인하거나 네트워크 상태를 점검해 주세요.</p>
              </div>
            ) : (
              <>
                {!loaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
                    <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">play_circle</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">로딩 중...</p>
                  </div>
                )}
                <video
                  className="w-full h-full object-contain rounded-2xl"
                  src={src}
                  controls
                  preload="metadata"
                  playsInline
                  aria-label={title}
                  onLoadedData={() => setLoaded(true)}
                  onCanPlay={() => setLoaded(true)}
                  onError={() => setError(true)}
                />
              </>
            )}
          </div>
        </div>

        {/* 설명 + 하이라이트: 데스크탑 1/3 */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">키 포인트</p>
            <ul className="space-y-2">
              {bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[#137fec] text-lg shrink-0 mt-0.5">check_circle</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
