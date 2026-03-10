import type { Database } from '@/integrations/supabase/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];

// Generic membership type
export type MembershipInfo = {
  id: string;
  user_id: string;
  role: string;
  profile: Profile;
};

// Generic item with members
export type ItemWithMembers<T> = T & {
  members: MembershipInfo[];
  memberCount: number;
  userMembership?: MembershipInfo;
};

// Metadata item for cards
export type MetadataItem = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  interactive?: boolean;
  render?: (item: MetadataItem) => React.ReactNode;
};

// Card action button
export type CardAction = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  /** When 'icon', renders as icon-only button (e.g. for copy emails). */
  size?: 'default' | 'icon';
};

// Detail section for detail modals
export type DetailSection = {
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
};

// ─── Family tree (Members page + FamilyTree component) ───────────────────────
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
  members: MemberWithRole[];
  tree: FamilyNode;
}

const rolePriority = (r: AppRole) =>
  r === 'e-board' ? 0 : r === 'board' ? 1 : r === 'member' ? 2 : 3;

export function buildFamilies(
  members: MemberWithRole[],
  relationships: FamilyRelationship[],
): Family[] {
  if (!members.length) return [];

  const memberMap = new Map(members.map((m) => [m.id, m]));

  if (!relationships.length) {
    const sorted = [...members].sort((a, b) => rolePriority(a.role) - rolePriority(b.role));
    const root = sorted[0];
    const rootNode: FamilyNode = { member: root, big_id: null, depth: 0, littles: [] };
    return [{ root, members: sorted, tree: rootNode }];
  }

  const littleIds = new Set(relationships.map((r) => r.little_id));
  const bigMap = new Map<string, string[]>();
  for (const rel of relationships) {
    if (!bigMap.has(rel.big_id)) bigMap.set(rel.big_id, []);
    bigMap.get(rel.big_id)!.push(rel.little_id);
  }

  const rootIds = [...bigMap.keys()].filter((id) => !littleIds.has(id));

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
    .map((id) => {
      const root = memberMap.get(id);
      const tree = buildNode(id, null, 0);
      if (!root || !tree) return null;
      const flat: MemberWithRole[] = [];
      const q = [tree];
      while (q.length) {
        const n = q.shift()!;
        flat.push(n.member);
        n.littles.forEach((l) => q.push(l));
      }
      return { root, members: flat, tree } satisfies Family;
    })
    .filter((f): f is Family => f !== null)
    .sort((a, b) => {
      const rd = rolePriority(a.root.role) - rolePriority(b.root.role);
      return rd !== 0 ? rd : (a.root.full_name ?? '').localeCompare(b.root.full_name ?? '');
    });
}