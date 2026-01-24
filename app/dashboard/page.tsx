"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Zap,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  User as UserIcon,
  LogOut,
  ChevronDown,
  AlertTriangle,
} from "lucide-react"
import { FileUpload } from "@/components/dashboard/file-upload"
import { AnalysisResults } from "@/components/dashboard/analysis-results"
import { AnalysisHistory } from "@/components/dashboard/analysis-history"

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

interface UserData {
  name: string
  company: string
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [activeTab, setActiveTab] = useState<"upload" | "results" | "history">("upload")
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("heatcheck_current_user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // 비로그인 사용자는 게스트로 서비스 이용
      setUser({
        name: "게스트",
        company: "",
        email: "guest@heatcheck.com"
      })
    }

    // 분석 이력 불러오기
    const history = localStorage.getItem("heatcheck_analysis_history")
    if (history) {
      setAnalysisHistory(JSON.parse(history))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("heatcheck_current_user")
    router.push("/")
  }

  const handleAnalysisComplete = useCallback((result: AnalysisResult) => {
    setCurrentAnalysis(result)
    setActiveTab("results")

    // 이력에 추가
    const history = JSON.parse(localStorage.getItem("heatcheck_analysis_history") || "[]")
    const newHistory = [result, ...history].slice(0, 50) // 최대 50개 보관
    localStorage.setItem("heatcheck_analysis_history", JSON.stringify(newHistory))
    setAnalysisHistory(newHistory)
  }, [])

  const handleViewHistory = useCallback((result: AnalysisResult) => {
    setCurrentAnalysis(result)
    setActiveTab("results")
  }, [])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    )
  }

  // 통계 계산
  const totalAnalyses = analysisHistory.length
  const passCount = analysisHistory.filter((a) => a.status === "pass").length
  const failCount = analysisHistory.filter((a) => a.status === "fail").length
  const passRate = totalAnalyses > 0 ? Math.round((passCount / totalAnalyses) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HeatCheck</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <UserIcon className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden md:inline">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                {user.company && <p className="text-xs text-muted-foreground">{user.company}</p>}
              </div>
              <DropdownMenuSeparator />
              {user.name === "게스트" ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <UserIcon className="mr-2 h-4 w-4" />
                      로그인
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">
                      <UserIcon className="mr-2 h-4 w-4" />
                      회원가입
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  로그아웃
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileSpreadsheet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalAnalyses}</p>
                <p className="text-sm text-muted-foreground">총 분석 횟수</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passCount}</p>
                <p className="text-sm text-muted-foreground">합격</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failCount}</p>
                <p className="text-sm text-muted-foreground">불합격</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <BarChart3 className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passRate}%</p>
                <p className="text-sm text-muted-foreground">합격률</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 border-b border-border">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Upload className="h-4 w-4" />
            데이터 업로드
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "results"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            분석 결과
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            분석 이력
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "upload" && (
          <FileUpload onAnalysisComplete={handleAnalysisComplete} />
        )}

        {activeTab === "results" && (
          currentAnalysis ? (
            <AnalysisResults result={currentAnalysis} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
                <CardTitle className="mb-2">분석 결과가 없습니다</CardTitle>
                <CardDescription>
                  데이터를 업로드하여 열처리 분석을 시작하세요.
                </CardDescription>
                <Button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4"
                >
                  데이터 업로드
                </Button>
              </CardContent>
            </Card>
          )
        )}

        {activeTab === "history" && (
          <AnalysisHistory
            history={analysisHistory}
            onViewResult={handleViewHistory}
          />
        )}
      </main>
    </div>
  )
}
