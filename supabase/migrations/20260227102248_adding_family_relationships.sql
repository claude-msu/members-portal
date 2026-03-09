-- Migration: Add Big/Little Family System
-- =========================================================
-- Creates a self-referential mentorship relationship table
-- on top of existing profiles. No user data is duplicated —
-- only foreign key linkages between existing profile UUIDs.

-- ── Table ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS family_relationships (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  big_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  little_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- A person can only have ONE big (but a big can have many littles)
  UNIQUE (little_id),
  -- Prevent self-referential relationships
  CHECK (big_id <> little_id)
);

CREATE INDEX IF NOT EXISTS idx_family_relationships_big_id    ON family_relationships(big_id);
CREATE INDEX IF NOT EXISTS idx_family_relationships_little_id ON family_relationships(little_id);

-- ── RLS Policies ──────────────────────────────────────────

ALTER TABLE family_relationships ENABLE ROW LEVEL SECURITY;

-- All authenticated users (including prospects) can view family relationships
CREATE POLICY "Users can view family relationships"
  ON family_relationships FOR SELECT
  TO authenticated
  USING (true);

-- Only board and e-board can manage relationships
CREATE POLICY "Board can manage family relationships"
  ON family_relationships FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('board', 'e-board')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('board', 'e-board')
    )
  );

-- ── get_family_tree(root_id) ──────────────────────────────
-- Recursively fetches an entire family rooted at any member.
-- Returns every descendant node with depth, big_id linkage,
-- profile data, and role — all in one round trip.

CREATE OR REPLACE FUNCTION get_family_tree(_root_id UUID)
RETURNS TABLE (
  id                  UUID,
  big_id              UUID,
  depth               INTEGER,
  full_name           TEXT,
  profile_picture_url TEXT,
  email               TEXT,
  class_year          TEXT,
  linkedin_username        TEXT,
  points              INTEGER,
  role                app_role
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  WITH RECURSIVE family AS (
    -- Anchor: the root member
    SELECT
      p.id,
      NULL::UUID        AS big_id,
      0                 AS depth,
      p.full_name,
      p.profile_picture_url,
      p.email,
      p.class_year,
      p.linkedin_username,
      p.points,
      ur.role
    FROM profiles p
    LEFT JOIN user_roles ur ON ur.user_id = p.id
    WHERE p.id = _root_id
      AND NOT p.is_banned

    UNION ALL

    -- Recursive: find each generation of littles
    SELECT
      p.id,
      fr.big_id,
      f.depth + 1,
      p.full_name,
      p.profile_picture_url,
      p.email,
      p.class_year,
      p.linkedin_username,
      p.points,
      ur.role
    FROM family f
    JOIN family_relationships fr ON fr.big_id = f.id
    JOIN profiles p              ON p.id = fr.little_id
    LEFT JOIN user_roles ur      ON ur.user_id = p.id
    WHERE NOT p.is_banned
  )
  SELECT * FROM family
  ORDER BY depth, full_name;
$$;

GRANT EXECUTE ON FUNCTION get_family_tree(UUID) TO authenticated;

-- ── get_all_families() ────────────────────────────────────
-- Returns the root node of every family (members who have
-- littles but no big of their own). The root is always the
-- e-board member at the top of each lineage.
-- Sorted: e-board roots first, then board, then member —
-- all alphabetically within each tier.

CREATE OR REPLACE FUNCTION get_all_family_roots()
RETURNS TABLE (
  id                  UUID,
  full_name           TEXT,
  profile_picture_url TEXT,
  email               TEXT,
  role                app_role,
  family_size         BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  -- Members who have at least one little but no big
  WITH roots AS (
    SELECT DISTINCT big_id AS root_id
    FROM family_relationships
    WHERE big_id NOT IN (
      SELECT little_id FROM family_relationships
    )
  ),
  sizes AS (
    -- Count total family members (bigs + all their descendants)
    SELECT
      r.root_id,
      COUNT(DISTINCT fr.little_id) AS family_size
    FROM roots r
    LEFT JOIN family_relationships fr ON (
      -- Simple 1-level count for now; full recursive size via get_family_tree
      fr.big_id = r.root_id
    )
    GROUP BY r.root_id
  )
  SELECT
    p.id,
    p.full_name,
    p.profile_picture_url,
    p.email,
    ur.role,
    COALESCE(s.family_size, 0) AS family_size
  FROM roots r
  JOIN profiles p    ON p.id = r.root_id
  LEFT JOIN user_roles ur ON ur.user_id = p.id
  LEFT JOIN sizes s  ON s.root_id = r.root_id
  WHERE NOT p.is_banned
  ORDER BY
    CASE ur.role
      WHEN 'e-board' THEN 0
      WHEN 'board'   THEN 1
      ELSE               2
    END,
    p.full_name;
$$;

GRANT EXECUTE ON FUNCTION get_all_family_roots() TO authenticated;

-- ── Comments ──────────────────────────────────────────────

COMMENT ON TABLE family_relationships IS
  'Big/little mentorship pairings. Self-referential on profiles — '
  'no user data duplicated. Each member has at most one big (UNIQUE little_id) '
  'but a big can mentor any number of littles. Intentionally minimal: '
  'just big_id → little_id linkages, no timestamps or semester tracking.';

COMMENT ON FUNCTION get_family_tree(UUID) IS
  'Recursive CTE walking the entire family tree rooted at _root_id. '
  'Returns all descendants with depth, role, and profile info in one query.';

COMMENT ON FUNCTION get_all_family_roots() IS
  'Returns the root (topmost ancestor) of every family — '
  'members who have littles but no big themselves. '
  'E-board roots are sorted first.';