/**
 * Support 조직도(Organization Chart) 더미 데이터
 */

export type EmployeeStatus = "online" | "away" | "offline";

export type SkillLevel = {
  name: string; // e.g. "ISO9001"
  level: string; // e.g. "Expert", "Adv", "Inter"
  percent?: number;
};

export interface Employee {
  id: string;
  nameEn: string;
  nameKo: string;
  roleEn: string;
  roleKo: string;
  tenureYears: number;
  contact?: { email?: string; phone?: string };
  status: EmployeeStatus;
  skills?: SkillLevel[];
  tags?: string[];
  /** e.g. "Shift: On Duty" */
  extra?: string;
}

export interface Department {
  id: string;
  nameEn: string;
  nameKo: string;
  floor?: string;
  employees: Employee[];
}

export interface Ceo {
  id: string;
  nameEn: string;
  nameKo: string;
  email: string;
  phone: string;
  tenureYears: number;
  status: EmployeeStatus;
}

export interface SupportOrgData {
  ceo: Ceo;
  departments: Department[];
}

export const supportOrgData: SupportOrgData = {
  ceo: {
    id: "ceo-1",
    nameEn: "Kim Do-hyun",
    nameKo: "김도현",
    email: "ceo@mes-corp.com",
    phone: "+82 10-1234-5678",
    tenureYears: 15,
    status: "online",
  },
  departments: [
    {
      id: "dept-qc",
      nameEn: "Quality Control",
      nameKo: "품질관리",
      floor: "2F",
      employees: [
        {
          id: "emp-ps",
          nameEn: "Park So-yeon",
          nameKo: "박소연",
          roleEn: "Team Lead",
          roleKo: "팀장",
          tenureYears: 8,
          status: "online",
          skills: [
            { name: "ISO9001", level: "Expert", percent: 95 },
            { name: "ISO14001", level: "Adv", percent: 80 },
            { name: "ISO45001", level: "Inter", percent: 60 },
          ],
        },
        {
          id: "emp-cy",
          nameEn: "Choi Yu-jin",
          nameKo: "최유진",
          roleEn: "Senior",
          roleKo: "선임",
          tenureYears: 5,
          status: "away",
        },
        {
          id: "emp-lh",
          nameEn: "Lee Han-sol",
          nameKo: "이한솔",
          roleEn: "Analyst",
          roleKo: "분석",
          tenureYears: 2,
          status: "online",
        },
      ],
    },
    {
      id: "dept-rd",
      nameEn: "R&D",
      nameKo: "연구개발",
      floor: "3F",
      employees: [
        {
          id: "emp-os",
          nameEn: "Oh Se-hoon",
          nameKo: "오세훈",
          roleEn: "Team Lead",
          roleKo: "팀장",
          tenureYears: 12,
          status: "online",
          tags: ["Project Alpha", "Nano Tech"],
        },
        {
          id: "emp-jg",
          nameEn: "Jung Ga-eun",
          nameKo: "정가은",
          roleEn: "Senior",
          roleKo: "선임",
          tenureYears: 4,
          status: "away",
        },
        {
          id: "emp-hj",
          nameEn: "Han Ji-min",
          nameKo: "한지민",
          roleEn: "Researcher",
          roleKo: "연구원",
          tenureYears: 2,
          status: "offline",
        },
      ],
    },
    {
      id: "dept-prod",
      nameEn: "Production",
      nameKo: "생산",
      floor: "1F",
      employees: [
        {
          id: "emp-pk",
          nameEn: "Park Kyung-rim",
          nameKo: "박경림",
          roleEn: "Team Lead",
          roleKo: "팀장",
          tenureYears: 10,
          status: "online",
          extra: "Shift: On Duty",
        },
        {
          id: "emp-lj",
          nameEn: "Lee Joo-byung",
          nameKo: "이주병",
          roleEn: "Staff",
          roleKo: "주임",
          tenureYears: 5,
          status: "online",
        },
        {
          id: "emp-cm",
          nameEn: "Choi Min-jun",
          nameKo: "최민준",
          roleEn: "Operator",
          roleKo: "오퍼레이터",
          tenureYears: 2,
          status: "away",
        },
        {
          id: "emp-kh",
          nameEn: "Kim Ha-neul",
          nameKo: "김하늘",
          roleEn: "Operator",
          roleKo: "오퍼레이터",
          tenureYears: 1,
          status: "online",
        },
      ],
    },
    {
      id: "dept-purch",
      nameEn: "Purchasing",
      nameKo: "구매",
      floor: "2F",
      employees: [
        {
          id: "emp-kn",
          nameEn: "Kim Na-young",
          nameKo: "김나영",
          roleEn: "Team Lead",
          roleKo: "팀장",
          tenureYears: 7,
          status: "online",
        },
        {
          id: "emp-yt",
          nameEn: "Yoon Tae-ho",
          nameKo: "윤태호",
          roleEn: "Deputy",
          roleKo: "대리",
          tenureYears: 4,
          status: "away",
        },
        {
          id: "emp-lms",
          nameEn: "Lee Min-seol",
          nameKo: "이민설",
          roleEn: "Staff",
          roleKo: "주임",
          tenureYears: 3,
          status: "online",
        },
      ],
    },
  ],
};
