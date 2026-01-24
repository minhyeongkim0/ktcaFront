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
import { CheckCircle, XCircle, AlertTriangle, Eye, FileSpreadsheet } from "lucide-react"

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

interface AnalysisHistoryProps {
  history: AnalysisResult[]
  onViewResult: (result: AnalysisResult) => void
}

export function AnalysisHistory({ history, onViewResult }: AnalysisHistoryProps) {
  const statusConfig = {
    pass: {
      label: "합격",
      icon: CheckCircle,
      bgLight: "bg-success/10",
      textColor: "text-success",
    },
    fail: {
      label: "불합격",
      icon: XCircle,
      bgLight: "bg-destructive/10",
      textColor: "text-destructive",
    },
    warning: {
      label: "경고",
      icon: AlertTriangle,
      bgLight: "bg-warning/10",
      textColor: "text-warning",
    },
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground" />
          <CardTitle className="mb-2">분석 이력이 없습니다</CardTitle>
          <CardDescription>
            열처리 데이터를 업로드하면 분석 이력이 여기에 표시됩니다.
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>분석 이력</CardTitle>
        <CardDescription>
          최근 분석한 열처리 데이터 목록입니다. 최대 50건까지 보관됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>파일명</TableHead>
                <TableHead>분석일시</TableHead>
                <TableHead className="text-center">샘플 수</TableHead>
                <TableHead className="text-center">합격</TableHead>
                <TableHead className="text-center">불합격</TableHead>
                <TableHead className="text-center">판정</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((result) => {
                const config = statusConfig[result.status]
                return (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        {result.fileName}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(result.date).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.summary.totalSamples}
                    </TableCell>
                    <TableCell className="text-center text-success">
                      {result.summary.passCount}
                    </TableCell>
                    <TableCell className="text-center text-destructive">
                      {result.summary.failCount}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={`${config.bgLight} ${config.textColor}`}
                      >
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewResult(result)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        보기
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
