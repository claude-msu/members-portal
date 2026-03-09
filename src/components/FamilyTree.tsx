import {
    useRef,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useLayoutEffect,
} from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { GitBranch, ZoomIn, ZoomOut } from 'lucide-react';
import type { Database } from '@/integrations/supabase/database.types';

// ─────────────────────────────────────────────────────────────────────────────
// Exported types & utilities (consumed by Members.tsx)
// ─────────────────────────────────────────────────────────────────────────────

type Profile = Database['public']['Tables']['profiles']['Row'];
export type AppRole = Database['public']['Enums']['app_role'];

export interface MemberWithRole extends Profile {
    role: AppRole;
}

export interface FamilyRelationship {
    id: string;
    big_id: string;
    little_id: string;
}

export interface FamilyNode {
    member: MemberWithRole;
    big_id: string | null;
    depth: number;
    littles: FamilyNode[];
}

export interface Family {
    root: MemberWithRole;
    members: MemberWithRole[]; // BFS order: root first
    tree: FamilyNode;
}

const rolePriority = (r: AppRole) =>
    r === 'e-board' ? 0 : r === 'board' ? 1 : r === 'member' ? 2 : 3;

export function buildFamilies(
    members: MemberWithRole[],
    relationships: FamilyRelationship[],
): Family[] {
    if (!members.length) return [];

    const memberMap = new Map(members.map(m => [m.id, m]));

    if (!relationships.length) {
        const sorted = [...members].sort((a, b) => rolePriority(a.role) - rolePriority(b.role));
        const root = sorted[0];
        const rootNode: FamilyNode = { member: root, big_id: null, depth: 0, littles: [] };
        return [{ root, members: sorted, tree: rootNode }];
    }

    const littleIds = new Set(relationships.map(r => r.little_id));
    const bigMap = new Map<string, string[]>();
    for (const rel of relationships) {
        if (!bigMap.has(rel.big_id)) bigMap.set(rel.big_id, []);
        bigMap.get(rel.big_id)!.push(rel.little_id);
    }

    const rootIds = [...bigMap.keys()].filter(id => !littleIds.has(id));

    function buildNode(id: string, bigId: string | null, depth: number): FamilyNode | null {
        const member = memberMap.get(id);
        if (!member) return null;
        const node: FamilyNode = { member, big_id: bigId, depth, littles: [] };
        for (const childId of bigMap.get(id) ?? []) {
            const child = buildNode(childId, id, depth + 1);
            if (child) node.littles.push(child);
        }
        return node;
    }

    return rootIds
        .map(id => {
            const root = memberMap.get(id);
            const tree = buildNode(id, null, 0);
            if (!root || !tree) return null;
            const flat: MemberWithRole[] = [];
            const q = [tree];
            while (q.length) { const n = q.shift()!; flat.push(n.member); n.littles.forEach(l => q.push(l)); }
            return { root, members: flat, tree } satisfies Family;
        })
        .filter((f): f is Family => f !== null)
        .sort((a, b) => {
            const rd = rolePriority(a.root.role) - rolePriority(b.root.role);
            return rd !== 0 ? rd : (a.root.full_name ?? '').localeCompare(b.root.full_name ?? '');
        });
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS (injected once)
// ─────────────────────────────────────────────────────────────────────────────

const STYLES = `
    @keyframes ft-aqua-pulse {
      0%, 100% { box-shadow: 0 0 0 2px hsl(var(--primary) / 0.5), 0 4px 12px hsl(var(--primary) / 0.15); }
      50%      { box-shadow: 0 0 0 2px hsl(var(--primary) / 0.8), 0 6px 20px hsl(var(--primary) / 0.25); }
    }
    .ft-aqua-pulse {
      animation: ft-aqua-pulse 2s ease-in-out infinite;
      border-color: hsl(var(--primary)) !important;
    }
    .ft-canvas-bg {
      background: linear-gradient(165deg, hsl(var(--muted)) 0%, hsl(var(--muted) / 0.6) 50%, hsl(var(--background)) 100%);
    }
    .dark .ft-canvas-bg {
      background: linear-gradient(165deg, hsl(220 18% 14%) 0%, hsl(220 18% 10%) 50%, hsl(220 18% 7%) 100%);
    }
`;

let stylesInjected = false;
function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
}

// ─────────────────────────────────────────────────────────────────────────────
// Radial tree layout — no line crossings
// ─────────────────────────────────────────────────────────────────────────────

const RADIUS_PER_DEPTH = 9;

interface NodePosition { x: number; y: number; }

function subtreeLeafCount(node: FamilyNode): number {
    return node.littles.length === 0
        ? 1
        : node.littles.reduce((s, l) => s + subtreeLeafCount(l), 0);
}

