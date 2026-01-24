import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, FileSpreadsheet, BarChart3, Shield, Clock, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">HeatCheck</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              기능
            </Link>
            <Link href="#process" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              프로세스
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              도입효과
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                로그인
              </Button>
            </Link>
<Link href="/dashboard">
                <Button size="sm">
                  무료 시작하기
                </Button>
              </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              제조 품질관리의 새로운 기준
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              열처리 합불 판정을
              <br />
              <span className="text-primary">자동화</span>하세요
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              엑셀 데이터를 업로드하면 AI가 열처리 공정 데이터를 분석하여 
              합격/불합격을 즉시 판정하고 상세 리포트를 제공합니다.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base">
                  무료로 시작하기
                </Button>
              </Link>
              <Link href="#process">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent">
                  작동 방식 보기
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { value: "99.2%", label: "판정 정확도" },
              { value: "3초", label: "분석 소요시간" },
              { value: "500+", label: "도입 기업" },
              { value: "24/7", label: "서비스 가동" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <div className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              핵심 기능
            </h2>
            <p className="text-muted-foreground">
              복잡한 열처리 데이터 분석을 단순화하고 품질관리를 혁신합니다.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileSpreadsheet,
                title: "엑셀 데이터 업로드",
                description: "기존에 사용하던 엑셀 파일을 그대로 업로드하세요. 추가 변환 작업이 필요 없습니다."
              },
              {
                icon: BarChart3,
                title: "실시간 데이터 분석",
                description: "온도, 시간, 냉각 속도 등 핵심 파라미터를 자동으로 분석합니다."
              },
              {
                icon: CheckCircle,
                title: "합불 자동 판정",
                description: "설정된 기준에 따라 합격/불합격을 즉시 판정하고 결과를 제공합니다."
              },
              {
                icon: BarChart3,
                title: "상세 리포트",
                description: "판정 근거와 함께 시각화된 분석 리포트를 PDF로 다운로드하세요."
              },
              {
                icon: Clock,
                title: "이력 관리",
                description: "모든 분석 기록이 저장되어 품질 추적 및 감사에 활용할 수 있습니다."
              },
              {
                icon: Shield,
                title: "보안 및 규정 준수",
                description: "기업 데이터는 암호화되어 안전하게 보관되며 ISO 규정을 준수합니다."
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border bg-card transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              간단한 3단계 프로세스
            </h2>
            <p className="text-muted-foreground">
              복잡한 설정 없이 바로 사용할 수 있습니다.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "데이터 업로드",
                description: "열처리 공정 데이터가 담긴 엑셀 파일을 드래그 앤 드롭으로 업로드합니다."
              },
              {
                step: "02",
                title: "자동 분석",
                description: "시스템이 온도 프로파일, 유지 시간, 냉각 속도 등을 자동으로 분석합니다."
              },
              {
                step: "03",
                title: "결과 확인",
                description: "합불 판정 결과와 상세 분석 리포트를 즉시 확인하고 다운로드합니다."
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                {index < 2 && (
                  <div className="absolute left-1/2 top-8 hidden h-0.5 w-full bg-border md:block" />
                )}
                <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="border-t border-border bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                도입 효과
              </h2>
              <p className="mb-8 text-muted-foreground">
                HeatCheck를 도입한 기업들은 평균적으로 다음과 같은 효과를 경험했습니다.
              </p>
              <ul className="space-y-4">
                {[
                  "품질 검사 시간 80% 단축",
                  "불량률 35% 감소",
                  "품질 관련 클레임 60% 감소",
                  "검사 인력 비용 50% 절감",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success">
                      <CheckCircle className="h-4 w-4 text-success-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <blockquote className="space-y-4">
                <p className="text-lg leading-relaxed text-foreground">
                  "HeatCheck 도입 후 품질 검사에 소요되는 시간이 획기적으로 줄었고, 
                  판정의 일관성도 크게 향상되었습니다. 이제 엔지니어들이 더 가치 있는 
                  업무에 집중할 수 있게 되었습니다."
                </p>
                <footer>
                  <div className="font-semibold text-foreground">김철수 품질관리 팀장</div>
                  <div className="text-sm text-muted-foreground">A사 자동차부품 제조</div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
              지금 바로 열처리 품질관리를 혁신하세요
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              14일 무료 체험으로 HeatCheck의 모든 기능을 경험해보세요.
              신용카드 정보 없이 시작할 수 있습니다.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                무료 체험 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">HeatCheck</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">이용약관</Link>
              <Link href="#" className="hover:text-foreground">개인정보처리방침</Link>
              <Link href="#" className="hover:text-foreground">고객지원</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 HeatCheck. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
