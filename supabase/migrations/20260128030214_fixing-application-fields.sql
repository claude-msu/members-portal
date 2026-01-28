-- Fix application response fields
-- Board applications:
--  - why_position
--  - relevant_experience
--  - other_commitments
-- Class applications:
--  - why_class
--  - relevant_knowledge
-- Project applications:
--  - relevant_experience
--  - problem_solved
--  - project_detail

begin;

alter table if exists public.applications
  add column if not exists why_class text null,
  add column if not exists relevant_knowledge text null;

-- Remove legacy free-response fields we no longer ask for
alter table if exists public.applications
  drop column if exists previous_experience;

-- Document the applications table columns (current schema)
comment on table public.applications is 'User-submitted applications for board positions, classes, and projects.';

comment on column public.applications.id is 'Primary key for the application.';
comment on column public.applications.user_id is 'Applicant user id (auth.users.id).';

comment on column public.applications.application_type is 'Application category (board, class, project).';
comment on column public.applications.status is 'Review status (pending, accepted, rejected).';

comment on column public.applications.full_name is 'Applicant full name at time of submission (snapshot).';
comment on column public.applications.class_year is 'Applicant class year at time of submission (snapshot).';

comment on column public.applications.board_position is 'Board position being applied for (only for board applications).';
comment on column public.applications.class_id is 'Target class id (only for class applications).';
comment on column public.applications.project_id is 'Target project id (only for project applications).';

comment on column public.applications.class_role is 'Requested class role (teacher or student) for class applications.';
comment on column public.applications.project_role is 'Requested project role (lead or member) for project applications.';

comment on column public.applications.resume_url is 'Storage path in the applications bucket for the uploaded resume (optional).';
comment on column public.applications.transcript_url is 'Storage path in the applications bucket for the uploaded transcript (optional).';

comment on column public.applications.why_position is 'Board: why the applicant wants the position.';
comment on column public.applications.relevant_experience is 'Board/Project: relevant experience for the role (free response).';
comment on column public.applications.other_commitments is 'Board: other major commitments affecting availability.';

comment on column public.applications.why_class is 'Class: why the applicant wants to take/teach the class.';
comment on column public.applications.relevant_knowledge is 'Class: relevant knowledge/preparation for the class.';

comment on column public.applications.problem_solved is 'Project: a problem the applicant has solved / challenge overcome.';
comment on column public.applications.project_detail is 'Project: what the applicant wants to work on / contribute.';

comment on column public.applications.reviewed_by is 'Reviewer user id (auth.users.id) who last reviewed this application.';
comment on column public.applications.reviewed_at is 'Timestamp when the application was reviewed (accepted/rejected).';

comment on column public.applications.created_at is 'Timestamp when the application was created.';
comment on column public.applications.updated_at is 'Timestamp when the application was last updated.';

commit;