function assignRadialPositions(
    node: FamilyNode,
    depth: number,
    startAngle: number,
    endAngle: number,
    out: Map<string, NodePosition>,
): void {
    if (depth === 0) {
        out.set(node.member.id, { x: 0, y: 0 });
    } else {
        const mid = (startAngle + endAngle) / 2;
        const r = depth * RADIUS_PER_DEPTH;
        out.set(node.member.id, { x: r * Math.cos(mid), y: r * Math.sin(mid) });
    }
    if (!node.littles.length) return;
    const totalLeaves = node.littles.reduce((s, l) => s + subtreeLeafCount(l), 0);
    let cursor = startAngle;
    for (const little of node.littles) {
        const arc = (subtreeLeafCount(little) / totalLeaves) * (endAngle - startAngle);
        assignRadialPositions(little, depth + 1, cursor, cursor + arc, out);
        cursor += arc;
    }
}

function collectNodes(node: FamilyNode, acc: FamilyNode[] = []): FamilyNode[] {
    acc.push(node);
    node.littles.forEach(l => collectNodes(l, acc));
    return acc;
}

function collectEdges(node: FamilyNode, acc: [string, string][] = []): [string, string][] {
    for (const little of node.littles) {
        acc.push([node.member.id, little.member.id]);
        collectEdges(little, acc);
    }
    return acc;
}

// ─────────────────────────────────────────────────────────────────────────────
// Three.js scene components (private)
// ─────────────────────────────────────────────────────────────────────────────

function TreeEdge({ from, to }: { from: NodePosition; to: NodePosition }) {
    const points = useMemo(() => [
        new THREE.Vector3(from.x, from.y, 0),
        new THREE.Vector3(to.x, to.y, 0),
    ], [from, to]);
    return <Line points={points} color="#6b7280" lineWidth={1.25} transparent opacity={0.25} />;
}

