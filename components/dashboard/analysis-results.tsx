"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Thermometer,
  Clock,
  TrendingDown,
} from "lucide-react"

interface AnalysisResult {
  id: string
  fileName: string
  date: string
  status: "pass" | "fail" | "warning"
  summary: {
    totalSamples: number
    passCount: number
    failCount: number
    warningCount: number
  }
  details: {
    maxTemp: number
    minTemp: number
    avgTemp: number
    holdTime: number
    coolingRate: number
  }
  items: Array<{
    id: string
    sampleId: string
    temp: number
    holdTime: number
    coolingRate: number
    status: "pass" | "fail" | "warning"
    reason?: string
  }>
}

interface AnalysisResultsProps {
  result: AnalysisResult
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const statusConfig = {
    pass: {
      label: "합격",
      icon: CheckCircle,
      color: "bg-success text-success-foreground",
      bgLight: "bg-success/10",
      textColor: "text-success",
    },
    fail: {
      label: "불합격",
      icon: XCircle,
      color: "bg-destructive text-destructive-foreground",
      bgLight: "bg-destructive/10",
      textColor: "text-destructive",
    },
    warning: {
      label: "경고",
      icon: AlertTriangle,
      color: "bg-warning text-warning-foreground",
      bgLight: "bg-warning/10",
      textColor: "text-warning",
    },
  }

  const config = statusConfig[result.status]
  const StatusIcon = config.icon

  const handleDownloadReport = () => {
    // 간단한 텍스트 리포트 생성
    const report = `
열처리 합불 판정 리포트
========================

파일명: ${result.fileName}
분석일시: ${new Date(result.date).toLocaleString("ko-KR")}

[판정 결과: ${config.label}]

=== 요약 ===
총 샘플 수: ${result.summary.totalSamples}
합격: ${result.summary.passCount}
불합격: ${result.summary.failCount}
경고: ${result.summary.warningCount}

=== 분석 상세 ===
최고 온도: ${result.details.maxTemp}°C
최저 온도: ${result.details.minTemp}°C
평균 온도: ${result.details.avgTemp}°C
평균 유지시간: ${result.details.holdTime}분
평균 냉각속도: ${result.details.coolingRate}°C/s

=== 샘플별 결과 ===
${result.items.map((item) => `
${item.sampleId}: ${item.status === "pass" ? "합격" : item.status === "fail" ? "불합격" : "경고"}
  - 온도: ${item.temp}°C
  - 유지시간: ${item.holdTime}분
  - 냉각속도: ${item.coolingRate}°C/s
  ${item.reason ? `- 사유: ${item.reason}` : ""}
`).join("")}

========================
HeatCheck - 열처리 품질 판정 시스템
    `.trim()

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `열처리분석리포트_${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 판정 결과 헤더 */}
      <Card className={config.bgLight}>
        <CardContent className="flex flex-col items-center justify-between gap-4 p-6 md:flex-row">
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-3 ${config.color}`}>
              <StatusIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                최종 판정: {config.label}
              </h2>
              <p className="text-muted-foreground">
                {result.fileName} | {new Date(result.date).toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
          <Button onClick={handleDownloadReport}>
            <Download className="mr-2 h-4 w-4" />
            리포트 다운로드
          </Button>
        </CardContent>
      </Card>

      {/* 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-foreground">
              {result.summary.totalSamples}
            </p>
            <p className="text-sm text-muted-foreground">총 샘플</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">
              {result.summary.passCount}
            </p>
            <p className="text-sm text-muted-foreground">합격</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-destructive">
              {result.summary.failCount}
            </p>
            <p className="text-sm text-muted-foreground">불합격</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">
              {result.summary.warningCount}
            </p>
            <p className="text-sm text-muted-foreground">경고</p>
          </CardContent>
        </Card>
      </div>

      {/* 분석 상세 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">온도 분석</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">최고 온도</span>
              <span className="font-medium">{result.details.maxTemp}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최저 온도</span>
              <span className="font-medium">{result.details.minTemp}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">평균 온도</span>
              <span className="font-medium">{result.details.avgTemp}°C</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">유지시간</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span className="text-muted-foreground">평균 유지시간</span>
              <span className="font-medium">{result.details.holdTime}분</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">냉각속도</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <span className="text-muted-foreground">평균 냉각속도</span>
              <span className="font-medium">{result.details.coolingRate}°C/s</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 샘플별 결과 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>샘플별 상세 결과</CardTitle>
          <CardDescription>
            각 샘플의 측정값과 판정 결과입니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>샘플 ID</TableHead>
                  <TableHead className="text-right">온도 (°C)</TableHead>
                  <TableHead className="text-right">유지시간 (분)</TableHead>
                  <TableHead className="text-right">냉각속도 (°C/s)</TableHead>
                  <TableHead className="text-center">판정</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.items.map((item) => {
                  const itemConfig = statusConfig[item.status]
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.sampleId}</TableCell>
                      <TableCell className="text-right">{item.temp}</TableCell>
                      <TableCell className="text-right">{item.holdTime}</TableCell>
                      <TableCell className="text-right">{item.coolingRate}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="secondary"
                          className={`${itemConfig.bgLight} ${itemConfig.textColor}`}
                        >
                          {itemConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.reason || "-"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
