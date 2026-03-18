import { useMemo } from "react";
import {
  ReactFlow,
  Handle,
  type Node,
  type Edge,
  type NodeProps,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useIsMobile } from "@/hooks/use-mobile";

const CENTER_X = 0;
const CENTER_Y = 0;
const RADIUS_DESKTOP = 220;
const RADIUS_MOBILE = 200;
const NODE_WIDTH_DESKTOP = 120;
const NODE_HEIGHT_DESKTOP = 48;
const NODE_WIDTH_MOBILE = 148;
const NODE_HEIGHT_MOBILE = 56;

function getCircularPosition(index: number, total: number, radius: number) {
  const angle = -Math.PI / 2 + (2 * Math.PI * index) / total;
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y + radius * Math.sin(angle),
  };
}

const LABELS = [
  "Freshman",
  "Intro to Fundamentals",
  "Classes / Projects",
  "Internships / Research",
] as const;

const NODE_IDS = ["freshman", "intro", "classes", "internships"] as const;

function PipelineNode({ data, sourcePosition, targetPosition }: NodeProps<Node<{ label: string; isMobile?: boolean }>>) {
  const isMobile = data.isMobile ?? false;
  const width = isMobile ? NODE_WIDTH_MOBILE : NODE_WIDTH_DESKTOP;
  const height = isMobile ? NODE_HEIGHT_MOBILE : NODE_HEIGHT_DESKTOP;
  return (
    <div
      className="flex flex-col items-center justify-center rounded-full bg-[hsl(33,100%,97%)] border-2 border-[hsl(var(--primary))] px-3 py-2 shadow-sm box-border"
      style={{ width, height }}
    >
      <Handle type="target" position={targetPosition} className="!w-2 !h-2 !border-2 !border-[hsl(var(--primary))] !bg-white" />
      <span
        className={`font-semibold text-gray-900 text-center leading-tight pointer-events-none line-clamp-2 ${isMobile ? "text-sm" : "text-[11px]"
          }`}
      >
        {data.label}
      </span>
      <Handle type="source" position={sourcePosition} className="!w-2 !h-2 !border-2 !border-[hsl(var(--primary))] !bg-white" />
    </div>
  );
}

const nodeTypes = { pipeline: PipelineNode };

export default function PipelineDiagram() {
  const isMobile = useIsMobile();
  const radius = isMobile ? RADIUS_MOBILE : RADIUS_DESKTOP;

  const NODE_HANDLES: Array<{ sourcePosition: Position; targetPosition: Position }> = [
    { sourcePosition: Position.Right, targetPosition: Position.Left },
    { sourcePosition: Position.Bottom, targetPosition: Position.Top },
    { sourcePosition: Position.Left, targetPosition: Position.Right },
    { sourcePosition: Position.Top, targetPosition: Position.Bottom },
  ];

  const nodes: Node[] = useMemo(() => {
    return NODE_IDS.map((id, i) => {
      const position = getCircularPosition(i, NODE_IDS.length, radius);
      return {
        id,
        type: "pipeline",
        position,
        data: { label: LABELS[i], isMobile },
        ...NODE_HANDLES[i],
        draggable: false,
        selectable: false,
        connectable: false,
      };
    });
  }, [radius, isMobile]);

  const edges: Edge[] = useMemo(() => {
    const markerEnd = { type: MarkerType.ArrowClosed as const, color: "hsl(var(--primary))" };
    return [
      { id: "e1", source: "freshman", target: "intro", type: "default", markerEnd, style: { stroke: "hsl(var(--primary) / 0.7)", strokeWidth: 2 } },
      { id: "e2", source: "intro", target: "classes", type: "default", markerEnd, style: { stroke: "hsl(var(--primary) / 0.7)", strokeWidth: 2 } },
      { id: "e3", source: "classes", target: "internships", type: "default", markerEnd, style: { stroke: "hsl(var(--primary) / 0.7)", strokeWidth: 2 } },
      { id: "e4", source: "internships", target: "freshman", type: "default", markerEnd, style: { stroke: "hsl(var(--primary) / 0.7)", strokeWidth: 2 } },
    ];
  }, []);

  const allowPageScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="pipeline-diagram-root w-full aspect-square min-w-0 overflow-hidden"
      onWheelCapture={allowPageScroll}
      style={{ contain: "layout" }}
    >
      <style>{`
        .pipeline-diagram-root .react-flow,
        .pipeline-diagram-root .react-flow__container,
        .pipeline-diagram-root .react-flow__pane,
        .pipeline-diagram-root .react-flow__viewport,
        .pipeline-diagram-root .react-flow__renderer {
          min-height: 0 !important;
          height: 100% !important;
          width: 100% !important;
        }
        .pipeline-diagram-root .react-flow {
          position: absolute;
          inset: 0;
        }
        .pipeline-diagram-root .react-flow__pane {
          background: transparent;
        }
      `}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodeOrigin={[0.5, 0.5]}
        fitView
        fitViewOptions={{ padding: isMobile ? 0.2 : 0.32, maxZoom: isMobile ? 1.4 : 1.2 }}
        minZoom={0.4}
        maxZoom={1.2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: "default",
          markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
          style: { stroke: "hsl(var(--primary) / 0.65)", strokeWidth: 2 },
        }}
      />
    </div>
  );
}