function TreeNodeCard({
    node,
    position,
    isCurrentUser,
    isHovered,
    onEnter,
    onLeave,
    onNodeClick,
}: {
    node: FamilyNode;
    position: NodePosition;
    isCurrentUser: boolean;
    isHovered: boolean;
    onEnter: () => void;
    onLeave: () => void;
    onNodeClick: () => void;
}) {
    const { member } = node;
    const initials = (member.full_name ?? member.email ?? '?')
        .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const isEBoard = member.role === 'e-board';
    const isBoard = member.role === 'board';
    const isRoot = node.depth === 0;

    const borderClass = isCurrentUser
        ? 'ft-aqua-pulse border-[1.5px] border-primary shadow shadow-primary/20'
        : isEBoard
            ? 'border-[1.5px] border-amber-500 shadow shadow-amber-500/15'
            : isBoard
                ? 'border-[1.5px] border-blue-500 shadow shadow-blue-500/15'
                : 'border-[1.5px] border-border bg-card shadow-sm hover:border-muted-foreground/60';

    const sizeClass = isRoot ? 'w-10 h-10 text-sm' : 'w-7 h-7 text-[10px]';
    const displayName = member.full_name ?? member.email ?? 'Unknown';

    return (
        <Html position={[position.x, position.y, 0]} center zIndexRange={[10, 0]}>
            <div
                className={`flex flex-col items-center cursor-pointer select-none transition-transform duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                onClick={onNodeClick}
                title={displayName}
            >
                <div className={`${sizeClass} rounded-full overflow-hidden flex items-center justify-center font-semibold bg-muted box-content ${borderClass}`}>
                    {member.profile_picture_url
                        ? <img src={member.profile_picture_url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-muted-foreground">{initials}</span>}
                </div>
            </div>
        </Html>
    );
}

function AutoCamera({
    positions,
    paddingScale = 1.3,
    zoomFactorRef,
}: {
    positions: Map<string, NodePosition>;
    paddingScale?: number;
    zoomFactorRef: React.MutableRefObject<number>;
}) {
    const { camera, size } = useThree();
    const centerRef = useRef({ x: 0, y: 0 });
    const baseDistRef = useRef(50);
    useLayoutEffect(() => {
        if (!positions.size) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        positions.forEach(p => {
            minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
        });
        centerRef.current = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        const spanX = Math.max(maxX - minX + 8, 4);
        const spanY = Math.max(Math.abs(maxY - minY) + 8, 4);
        const aspect = size.width / size.height;
        const fovRad = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
        baseDistRef.current =
            Math.max(
                (spanY / 2) / Math.tan(fovRad / 2),
                (spanX / 2) / (Math.tan(fovRad / 2) * aspect),
            ) * paddingScale;
    }, [positions, camera, size, paddingScale]);
    useFrame(() => {
        const { x: cx, y: cy } = centerRef.current;
        const dist = Math.min(baseDistRef.current * zoomFactorRef.current, 200);
        camera.position.set(cx, cy, dist);
        camera.lookAt(cx, cy, 0);
    });
    return null;
}

function FamilyScene({
    family,
    currentUserId,
    hoveredId,
    onHover,
    onNodeClick,
    zoomFactorRef,
}: {
    family: Family;
    currentUserId: string;
    hoveredId: string | null;
    onHover: (id: string | null) => void;
    onNodeClick: (memberId: string) => void;
    zoomFactorRef: React.MutableRefObject<number>;
}) {
    const positions = useMemo(() => {
        const m = new Map<string, NodePosition>();
        assignRadialPositions(family.tree, 0, 0, 2 * Math.PI, m);
        return m;
    }, [family]);

    const allNodes = useMemo(() => collectNodes(family.tree), [family]);
    const allEdges = useMemo(() => collectEdges(family.tree), [family]);
    const hasChildren = family.tree.littles.length > 0;
    const paddingScale = hasChildren ? 1.3 : 2.5;

    return (
        <>
            <AutoCamera positions={positions} paddingScale={paddingScale} zoomFactorRef={zoomFactorRef} />
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 10]} intensity={0.6} color="#ffffff" />
            {allEdges.map(([bigId, littleId]) => {
                const from = positions.get(bigId), to = positions.get(littleId);
                return from && to ? <TreeEdge key={`${bigId}-${littleId}`} from={from} to={to} /> : null;
            })}
            {allNodes.map(node => {
                const pos = positions.get(node.member.id);
                return pos ? (
                    <TreeNodeCard
                        key={node.member.id}
                        node={node}
                        position={pos}
                        isCurrentUser={node.member.id === currentUserId}
                        isHovered={hoveredId === node.member.id}
                        onEnter={() => onHover(node.member.id)}
                        onLeave={() => onHover(null)}
                        onNodeClick={() => onNodeClick(node.member.id)}
                    />
                ) : null;
            })}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas component — exported
// ─────────────────────────────────────────────────────────────────────────────

export interface FamilyTreeProps {
    family: Family | null;
    families: Family[];
    activeFamilyIdx: number;
    onSwitchFamily: (idx: number) => void;
    currentUserId: string;
    hoveredId: string | null;
    onHover: (id: string | null) => void;
    onNodeClick: (memberId: string) => void;
    hasRelationships: boolean;
    canManage: boolean;
}

export function FamilyTree({
    family,
    families,
    activeFamilyIdx,
    onSwitchFamily,
    currentUserId,
    hoveredId,
    onHover,
    onNodeClick,
    hasRelationships,
    canManage,
}: FamilyTreeProps) {
    useEffect(() => { injectStyles(); }, []);

    const [zoomFactor, setZoomFactor] = useState(1);
    const zoomFactorRef = useRef(1);
    const setZoom = useCallback((fn: (prev: number) => number) => {
        setZoomFactor(prev => {
            const next = fn(prev);
            zoomFactorRef.current = next;
            return next;
        });
    }, []);

    void zoomFactor;

    return (
        <div className="relative w-full h-full ft-canvas-bg overflow-hidden">
            {/* Canvas */}
            {family && (
                <Canvas camera={{ fov: 50, near: 0.1, far: 1000 }} style={{ background: 'transparent' }}>
                    <FamilyScene
                        key={activeFamilyIdx}
                        family={family}
                        currentUserId={currentUserId}
                        hoveredId={hoveredId}
                        onHover={onHover}
                        onNodeClick={onNodeClick}
                        zoomFactorRef={zoomFactorRef}
                    />
                </Canvas>
            )}

            {/* No-relationships overlay */}
            {!hasRelationships && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="text-center space-y-2 opacity-50 px-8">
                        <GitBranch className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">No family connections yet</p>
                        {canManage && (
                            <p className="text-xs text-muted-foreground">
                                Use the link button to connect bigs and littles
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Overlay: nav dots + zoom rocker */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Nav dots */}
                {hasRelationships && families.length > 1 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 pointer-events-auto">
                        {families.map((f, i) => (
                            <button
                                key={f.root.id}
                                onClick={() => onSwitchFamily(i)}
                                title={`${f.root.full_name}'s Family`}
                                className="group relative flex items-center justify-end"
                            >
                                <div className={`rounded-full transition-all duration-300 ${i === activeFamilyIdx ? 'w-2.5 h-2.5 bg-primary shadow-sm' : 'w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'}`} />
                                <span className="absolute right-full mr-2 px-2 py-1 rounded-md text-xs bg-popover text-popover-foreground border border-border shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {f.root.full_name?.split(' ')[0]}'s Family
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Zoom rocker */}
                <div className="absolute top-3 right-3 flex flex-col rounded-lg border border-border bg-card/95 shadow-sm overflow-hidden pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => setZoom(f => Math.max(f / 1.25, 0.4))}
                        className="p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Zoom in"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </button>
                    <div className="h-px bg-border" />
                    <button
                        type="button"
                        onClick={() => setZoom(f => Math.min(f * 1.25, 3))}
                        className="p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        title="Zoom out"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Keyboard hint */}
            {hasRelationships && families.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-75 pointer-events-none text-muted-foreground text-xs">
                    <kbd className="px-2 py-1 rounded border border-border bg-muted/50 font-mono text-base leading-none">↑</kbd>
                    <kbd className="px-2 py-1 rounded border border-border bg-muted/50 font-mono text-base leading-none">↓</kbd>
                    <span className="ml-0.5">switch families</span>
                </div>
            )}
        </div>
    );
}

export default FamilyTree;
