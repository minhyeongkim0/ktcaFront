/**
 * 조직도 자동 레이아웃 - Dagre 기반
 * 노드 겹침 방지: 고정 노드 크기 + 충분한 nodeSep/rankSep
 * 레이아웃 실패 시 fallback으로 빈 화면 방지.
 */
import dagre from "dagre";
import type { Node, Edge } from "@xyflow/react";

export const LAYOUT = {
  /** 같은 레벨 노드 간 간격(px) - 겹침 방지 */
  nodeSep: 80,
  /** 레벨 간 간격(px) */
  rankSep: 120,
  /** 방향: Top-to-Bottom */
  rankdir: "TB" as const,
  marginx: 20,
  marginy: 20,
} as const;

/** 노드 타입별 고정 크기 (0 방지, 레이아웃과 카드 실제 크기 동일) */
export const NODE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  ceo: { width: 260, height: 170 },
  dept: { width: 260, height: 100 },
  person: { width: 220, height: 140 },
};

const DEFAULT_DIMS = { width: 240, height: 140 };

function getDimensions(node: Node): { width: number; height: number } {
  const d = NODE_DIMENSIONS[node.type ?? "person"] ?? NODE_DIMENSIONS.person ?? DEFAULT_DIMS;
  return {
    width: Number(d?.width) > 0 ? d.width : DEFAULT_DIMS.width,
    height: Number(d?.height) > 0 ? d.height : DEFAULT_DIMS.height,
  };
}

function isValidPosition(x: number, y: number): boolean {
  return Number.isFinite(x) && Number.isFinite(y) && !Number.isNaN(x) && !Number.isNaN(y);
}

export interface LayoutOptions {
  nodeSep?: number;
  rankSep?: number;
  rankdir?: "TB" | "BT" | "LR" | "RL";
  marginx?: number;
  marginy?: number;
}

/**
 * Dagre로 노드 위치 계산. 실패 시 fallback 그리드 배치로 빈 화면 방지.
 */
export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[]; layoutOk: boolean } {
  if (!nodes.length) return { nodes: [], edges: edges.slice(), layoutOk: false };

  const {
    nodeSep = LAYOUT.nodeSep,
    rankSep = LAYOUT.rankSep,
    rankdir = LAYOUT.rankdir,
    marginx = LAYOUT.marginx,
    marginy = LAYOUT.marginy,
  } = options;

  try {
    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir,
      nodesep: nodeSep,
      ranksep: rankSep,
      marginx,
      marginy,
    });
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      const { width, height } = getDimensions(node);
      g.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
      if (edge.source && edge.target) g.setEdge(edge.source, edge.target);
    });

    dagre.layout(g);

    const layoutedNodes = nodes.map((node) => {
      const dagreNode = g.node(node.id);
      const { width, height } = getDimensions(node);
      if (!dagreNode || !Number.isFinite(dagreNode.x) || !Number.isFinite(dagreNode.y)) {
        return { ...node, position: { x: 0, y: 0 } };
      }
      const x = dagreNode.x - (dagreNode.width ?? width) / 2;
      const y = dagreNode.y - (dagreNode.height ?? height) / 2;
      const pos = { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0 };
      return { ...node, position: pos };
    });

    const hasNaN = layoutedNodes.some(
      (n) => !isValidPosition(n.position.x, n.position.y)
    );
    const outOfBounds = layoutedNodes.some(
      (n) => Math.abs(n.position.x) > 20000 || Math.abs(n.position.y) > 20000
    );
    if (hasNaN || outOfBounds) {
      return runFallbackLayout(nodes, edges);
    }

    return { nodes: layoutedNodes, edges, layoutOk: true };
  } catch (err) {
    if (typeof process !== "undefined" && process.env.NODE_ENV === "development") {
      console.warn("[orgChartLayout] Dagre layout failed, using fallback:", err);
    }
    return runFallbackLayout(nodes, edges);
  }
}

/** Dagre 없이 단순 그리드 배치 (빈 화면 방지) */
function runFallbackLayout(
  nodes: Node[],
  edges: Edge[]
): { nodes: Node[]; edges: Edge[]; layoutOk: boolean } {
  const ceo = nodes.find((n) => n.type === "ceo");
  const depts = nodes.filter((n) => n.type === "dept");
  const persons = nodes.filter((n) => n.type === "person");
  const nodeSep = 80;
  const rankSep = 120;
  const deptWidth = 260;
  const personWidth = 220;
  const personHeight = 140;
  const result: Node[] = [];
  let y = 0;

  if (ceo) {
    result.push({ ...ceo, position: { x: 0, y: 0 } });
    y += 170 + rankSep;
  }

  if (depts.length) {
    const totalW = depts.length * deptWidth + (depts.length - 1) * nodeSep;
    let x = -totalW / 2 + deptWidth / 2;
    depts.forEach((d) => {
      result.push({ ...d, position: { x: x - deptWidth / 2, y } });
      x += deptWidth + nodeSep;
    });
    y += 100 + rankSep;
  }

  const byParent = new Map<string, Node[]>();
  persons.forEach((p) => {
    const edge = edges.find((e) => e.target === p.id);
    const parentId = edge?.source ?? "";
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId)!.push(p);
  });
  depts.forEach((d) => {
    const list = byParent.get(d.id) ?? [];
    if (list.length === 0) return;
    const totalW = list.length * personWidth + (list.length - 1) * nodeSep;
    let x = -totalW / 2 + personWidth / 2;
    list.forEach((p) => {
      result.push({ ...p, position: { x: x - personWidth / 2, y } });
      x += personWidth + nodeSep;
    });
    y += personHeight + rankSep;
  });

  const withPos = result.length ? result : nodes.map((n, i) => ({ ...n, position: { x: i * 240, y: 0 } }));
  return { nodes: withPos, edges, layoutOk: false };
}
