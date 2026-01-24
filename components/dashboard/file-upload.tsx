"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, X, Loader2 } from "lucide-react"

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

interface FileUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void
}

export function FileUpload({ onAnalysisComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [criteria, setCriteria] = useState({
    minTemp: 850,
    maxTemp: 950,
    minHoldTime: 30,
    minCoolingRate: 10,
    maxCoolingRate: 50,
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls") || droppedFile.name.endsWith(".csv"))) {
      setFile(droppedFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }, [])

  const removeFile = useCallback(() => {
    setFile(null)
  }, [])

  const analyzeData = useCallback(() => {
    if (!file) return

    setIsAnalyzing(true)

    // 시뮬레이션: 실제로는 파일을 파싱하고 분석해야 함
    setTimeout(() => {
      const sampleCount = Math.floor(Math.random() * 20) + 10
      const items: AnalysisResult["items"] = []

      for (let i = 0; i < sampleCount; i++) {
        const temp = criteria.minTemp + Math.random() * (criteria.maxTemp - criteria.minTemp + 50) - 25
        const holdTime = criteria.minHoldTime + Math.random() * 30 - 10
        const coolingRate = criteria.minCoolingRate + Math.random() * (criteria.maxCoolingRate - criteria.minCoolingRate + 20) - 10

        let status: "pass" | "fail" | "warning" = "pass"
        let reason: string | undefined

        if (temp < criteria.minTemp || temp > criteria.maxTemp) {
          status = "fail"
          reason = temp < criteria.minTemp ? "온도 미달" : "온도 초과"
        } else if (holdTime < criteria.minHoldTime) {
          status = "fail"
          reason = "유지시간 미달"
        } else if (coolingRate < criteria.minCoolingRate || coolingRate > criteria.maxCoolingRate) {
          status = coolingRate < criteria.minCoolingRate ? "warning" : "fail"
          reason = coolingRate < criteria.minCoolingRate ? "냉각속도 낮음" : "냉각속도 초과"
        }

        items.push({
          id: `sample-${i + 1}`,
          sampleId: `S${String(i + 1).padStart(3, "0")}`,
          temp: Math.round(temp * 10) / 10,
          holdTime: Math.round(holdTime * 10) / 10,
          coolingRate: Math.round(coolingRate * 10) / 10,
          status,
          reason,
        })
      }

      const passCount = items.filter((i) => i.status === "pass").length
      const failCount = items.filter((i) => i.status === "fail").length
      const warningCount = items.filter((i) => i.status === "warning").length

      let overallStatus: "pass" | "fail" | "warning" = "pass"
      if (failCount > 0) {
        overallStatus = "fail"
      } else if (warningCount > 0) {
        overallStatus = "warning"
      }

      const temps = items.map((i) => i.temp)
      const result: AnalysisResult = {
        id: Date.now().toString(),
        fileName: file.name,
        date: new Date().toISOString(),
        status: overallStatus,
        summary: {
          totalSamples: sampleCount,
          passCount,
          failCount,
          warningCount,
        },
        details: {
          maxTemp: Math.max(...temps),
          minTemp: Math.min(...temps),
          avgTemp: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
          holdTime: Math.round(items.reduce((a, b) => a + b.holdTime, 0) / items.length * 10) / 10,
          coolingRate: Math.round(items.reduce((a, b) => a + b.coolingRate, 0) / items.length * 10) / 10,
        },
        items,
      }

      setIsAnalyzing(false)
      setFile(null)
      onAnalysisComplete(result)
    }, 2000)
  }, [file, criteria, onAnalysisComplete])

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 파일 업로드 영역 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>열처리 데이터 업로드</CardTitle>
          <CardDescription>
            엑셀(.xlsx, .xls) 또는 CSV 파일을 업로드하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            {file ? (
              <div className="flex items-center gap-3 rounded-lg bg-muted px-4 py-3">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="ml-2 rounded-full p-1 hover:bg-background"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 font-medium text-foreground">
                  파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-sm text-muted-foreground">
                  xlsx, xls, csv 파일 지원
                </p>
              </>
            )}
          </div>

          <Button
            onClick={analyzeData}
            disabled={!file || isAnalyzing}
            className="mt-4 w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                분석 중...
              </>
            ) : (
              "분석 시작"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 판정 기준 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>판정 기준 설정</CardTitle>
          <CardDescription>
            열처리 합불 판정 기준을 설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>온도 범위 (°C)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={criteria.minTemp}
                onChange={(e) =>
                  setCriteria({ ...criteria, minTemp: Number(e.target.value) })
                }
                className="w-full"
              />
              <span className="text-muted-foreground">~</span>
              <Input
                type="number"
                value={criteria.maxTemp}
                onChange={(e) =>
                  setCriteria({ ...criteria, maxTemp: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>최소 유지시간 (분)</Label>
            <Input
              type="number"
              value={criteria.minHoldTime}
              onChange={(e) =>
                setCriteria({ ...criteria, minHoldTime: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>냉각속도 범위 (°C/s)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={criteria.minCoolingRate}
                onChange={(e) =>
                  setCriteria({ ...criteria, minCoolingRate: Number(e.target.value) })
                }
                className="w-full"
              />
              <span className="text-muted-foreground">~</span>
              <Input
                type="number"
                value={criteria.maxCoolingRate}
                onChange={(e) =>
                  setCriteria({ ...criteria, maxCoolingRate: Number(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">판정 기준 안내</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>온도 범위 이탈: 불합격</li>
              <li>유지시간 미달: 불합격</li>
              <li>냉각속도 미달: 경고</li>
              <li>냉각속도 초과: 불합격</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
