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
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PersonCard } from '@/components/PersonCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Award, GitBranch, ZoomIn, ZoomOut } from 'lucide-react';
import type { Database } from '@/integrations/supabase/database.types';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Profile = Database['public']['Tables']['profiles']['Row'];
type AppRole = Database['public']['Enums']['app_role'];

interface MemberWithRole extends Profile {
    role: AppRole;
}

interface FamilyRelationship {
    big_id: string;
    little_id: string;
}

interface FamilyNode {
    member: MemberWithRole;
    big_id: string | null;
    depth: number;
    littles: FamilyNode[];
}

interface Family {
    root: MemberWithRole;
    members: MemberWithRole[]; // BFS order: root first
    tree: FamilyNode;
}

interface NodePosition {
    x: number;
    y: number;
}

export interface FamilyTreeProps {
    members: MemberWithRole[];
    onViewProfile: (member: MemberWithRole) => void;
    onRoleChange: (memberId: string, newRole: AppRole) => void;
    onKick: (memberId: string, memberName: string) => void;
    onBan: (memberId: string, memberName: string) => void;
    canManage: boolean;
    canChangeRoles: boolean;
    isMobile: boolean;
    currentUserId?: string;
    currentUserRole?: AppRole;
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
// Build family structure
// ─────────────────────────────────────────────────────────────────────────────

const rolePriority = (r: AppRole) =>
    r === 'e-board' ? 0 : r === 'board' ? 1 : r === 'member' ? 2 : 3;

function buildFamilies(members: MemberWithRole[], relationships: FamilyRelationship[]): Family[] {
    if (!members.length) return [];

    // No relationships yet — single flat pseudo-family, highest-role member as root
    if (!relationships.length) {
        const sorted = [...members].sort((a, b) => rolePriority(a.role) - rolePriority(b.role));
        const root = sorted[0];
        const rootNode: FamilyNode = { member: root, big_id: null, depth: 0, littles: [] };
        return [{ root, members: sorted, tree: rootNode }];
    }

    const memberMap = new Map(members.map(m => [m.id, m]));
    const littleIds = new Set(relationships.map(r => r.little_id));
    const bigMap = new Map<string, string[]>();

    for (const rel of relationships) {
        if (!bigMap.has(rel.big_id)) bigMap.set(rel.big_id, []);
        bigMap.get(rel.big_id)!.push(rel.little_id);
    }

    // Roots: have littles but are not anyone's little
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
// Tree layout — heavy spacing, zoomed out
// ─────────────────────────────────────────────────────────────────────────────

const X_GAP_BASE = 3.6;
const Y_GAP = -14;

/** Max number of direct littles under any single node (for layout scaling). */
function maxDirectLittles(node: FamilyNode): number {
    const here = node.littles.length;
    const below = node.littles.reduce((m, l) => Math.max(m, maxDirectLittles(l)), 0);
    return Math.max(here, below);
}

function subtreeWidth(node: FamilyNode): number {
    return node.littles.length ? node.littles.reduce((s, l) => s + subtreeWidth(l), 0) : 1;
}

function assignPositions(
    node: FamilyNode,
    depth: number,
    xCenter: number,
    out: Map<string, NodePosition>,
    xGap: number = X_GAP_BASE
): void {
    out.set(node.member.id, { x: xCenter, y: depth * Y_GAP });
    if (!node.littles.length) return;
    const totalW = node.littles.reduce((s, l) => s + subtreeWidth(l), 0) * xGap;
    let cursor = xCenter - totalW / 2;
    for (const little of node.littles) {
        const lw = subtreeWidth(little) * xGap;
        assignPositions(little, depth + 1, cursor + lw / 2, out, xGap);
        cursor += lw;
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
// Three.js subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function TreeEdge({ from, to }: { from: NodePosition; to: NodePosition }) {
    const points = useMemo(() => [
        new THREE.Vector3(from.x, from.y, 0),
        new THREE.Vector3(to.x, to.y, 0),
    ], [from, to]);
    return (
        <Line
            points={points}
            color="#6b7280"
            lineWidth={1.25}
            transparent
            opacity={0.2}
        />
    );
}

/** Tree node: profile picture only, with role-based border and small role badge. */
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

    const borderClass = isCurrentUser
        ? 'ft-aqua-pulse border-[1.5px] border-primary shadow shadow-primary/20'
        : isEBoard
            ? 'border-[1.5px] border-amber-500 shadow shadow-amber-500/15'
            : isBoard
                ? 'border-[1.5px] border-blue-500 shadow shadow-blue-500/15'
                : 'border-[1.5px] border-border bg-card shadow-sm hover:border-muted-foreground/60';

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
                <div
                    className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[10px] font-semibold bg-muted box-content ${borderClass}`}
                >
                    {member.profile_picture_url
                        ? <img src={member.profile_picture_url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-muted-foreground">{initials}</span>}
                </div>
            </div>
        </Html>
    );
}

function AutoCamera({ positions, paddingScale = 1.15, zoomFactorRef }: { positions: Map<string, NodePosition>; paddingScale?: number; zoomFactorRef: React.MutableRefObject<number> }) {
    const { camera, size } = useThree();
    const centerRef = useRef({ x: 0, y: 0 });
    const baseDistRef = useRef(50);
    useLayoutEffect(() => {
        if (!positions.size) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        positions.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
        centerRef.current = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
        const spanX = Math.max(maxX - minX + 8, 4);
        const spanY = Math.max(Math.abs(maxY - minY) + 6, 4);
        const aspect = size.width / size.height;
        const fovRad = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
        baseDistRef.current = Math.max((spanY / 2) / Math.tan(fovRad / 2), (spanX / 2) / (Math.tan(fovRad / 2) * aspect)) * paddingScale;
    }, [positions, camera, size, paddingScale]);
    useFrame(() => {
        const { x: cx, y: cy } = centerRef.current;
        const dist = Math.min(baseDistRef.current * zoomFactorRef.current, 150);
        camera.position.set(cx, cy, dist);
        camera.lookAt(cx, cy, 0);
    });
    return null;
}

function FamilyScene({ family, currentUserId, hoveredId, onHover, onNodeClick, zoomFactorRef }: { family: Family; currentUserId: string; hoveredId: string | null; onHover: (id: string | null) => void; onNodeClick: (memberId: string) => void; zoomFactorRef: React.MutableRefObject<number>; }) {
    const maxLittles = useMemo(() => maxDirectLittles(family.tree), [family]);
    // Extra horizontal spacing when one big has many littles
    const xGap = maxLittles >= 8 ? 1 + maxLittles * 0.15 : X_GAP_BASE;
    const positions = useMemo(() => {
        const m = new Map<string, NodePosition>();
        assignPositions(family.tree, 0, 0, m, xGap);
        return m;
    }, [family, xGap]);
    const allNodes = useMemo(() => collectNodes(family.tree), [family]);
    const allEdges = useMemo(() => collectEdges(family.tree), [family]);
    const paddingScale = maxLittles >= 8 ? 1.5 + Math.min(maxLittles - 8, 28) * 0.03 : 1.35;
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
// Main export
// ─────────────────────────────────────────────────────────────────────────────

const TRANSITION_MS = 650;

export function FamilyTree({
    members,
    onViewProfile,
    onRoleChange,
    onKick,
    onBan,
    canManage,
    canChangeRoles,
    isMobile,
    currentUserId,
    currentUserRole,
}: FamilyTreeProps) {
    useEffect(() => { injectStyles(); }, []);

    // ── Fetch relationships (graceful if table not yet created) ──
    const { data: relationships = [] } = useQuery<FamilyRelationship[]>({
        queryKey: ['family-relationships'],
        queryFn: async () => {
            const { data, error } = await supabase.from('family_relationships').select('big_id, little_id');
            if (error) return [];
            return data ?? [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const families = useMemo(() => buildFamilies(members, relationships), [members, relationships]);

    // ── State ─────────────────────────────────────────────────
    const [activeFamilyIdx, setActiveFamilyIdx] = useState(0);
    const [familyKey, setFamilyKey] = useState(0);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [zoomFactor, setZoomFactor] = useState(1);
    const zoomFactorRef = useRef(1);
    const setZoom = useCallback((fn: (prev: number) => number) => {
        setZoomFactor(prev => {
            const next = fn(prev);
            zoomFactorRef.current = next;
            return next;
        });
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const directoryRef = useRef<HTMLDivElement>(null);
    const isTransRef = useRef(false);
    const activeIdxRef = useRef(0);
    activeIdxRef.current = activeFamilyIdx;
    isTransRef.current = isTransitioning;

    useEffect(() => { setActiveFamilyIdx(0); setFamilyKey(k => k + 1); }, [families.length]);

    const scrollToMember = useCallback((memberId: string) => {
        const el = directoryRef.current?.querySelector(`[data-member-id="${memberId}"]`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    // ── Switch family ─────────────────────────────────────────
    const switchFamily = useCallback((nextIdx: number) => {
        if (isTransRef.current) return;
        if (nextIdx < 0 || nextIdx >= families.length) return;
        if (nextIdx === activeIdxRef.current) return;
        setIsTransitioning(true); isTransRef.current = true;
        setActiveFamilyIdx(nextIdx);
        setTimeout(() => { setFamilyKey(k => k + 1); }, 100);
        setTimeout(() => {
            setIsTransitioning(false); isTransRef.current = false;
            if (directoryRef.current) directoryRef.current.scrollTop = 0;
        }, TRANSITION_MS);
    }, [families.length]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); switchFamily(activeIdxRef.current + 1); }
            if (e.key === 'ArrowUp') { e.preventDefault(); switchFamily(activeIdxRef.current - 1); }
        };
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, [switchFamily]);

    // ── Render ────────────────────────────────────────────────
    if (!members.length) {
        return (
            <div className="flex items-center justify-center h-full opacity-50">
                <div className="text-center space-y-2">
                    <GitBranch className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No members found.</p>
                </div>
            </div>
        );
    }

    const activeFamily = families[activeFamilyIdx] ?? families[0];

    return (
        <div ref={containerRef} className="relative flex w-full h-full overflow-hidden" tabIndex={-1} style={{ outline: 'none' }}>

            {/* ── LEFT: Three.js canvas ── */}
            <div className="relative w-1/2 h-full ft-canvas-bg overflow-hidden flex-shrink-0">

                {/* Canvas — full size, behind overlay */}
                {activeFamily && (
                    <Canvas camera={{ fov: 50, near: 0.1, far: 1000 }} style={{ background: 'transparent' }}>
                        <FamilyScene key={activeFamilyIdx} family={activeFamily} currentUserId={currentUserId ?? ''} hoveredId={hoveredId} onHover={setHoveredId} onNodeClick={scrollToMember} zoomFactorRef={zoomFactorRef} />
                    </Canvas>
                )}

                {/* Overlay: pointer-events-none so canvas gets clicks; children with pointer-events-auto capture their own */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* Nav dots — need pointer-events so they're clickable */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 pointer-events-auto">
                        {families.map((f, i) => (
                            <button key={f.root.id} onClick={() => switchFamily(i)} title={`${f.root.full_name}'s Family`} className="group relative flex items-center justify-end">
                                <div className={`rounded-full transition-all duration-300 ${i === activeFamilyIdx ? 'w-2.5 h-2.5 bg-primary shadow-sm' : 'w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'}`} />
                                <span className="absolute right-full mr-2 px-2 py-1 rounded-md text-xs bg-popover text-popover-foreground border border-border shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    {f.root.full_name?.split(' ')[0]}'s Family
                                </span>
                            </button>
                        ))}
                    </div>
                    {/* Zoom rocker — top right of canvas */}
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
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-75 pointer-events-none text-muted-foreground text-xs">
                    <kbd className="px-2 py-1 rounded border border-border bg-muted/50 font-mono text-base leading-none">↑</kbd>
                    <kbd className="px-2 py-1 rounded border border-border bg-muted/50 font-mono text-base leading-none">↓</kbd>
                    <span className="ml-0.5">switch families</span>
                </div>
            </div>

            {/* ── RIGHT: directory ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={familyKey}
                    className="w-1/2 h-full border-l border-border bg-card flex flex-col flex-shrink-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Sticky family header */}
                    <div className="flex-shrink-0 p-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-border shrink-0">
                                <AvatarImage src={activeFamily?.root.profile_picture_url ?? undefined} />
                                <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
                                    {(activeFamily?.root.full_name ?? '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground truncate">{activeFamily?.root.full_name}'s Family</span>
                                    {activeFamily?.root.role === 'e-board' && <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                    {activeFamily?.root.role === 'board' && <Award className="h-3.5 w-3.5 text-blue-500 shrink-0" />}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {activeFamily?.members.length ?? 0} member{activeFamily?.members.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable member list — grid with dynamic column sizing */}
                    <div ref={directoryRef} className="flex-1 overflow-y-auto p-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3 content-start">
                        <AnimatePresence mode="popLayout">
                            {activeFamily?.members.map((member, i) => (
                                <motion.div
                                    key={member.id}
                                    data-member-id={member.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                                    className={`min-w-0 ${hoveredId === member.id ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-card rounded-lg' : ''}`}
                                >
                                    <PersonCard
                                        person={member}
                                        onViewProfile={onViewProfile}
                                        onRoleChange={onRoleChange}
                                        onKick={onKick}
                                        onBan={onBan}
                                        canManage={canManage}
                                        canChangeRoles={canChangeRoles}
                                        isMobile={isMobile}
                                        currentUserId={currentUserId}
                                        currentUserRole={currentUserRole}
                                        type="member"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default FamilyTree;