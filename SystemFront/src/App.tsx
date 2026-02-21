import { useEffect, useState } from "react";
import { dummyData, getSideMenuItems } from "@/data/dummyData";
import type { TopTabKey } from "@/components/layout/TopTabs";
import { Header } from "@/components/layout/Header";
import { TopTabs } from "@/components/layout/TopTabs";
import { SideNav } from "@/components/layout/SideNav";
import { LoginView } from "@/components/views/LoginView";
import { ContextPage } from "@/components/context/ContextPage";
import { LeadershipView } from "@/components/views/LeadershipView";
import { PlanningView } from "@/components/views/PlanningView";
import { SupportView } from "@/components/views/SupportView";
import { OperationView } from "@/components/views/OperationView";
import { PerformanceView } from "@/components/views/PerformanceView";
import { ImprovementView } from "@/components/views/ImprovementView";

type User = { id: string; name: string; role: string } | null;

export default function App() {
  const [user, setUser] = useState<User>(null);
  const [loginError, setLoginError] = useState("");
  const [selectedTopTab, setSelectedTopTab] = useState<TopTabKey>("context");
  const [selectedSideTab, setSelectedSideTab] = useState<string | null>(null);
  const [nowKst, setNowKst] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNowKst(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const sideItems = getSideMenuItems(selectedTopTab);
  const hasSideNav = sideItems.length > 0;
  const effectiveSideTab = hasSideNav && selectedSideTab && sideItems.some((s) => s.id === selectedSideTab)
    ? selectedSideTab
    : sideItems[0]?.id ?? null;

  useEffect(() => {
    setSelectedSideTab(effectiveSideTab);
  }, [selectedTopTab, effectiveSideTab]);

  const handleLogin = (id: string, password: string) => {
    setLoginError("");
    const account = dummyData.accounts.find((a) => a.id === id && a.password === password);
    if (account) {
      setUser({ id: account.id, name: account.name, role: account.role });
    } else {
      setLoginError("ID 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const renderContent = () => {
    if (!user) return null;
    switch (selectedTopTab) {
      case "context":
        return <ContextPage selectedSideTab={effectiveSideTab} />;
      case "leadership":
        return <LeadershipView />;
      case "planning":
        return <PlanningView selectedSideTab={effectiveSideTab} />;
      case "support":
        return <SupportView selectedSideTab={effectiveSideTab} />;
      case "operation":
        return <OperationView selectedSideTab={effectiveSideTab} />;
      case "performance":
        return <PerformanceView selectedSideTab={effectiveSideTab} />;
      case "improvement":
        return <ImprovementView selectedSideTab={effectiveSideTab} />;
      default:
        return <WelcomeContent />;
    }
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[var(--background)]">
      <Header user={user} nowKst={nowKst} />
      <TopTabs selected={selectedTopTab} onSelect={setSelectedTopTab} />
      <div className="flex flex-1 min-h-0">
        {hasSideNav ? (
          <SideNav
            items={sideItems}
            selected={effectiveSideTab}
            onSelect={setSelectedSideTab}
          />
        ) : (
          <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Menu</p>
            <p className="mt-4 text-sm text-slate-400">No menu for this tab.</p>
          </aside>
        )}
        <main className="flex-1 overflow-auto bg-slate-50/50 p-6">
          {renderContent() ?? <WelcomeContent />}
        </main>
      </div>
    </div>
  );
}

function WelcomeContent() {
  const branding = dummyData.branding;
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-3xl font-bold text-slate-800">MES Dashboard</h2>
      <p className="mt-2 text-slate-500">상단 탭을 선택하여 메뉴를 이용하세요.</p>
      {branding?.logoWatermark && (
        <div className="mt-8 opacity-20">
          <img src={branding.logoWatermark} alt="" className="h-32 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
      )}
    </div>
  );
}
