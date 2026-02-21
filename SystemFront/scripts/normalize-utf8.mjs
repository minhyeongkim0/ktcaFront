#!/usr/bin/env node
/**
 * dummyData.ts를 UTF-8 (no BOM)으로 정규화 - 정상 내용으로 덮어쓰기
 */
import { writeFileSync } from "fs";

const path = "src/data/dummyData.ts";
const content = `/**
 * MES dashboard dummy data (NeoDrive Semiconductor)
 */

export type UserRole = "QMS Admin" | "Production" | "QA";

export const dummyData = {
  accounts: [
    { id: "admin", password: "Admin!1234", name: "Admin(Quality)", role: "QMS Admin", lastLogin: "2026-01-29 09:12" },
    { id: "ops01", password: "Ops!1234", name: "Field Ops", role: "Production", lastLogin: "2026-01-29 08:45" },
    { id: "qa01", password: "Qa!1234", name: "QA", role: "QA", lastLogin: "2026-01-28 18:20" },
  ],
  branding: {
    companyName: "NeoDrive Semiconductor",
    site: "A-Plant (Cheonan)",
    logoWatermark: "neodrive_logo_gray.png",
  },
  header: {
    title: "Integrated Dashboard",
  },
  context: { companies: [] },
  leadership: {},
  planning: {},
  support: {},
  operation: {},
  performance: {},
  improvement: {},
  uiMenus: { topTabs: [], sideTabs: {} },
};

export type DummyData = typeof dummyData;
export type ModuleId = keyof typeof dummyData.uiMenus.sideTabs;
export interface SideMenuItem { id: string; labelKey: string; icon?: string; }
export const getSideMenuItems = () => [];
export const CONTEXT_SIDE_TO_TYPE = {};
export function getContextCompanyBySideKey() { return null; }
export const sideMenuByModule = {};
`;

const out = Buffer.from(content, "utf8");
writeFileSync(path, out);
console.log("dummyData.ts written as UTF-8 (no BOM), bytes:", out.length);
