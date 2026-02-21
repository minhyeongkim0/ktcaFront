"use client";

import { useMemo, useRef, useState, useLayoutEffect, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { orgChartData } from "@/data/support/orgChart";
import { CeoNode, DeptNode, PersonNode } from "./nodes";
import { getLayoutedElements, LAYOUT } from "./orgChartLayout";

const NODE_TYPES: NodeTypes = {
  ceo: CeoNode,
  dept: DeptNode,
  person: PersonNode,
};

/** CEO 노드 1개만 (강제 복구용) - position (100,100) 또는 중앙 */
function getCeoOnlyNode(centerX: number, centerY: number): Node[] {
  const { ceo } = orgChartData;
  if (!ceo) return [];
  return [
    {
      id: ceo.id,
      type: "ceo",
      position: { x: centerX - 130, y: centerY - 85 },
      data: {
        name: ceo.name,
        title: ceo.title,
        tenureYears: ceo.tenureYears,
        phone: ceo.phone,
        email: ceo.email,
      },
      draggable: false,
    },
  ];
}

/** 데이터만으로 raw 노드/엣지 생성 (position은 0,0; 레이아웃에서 채움) */
function buildRawNodesAndEdges(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const { ceo, departments } = orgChartData;

  nodes.push({
    id: ceo.id,
    type: "ceo",
    position: { x: 0, y: 0 },
    data: {
      name: ceo.name,
      title: ceo.title,
      tenureYears: ceo.tenureYears,
      phone: ceo.phone,
      email: ceo.email,
    },
    draggable: false,
  });

  departments.forEach((dept) => {
    const deptId = dept.id;
    nodes.push({
      id: deptId,
      type: "dept",
      position: { x: 0, y: 0 },
      data: {
        nameKo: dept.nameKo,
        nameEn: dept.nameEn,
        roleSummary: dept.roleSummary,
        count: dept.employees.length,
      },
      draggable: false,
    });
    edges.push({ id: `e-ceo-${deptId}`, source: ceo.id, target: deptId, type: "smoothstep" });

    dept.employees.forEach((emp) => {
      const empId = emp.id;
      nodes.push({
        id: empId,
        type: "person",
        position: { x: 0, y: 0 },
        data: {
          name: emp.name,
          title: emp.title,
          tenureYears: emp.tenureYears,
          phone: emp.phone,
          email: emp.email,
        },
        draggable: false,
      });
      edges.push({ id: `e-${deptId}-${empId}`, source: deptId, target: empId, type: "smoothstep" });
    });
  });

  return { nodes, edges };
}

/** raw + 레이아웃 적용 (실패 시 fallback으로 최소 1개 노드 보장). 진단용 raw 개수 포함. */
function buildLayoutedNodesAndEdges(): {
  nodes: Node[];
  edges: Edge[];
  layoutOk: boolean;
  rawNodeCount: number;
  rawEdgeCount: number;
} {
  const { nodes: rawNodes, edges: rawEdges } = buildRawNodesAndEdges();
  const isDev = typeof process !== "undefined" && process.env.NODE_ENV === "development";
  if (isDev) {
    console.log("[OrgChart] rawNodes:", rawNodes.length, "rawEdges:", rawEdges.length);
  }

  if (rawNodes.length === 0) {
    if (isDev) console.warn("[OrgChart] No raw nodes (data empty?)");
    return { nodes: [], edges: rawEdges, layoutOk: false, rawNodeCount: 0, rawEdgeCount: rawEdges.length };
  }

  const result = getLayoutedElements(rawNodes, rawEdges, {
    nodeSep: LAYOUT.nodeSep,
    rankSep: LAYOUT.rankSep,
    rankdir: LAYOUT.rankdir,
    marginx: LAYOUT.marginx,
    marginy: LAYOUT.marginy,
  });

  if (isDev) {
    const hasNaN = result.nodes.some(
      (n) => typeof n.position?.x !== "number" || typeof n.position?.y !== "number" || Number.isNaN(n.position.x) || Number.isNaN(n.position.y)
    );
    console.log("[OrgChart] layoutedNodes:", result.nodes.length, "layoutOk:", result.layoutOk, "hasNaN:", hasNaN);
  }

  return {
    ...result,
    rawNodeCount: rawNodes.length,
    rawEdgeCount: rawEdges.length,
  };
}

/** 진단 오버레이 - 항상 표시 (원인 확정 후 dev-only로 전환 가능) */
function DebugOverlay({
  rawNodes,
  rawEdges,
  layoutedNodes,
  layoutOk,
  stateNodesLength,
  containerW,
  containerH,
  viewport,
}: {
  rawNodes: number;
  rawEdges: number;
  layoutedNodes: number;
  layoutOk: boolean;
  stateNodesLength: number;
  containerW: number;
  containerH: number;
  viewport: string;
}) {
  return (
    <div
      className="absolute top-2 right-2 z-[100] px-3 py-2 rounded-lg bg-slate-900/95 text-white text-xs font-mono shadow-lg border border-slate-600"
      style={{ minWidth: 220 }}
    >
      <div className="font-bold text-amber-300 mb-1.5">[OrgChart Debug]</div>
      <div>rawNodes: {rawNodes}</div>
      <div>rawEdges: {rawEdges}</div>
      <div>layoutedNodes: {layoutedNodes}</div>
      <div>layoutOk: {layoutOk ? "true" : "false"}</div>
      <div>state nodes: {stateNodesLength}</div>
      <div>container: {containerW} × {containerH}</div>
      <div>viewport: {viewport}</div>
    </div>
  );
}

function OrgChartCanvas({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const layoutResult = useMemo(buildLayoutedNodesAndEdges, []);
  const {
    nodes: initialNodes,
    edges: initialEdges,
    layoutOk: initialLayoutOk,
    rawNodeCount,
    rawEdgeCount,
  } = layoutResult;

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const layoutOkRef = useRef(initialLayoutOk);
  layoutOkRef.current = initialLayoutOk;

  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const measure = () => setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  const reactFlowInstance = useReactFlow();
  const [viewportStr, setViewportStr] = useState("N/A");
  useEffect(() => {
    if (nodes.length === 0) return;
    try {
      const vp = reactFlowInstance?.getViewport?.();
      if (vp && typeof vp.x === "number" && typeof vp.y === "number" && typeof vp.zoom === "number") {
        setViewportStr(`zoom=${vp.zoom.toFixed(2)} x=${Math.round(vp.x)} y=${Math.round(vp.y)}`);
      }
    } catch (_) {
      setViewportStr("err");
    }
  }, [nodes.length, reactFlowInstance]);

  const fitViewDoneRef = useRef(false);
  useEffect(() => {
    if (nodes.length === 0 || fitViewDoneRef.current) return;
    fitViewDoneRef.current = true;
    const doFitView = () => {
      try {
        reactFlowInstance?.fitView?.({ padding: 0.2 });
      } catch {
        // noop
      }
    };
    const run = () => {
      requestAnimationFrame(() => requestAnimationFrame(doFitView));
    };
    const t = setTimeout(run, 100);
    return () => clearTimeout(t);
  }, [nodes.length, reactFlowInstance]);

  const forceRecoveryDoneRef = useRef(false);
  useEffect(() => {
    if (forceRecoveryDoneRef.current) return;
    const rawCount = rawNodeCount;
    const layoutedCount = initialNodes.length;
    const stateCount = nodes.length;
    const hasInvalidPosition = nodes.some(
      (n) =>
        typeof n.position?.x !== "number" ||
        typeof n.position?.y !== "number" ||
        Number.isNaN(n.position?.x) ||
        Number.isNaN(n.position?.y) ||
        !Number.isFinite(n.position?.x) ||
        !Number.isFinite(n.position?.y)
    );
    const containerTooSmall = containerSize.h > 0 && containerSize.h < 100;
    const needRecovery =
      (layoutedCount === 0 && rawCount > 0) ||
      stateCount === 0 ||
      hasInvalidPosition ||
      containerTooSmall;

    if (!needRecovery || rawCount === 0) return;
    forceRecoveryDoneRef.current = true;

    const cx = Math.max(100, containerSize.w / 2 - 130);
    const cy = Math.max(100, containerSize.h / 2 - 85);
    const ceoOnly = getCeoOnlyNode(cx, cy);
    if (ceoOnly.length > 0) {
      setNodes(ceoOnly);
      setEdges([]);
    }
  }, [
    rawNodeCount,
    initialNodes.length,
    nodes.length,
    nodes,
    containerSize.w,
    containerSize.h,
    setNodes,
    setEdges,
  ]);

  if (nodes.length === 0) {
    return (
      <>
        <DebugOverlay
          rawNodes={rawNodeCount}
          rawEdges={rawEdgeCount}
          layoutedNodes={initialNodes.length}
          layoutOk={initialLayoutOk}
          stateNodesLength={nodes.length}
          containerW={containerSize.w}
          containerH={containerSize.h}
          viewport="N/A"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
          <div
            className="text-center p-6 max-w-md rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/30 shadow-lg"
            role="alert"
          >
            <p className="text-red-700 dark:text-red-300 font-bold text-sm">NODES=0 (EmptyState Triggered)</p>
            <p className="text-slate-600 dark:text-slate-400 text-xs mt-2">
              조직도 데이터가 없거나 레이아웃 결과가 비었습니다. data/support/orgChart.ts를 확인하세요.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DebugOverlay
        rawNodes={rawNodeCount}
        rawEdges={rawEdgeCount}
        layoutedNodes={initialNodes.length}
        layoutOk={layoutOkRef.current}
        stateNodesLength={nodes.length}
        containerW={containerSize.w}
        containerH={containerSize.h}
        viewport={viewportStr}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50/50 dark:bg-slate-900/30"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#94a3b8" style={{ opacity: 0.4 }} />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </>
  );
}

export function OrgChart() {
  const hasData = Boolean(orgChartData?.ceo && Array.isArray(orgChartData?.departments));
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="h-[720px] min-h-[600px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-auto relative"
    >
      <ReactFlowProvider>
        {hasData ? (
          <OrgChartCanvas containerRef={containerRef} />
        ) : (
          <>
            <div className="absolute top-2 right-2 z-[100] px-3 py-2 rounded-lg bg-slate-900/95 text-white text-xs font-mono">
              rawNodes: 0 (no data) · hasData: false
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
              <div className="text-center p-6 max-w-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">조직도 데이터가 없습니다.</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">data/support/orgChart.ts를 확인하세요.</p>
              </div>
            </div>
          </>
        )}
      </ReactFlowProvider>
    </div>
  );
}
