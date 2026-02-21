/**
 * 조직도(Org Chart) 인력 데이터 - React Flow 시각화용
 * 전화/이메일은 가상 값(개인정보 이슈 방지)
 */

export interface OrgPerson {
  id: string;
  name: string;
  title: string;
  department: string;
  tenureYears: number;
  phone: string;
  email: string;
}

export interface OrgDept {
  id: string;
  nameKo: string;
  nameEn: string;
  roleSummary: string;
  employees: OrgPerson[];
}

export interface OrgCeo {
  id: string;
  name: string;
  title: string;
  tenureYears: number;
  phone: string;
  email: string;
}

export interface OrgChartData {
  ceo: OrgCeo;
  departments: OrgDept[];
}

function fakePhone(id: string): string {
  const n = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return `010-${String(1000 + (n % 9000))}-${String(1000 + (n % 9000))}`;
}

function fakeEmail(id: string, name: string): string {
  const local = name.replace(/\s/g, ".").toLowerCase().replace(/[^a-z.]/g, "");
  return `${local || id}@qms.local`;
}

export const orgChartData = {
  ceo: {
    id: "ceo-1",
    name: "김도현",
    title: "대표이사",
    tenureYears: 15,
    phone: "010-1234-5678",
    email: "ceo@qms.local",
  },
  departments: [
    {
      id: "dept-rd",
      nameKo: "연구개발",
      nameEn: "R&D",
      roleSummary: "제품·공정 연구개발",
      employees: [
        { id: "emp-os", name: "오세훈", title: "팀장", department: "연구개발", tenureYears: 12, phone: fakePhone("emp-os"), email: fakeEmail("emp-os", "Oh Se-hoon") },
        { id: "emp-jg", name: "정가은", title: "선임", department: "연구개발", tenureYears: 4, phone: fakePhone("emp-jg"), email: fakeEmail("emp-jg", "Jung Ga-eun") },
        { id: "emp-hj", name: "한지민", title: "연구원", department: "연구개발", tenureYears: 2, phone: fakePhone("emp-hj"), email: fakeEmail("emp-hj", "Han Ji-min") },
      ],
    },
    {
      id: "dept-purch",
      nameKo: "구매",
      nameEn: "Purchasing",
      roleSummary: "원자재·자재 구매",
      employees: [
        { id: "emp-kn", name: "김나영", title: "팀장", department: "구매", tenureYears: 7, phone: fakePhone("emp-kn"), email: fakeEmail("emp-kn", "Kim Na-young") },
        { id: "emp-yt", name: "윤태호", title: "대리", department: "구매", tenureYears: 4, phone: fakePhone("emp-yt"), email: fakeEmail("emp-yt", "Yoon Tae-ho") },
        { id: "emp-lms", name: "이민설", title: "주임", department: "구매", tenureYears: 3, phone: fakePhone("emp-lms"), email: fakeEmail("emp-lms", "Lee Min-seol") },
      ],
    },
    {
      id: "dept-prod",
      nameKo: "생산",
      nameEn: "Production",
      roleSummary: "생산·가공 관리",
      employees: [
        { id: "emp-pk", name: "박경수", title: "팀장", department: "생산", tenureYears: 10, phone: fakePhone("emp-pk"), email: fakeEmail("emp-pk", "Park Kyung-rim") },
        { id: "emp-lj", name: "이주원", title: "주임", department: "생산", tenureYears: 5, phone: fakePhone("emp-lj"), email: fakeEmail("emp-lj", "Lee Joo-byung") },
        { id: "emp-cm", name: "최민준", title: "엔지니어", department: "생산", tenureYears: 2, phone: fakePhone("emp-cm"), email: fakeEmail("emp-cm", "Choi Min-jun") },
        { id: "emp-kh", name: "김민늘", title: "엔지니어", department: "생산", tenureYears: 1, phone: fakePhone("emp-kh"), email: fakeEmail("emp-kh", "Kim Ha-neul") },
      ],
    },
    {
      id: "dept-qc",
      nameKo: "품질관리",
      nameEn: "Quality Control",
      roleSummary: "품질·검사 인증",
      employees: [
        { id: "emp-ps", name: "박소영", title: "팀장", department: "품질관리", tenureYears: 8, phone: fakePhone("emp-ps"), email: fakeEmail("emp-ps", "Park So-yeon") },
        { id: "emp-cy", name: "최유진", title: "선임", department: "품질관리", tenureYears: 5, phone: fakePhone("emp-cy"), email: fakeEmail("emp-cy", "Choi Yu-jin") },
        { id: "emp-lh", name: "윤한수", title: "분석", department: "품질관리", tenureYears: 2, phone: fakePhone("emp-lh"), email: fakeEmail("emp-lh", "Lee Han-sol") },
      ],
    },
  ],
};
