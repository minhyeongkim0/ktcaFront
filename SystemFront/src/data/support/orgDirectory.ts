/**
 * 조직 디렉터리(Organization Directory) 데이터
 * 기존 조직도(orgChart) 데이터를 people 배열로 변환하여 표/필터용으로 사용
 */

import { orgChartData } from "./orgChart";

export type RaciRole = "R" | "A" | "C" | "I";

export interface PersonRaci {
  /** Annex SL 맥락별 RACI (예: planning, operation, support 등) */
  planning?: RaciRole;
  operation?: RaciRole;
  support?: RaciRole;
  performance?: RaciRole;
  improvement?: RaciRole;
  /** 요약: 대표 1~2개 (예: "P:R, O:C") */
  summary?: string;
}

export interface OrgDirectoryPerson {
  id: string;
  name: string;
  title: string;
  department: string;
  team?: string;
  tenureYears: number;
  phone: string;
  email: string;
  isCeo?: boolean;
  raci?: PersonRaci;
  /** 담당 업무 요약 (1~2줄) */
  roleSummary?: string;
}

/** 부서별 그룹화용 순서 */
export const DEPARTMENT_ORDER = ["CEO", "연구개발", "구매", "생산", "품질관리"] as const;

function raciSummary(raci: PersonRaci | undefined): string {
  if (!raci?.summary) return "";
  return raci.summary;
}

/**
 * 기존 orgChart 데이터를 디렉터리용 people 배열로 변환
 */
function buildPeopleFromOrgChart(): OrgDirectoryPerson[] {
  const people: OrgDirectoryPerson[] = [];
  const { ceo, departments } = orgChartData;

  people.push({
    id: ceo.id,
    name: ceo.name,
    title: ceo.title,
    department: "CEO",
    tenureYears: ceo.tenureYears,
    phone: ceo.phone,
    email: ceo.email,
    isCeo: true,
    raci: { summary: "A" },
    roleSummary: "전사 경영 및 의사결정",
  });

  departments.forEach((dept) => {
    dept.employees.forEach((emp) => {
      const isTeamLeader = emp.title === "팀장";
      people.push({
        id: emp.id,
        name: emp.name,
        title: emp.title,
        department: dept.nameKo,
        tenureYears: emp.tenureYears,
        phone: emp.phone,
        email: emp.email,
        raci: {
          planning: isTeamLeader ? "A" : "C",
          operation: isTeamLeader ? "R" : "R",
          summary: isTeamLeader ? "P:A, O:R" : "P:C, O:R",
        },
        roleSummary: dept.roleSummary,
      });
    });
  });

  return people;
}

export const orgDirectoryPeople = buildPeopleFromOrgChart();

/** 업데이트 기준일(가상) */
export const ORG_DIRECTORY_UPDATED_AT = "2025-01-15";

/** 고유 부서 목록 (CEO 포함) */
export function getDepartments(): string[] {
  const set = new Set(orgDirectoryPeople.map((p) => p.department));
  return DEPARTMENT_ORDER.filter((d) => set.has(d));
}

/** 고유 직책 목록 */
export function getTitles(): string[] {
  const set = new Set(orgDirectoryPeople.map((p) => p.title));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** RACI 역할 목록 */
export const RACI_OPTIONS: RaciRole[] = ["R", "A", "C", "I"];

export { raciSummary };
