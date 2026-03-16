import { useState, useEffect } from 'react';
import { useProfile } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Eye, Calendar, Briefcase, BookOpen, FileCode, ChevronDown, ChevronRight, Folder, FolderOpen, User, Shield, Search } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ApplicationCreateModal } from '@/components/modals/ApplicationCreateModal';
import { Input } from '@/components/ui/input';
import type { ApplicationWithProfile, ApplicationGroup } from '@/contexts/AuthContext';

const Applications = ({ openCreateModal: openCreateModalProp = false }: { openCreateModal?: boolean }) => {
  const { isBoardOrAbove, userApplications, applicationsLoading, refreshApplications } = useProfile();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const openFromRoute = location.pathname === '/applications/new';
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(openCreateModalProp || openFromRoute);

  // Sync modal open state when landing on /applications/new (e.g. from MemberResourceGate)
  useEffect(() => {
    if (openFromRoute) setIsCreateModalOpen(true);
  }, [openFromRoute]);

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    if (location.pathname === '/applications/new') {
      navigate('/applications', { replace: true });
    }
  };
  const [myApplicationsCollapsed, setMyApplicationsCollapsed] = useState(false);
  const [myPendingCollapsed, setMyPendingCollapsed] = useState(false);
  const [myReviewedCollapsed, setMyReviewedCollapsed] = useState(true);
  const [reviewApplicationsCollapsed, setReviewApplicationsCollapsed] = useState(false);
  const [reviewPendingCollapsed, setReviewPendingCollapsed] = useState(false);
  const [reviewReviewedCollapsed, setReviewReviewedCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const appsDisabled: boolean = false;

  /** Build searchable string for an application (name, email, type, role, class/project name). */
  const getSearchableText = (app: ApplicationWithProfile): string => {
    const parts: string[] = [
      app.profiles?.full_name ?? '',
      app.profiles?.email ?? '',
      app.application_type ?? '',
      app.class_role ?? '',
      app.project_role ?? '',
      app.board_position ?? '',
      app.classes?.name ?? '',
      app.projects?.name ?? '',
    ];
    return parts.filter(Boolean).join(' ').toLowerCase();
  };

  const applicationMatchesSearch = (app: ApplicationWithProfile): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    return getSearchableText(app).includes(query);
  };

  const groupMatchesSearch = (group: ApplicationGroup): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.trim().toLowerCase();
    if (group.applicantName.toLowerCase().includes(query)) return true;
    return group.applications.some(applicationMatchesSearch);
  };

  const getStatusVariant = (status: string): 'green' | 'red' | 'default' => {
    switch (status) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatApplicationType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getApplicationIcon = (type: string) => {
    switch (type) {
      case 'board':
        return <Briefcase className="h-4 w-4" />;
      case 'project':
        return <FileCode className="h-4 w-4" />;
      case 'class':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const getApplicationTarget = (application: ApplicationWithProfile) => {
    if (application.application_type === 'board' && application.board_position) {
      return application.board_position;
    }
    return formatApplicationType(application.application_type);
  };

  /** Dot color by status (only used in review-pending section). */
  const getReviewPendingDotClass = (a: ApplicationWithProfile, currentAppId: string) => {
    if (a.id === currentAppId) return 'bg-primary application-dot-current';
    if (a.status === 'accepted') return 'bg-green-500 opacity-80';
    if (a.status === 'rejected') return 'bg-red-500 opacity-80';
    return 'bg-primary opacity-60';
  };

  const renderApplicationCard = (
    app: ApplicationWithProfile,
    samePersonApplications?: ApplicationWithProfile[],
    dotVariant?: 'review-pending'
  ) => {
    const showDots =
      dotVariant === 'review-pending' && samePersonApplications && samePersonApplications.length > 1;
    const sortedSame = showDots
      ? [...samePersonApplications].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      : [];

    return (
      <Card key={app.id} className="hover:shadow-md transition-shadow p-6">
        <div className={`flex h-full justify-between items-center ${isMobile ? 'gap-3' : ''}`}>
          <div className={`flex flex-col justify-between ${isMobile ? 'h-full' : 'gap-2'}`}>
            <div className="flex items-center gap-2">
              {getApplicationIcon(app.application_type)}
              <CardTitle className={isMobile ? 'text-lg' : ''}>{app.profiles?.full_name ?? 'Applicant'}</CardTitle>
            </div>
            <CardDescription className={`flex items-center ${isMobile ? 'flex-col items-start mt-1 gap-1' : 'mt-1 gap-2'}`}>
              <span>{getApplicationTarget(app)}</span>
              <span className={isMobile ? 'hidden' : ''}>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(app.created_at).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <div className={`flex ${isMobile ? 'flex-col h-full justify-between items-end' : 'items-center gap-7'}`}>
            {showDots && (
              <div className="flex items-center gap-1 shrink-0" title={`${sortedSame.length} applications from this person`}>
                {sortedSame.map((a) => (
                  <span
                    key={a.id}
                    className={`h-1.5 w-1.5 rounded-full shrink-0 ${getReviewPendingDotClass(a, app.id)}`}
                    aria-hidden
                  />
                ))}
              </div>
            )}
            <Badge variant={getStatusVariant(app.status)} className="capitalize">
              {app.status}
            </Badge>
            {!isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    window.open(`/applications/${app.id}`, '_blank', 'noopener');
                  } else {
                    navigate(`/applications/${app.id}`);
                  }
                }}
                className="rounded-md px-3 h-9"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isBoardOrAbove ? 'Review' : 'View'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderApplicationSection = (
    title: string,
    applications: ApplicationWithProfile[],
    collapsed: boolean,
    onToggle: () => void,
    icon: React.ReactNode,
    allFromSamePerson?: ApplicationWithProfile[]
  ) => {
    if (applications.length === 0) return null;

    return (
      <Collapsible open={!collapsed} onOpenChange={onToggle}>
        <div className="space-y-4">
          <CollapsibleTrigger asChild>
            <button className="w-full justify-start p-0 h-auto border-0 hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit">
              <div className="flex items-center gap-2 w-full">
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-lg font-medium">{title}</span>
                </div>
                <Badge>{applications.length}</Badge>
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className={`grid gap-4 ${isMobile ? "ml-0" : "ml-6"}`}>
              {applications.map((app) => renderApplicationCard(app, allFromSamePerson, undefined))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  /** Renders review pending (flat by time) with status dots. */
  const renderReviewPendingSection = (
    title: string,
    applications: ApplicationWithProfile[],
    collapsed: boolean,
    onToggle: () => void,
    icon: React.ReactNode,
    allReviewByUser: Map<string, ApplicationWithProfile[]>
  ) => {
    if (applications.length === 0) return null;
    return (
      <Collapsible open={!collapsed} onOpenChange={onToggle}>
        <div className="space-y-4">
          <CollapsibleTrigger asChild>
            <button className="w-full justify-start p-0 h-auto border-0 hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit">
              <div className="flex items-center gap-2 w-full">
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-lg font-medium">{title}</span>
                </div>
                <Badge>{applications.length}</Badge>
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className={`grid gap-4 ${isMobile ? "ml-0" : "ml-6"}`}>
              {applications.map((app) => {
                const samePerson = (allReviewByUser.get(app.user_id) ?? []).sort(
                  (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
                return renderApplicationCard(app, samePerson, 'review-pending');
              })}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  /** Renders a review section with applications grouped by applicant (no dots). */
  const renderReviewSection = (
    title: string,
    groups: ApplicationGroup[],
    collapsed: boolean,
    onToggle: () => void,
    icon: React.ReactNode
  ) => {
    const totalCount = groups.reduce((acc, g) => acc + g.applications.length, 0);
    if (totalCount === 0) return null;

    return (
      <Collapsible open={!collapsed} onOpenChange={onToggle}>
        <div className="space-y-4">
          <CollapsibleTrigger asChild>
            <button className="w-full justify-start p-0 h-auto border-0 hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit">
              <div className="flex items-center gap-2 w-full">
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-lg font-medium">{title}</span>
                </div>
                <Badge>{totalCount}</Badge>
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className={`space-y-6 ${isMobile ? "ml-0" : "ml-6"}`}>
              {groups.map((group) => (
                <div key={group.user_id} className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{group.applicantName}</span>
                    <Badge variant="secondary" className="text-xs">
                      {group.applications.length} {group.applications.length === 1 ? 'application' : 'applications'}
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {group.applications.map((app) => renderApplicationCard(app, undefined, undefined))}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    );
  };

  // Filter by search (name, email, type, role, class/project name)
  const filteredSelfPending = !userApplications
    ? []
    : userApplications.self.pending.filter(applicationMatchesSearch);
  const filteredSelfDecided = !userApplications
    ? []
    : userApplications.self.decided.filter(applicationMatchesSearch);
  const filteredReviewPending = !userApplications
    ? []
    : userApplications.review.pending.filter(applicationMatchesSearch);
  const filteredReviewDecided = !userApplications
    ? []
    : !searchQuery.trim()
      ? userApplications.review.decided
      : userApplications.review.decided
          .filter(groupMatchesSearch)
          .map((g) => ({
            ...g,
            applications: g.applications.filter(applicationMatchesSearch),
          }))
          .filter((g) => g.applications.length > 0);

  const myApplicationsTotal = filteredSelfPending.length + filteredSelfDecided.length;
  const reviewApplicationsTotal =
    filteredReviewPending.length +
    filteredReviewDecided.reduce((acc, g) => acc + g.applications.length, 0);
  const hasAnyApplicationsUnfiltered = userApplications
    ? userApplications.self.pending.length +
      userApplications.self.decided.length +
      userApplications.review.pending.length +
      userApplications.review.decided.reduce((acc, g) => acc + g.applications.length, 0) > 0
    : false;
  const showEmptySearchState = searchQuery.trim() && myApplicationsTotal === 0 && reviewApplicationsTotal === 0;

  /** All review applications by user_id (pending + decided) for status dots in pending section. */
  const allReviewByUser = (() => {
    const map = new Map<string, ApplicationWithProfile[]>();
    for (const app of userApplications?.review.pending ?? []) {
      const list = map.get(app.user_id) ?? [];
      list.push(app);
      map.set(app.user_id, list);
    }
    for (const g of userApplications?.review.decided ?? []) {
      for (const app of g.applications) {
        const list = map.get(app.user_id) ?? [];
        list.push(app);
        map.set(app.user_id, list);
      }
    }
    return map;
  })();

  return (
    <div className="p-6 w-full h-full overflow-y-auto">
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>Applications</h1>
          <p className="text-muted-foreground">
            {isBoardOrAbove ? 'Manage applications' : 'Your applications'}
          </p>
        </div>
        <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'items-center'}`}>
          <Button onClick={() => setIsCreateModalOpen(true)} disabled={appsDisabled} className={hasAnyApplicationsUnfiltered && !isMobile ? 'shrink-0' : ''}>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
          {hasAnyApplicationsUnfiltered && (
            <div className={`relative ${isMobile ? "w-40" : "w-64"}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isMobile ? "Search" : "Search applications..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>
      </div>

      {applicationsLoading ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading applications...</p>
          </CardContent>
        </Card>
      ) : !userApplications || !hasAnyApplicationsUnfiltered ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {appsDisabled
                ? 'Applications are currently closed. Please wait for Rush Week to submit an application.'
                : 'No applications yet. Click "New Application" to get started.'
              }
            </p>
          </CardContent>
        </Card>
      ) : showEmptySearchState ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No applications match your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 mt-6">
          {/* My Applications Folder */}
          {myApplicationsTotal > 0 && (
            <Collapsible open={!myApplicationsCollapsed} onOpenChange={setMyApplicationsCollapsed}>
              <div className="space-y-4">
                <CollapsibleTrigger asChild>
                  <button className="w-full justify-start p-0 h-auto hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit border-0">
                    <div className="flex items-center gap-2 w-full">
                      {myApplicationsCollapsed ? (
                        <Folder className="h-5 w-5" />
                      ) : (
                        <FolderOpen className="h-5 w-5" />
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <h2 className="text-xl font-semibold">My Applications</h2>
                      </div>
                      <Badge>{myApplicationsTotal}</Badge>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  {/* My Pending Applications (by time, no dots) */}
                  {renderApplicationSection(
                    "Pending",
                    filteredSelfPending,
                    myPendingCollapsed,
                    () => setMyPendingCollapsed(!myPendingCollapsed),
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>,
                    undefined
                  )}

                  {/* My Reviewed Applications (by time, no dots) */}
                  {renderApplicationSection(
                    "Reviewed",
                    filteredSelfDecided,
                    myReviewedCollapsed,
                    () => setMyReviewedCollapsed(!myReviewedCollapsed),
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>,
                    undefined
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}

          {/* Review Applications Folder */}
          {reviewApplicationsTotal > 0 && (
            <Collapsible open={!reviewApplicationsCollapsed} onOpenChange={setReviewApplicationsCollapsed}>
              <div className="space-y-4">
                <CollapsibleTrigger asChild>
                  <button className="w-full justify-start p-0 h-auto hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit border-0">
                    <div className="flex items-center gap-2 w-full">
                      {reviewApplicationsCollapsed ? (
                        <Folder className="h-5 w-5" />
                      ) : (
                        <FolderOpen className="h-5 w-5" />
                      )}
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <h2 className="text-xl font-semibold">Review Applications</h2>
                      </div>
                      <Badge>{reviewApplicationsTotal}</Badge>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4">
                  {/* Review Pending (flat by time, status dots: green/red/primary, current pulsating) */}
                  {renderReviewPendingSection(
                    "Pending Review",
                    filteredReviewPending,
                    reviewPendingCollapsed,
                    () => setReviewPendingCollapsed(!reviewPendingCollapsed),
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>,
                    allReviewByUser
                  )}

                  {/* Review Decided (grouped by applicant only, no dots) */}
                  {renderReviewSection(
                    "Reviewed",
                    filteredReviewDecided,
                    reviewReviewedCollapsed,
                    () => setReviewReviewedCollapsed(!reviewReviewedCollapsed),
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </div>
      )}

      <ApplicationCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSuccess={() => {
          handleCloseCreateModal();
          refreshApplications();
          // Invalidate the applications query to refresh the UI
          queryClient.invalidateQueries({ queryKey: ['user-applications'] });
        }}
      />
    </div>
  );
};

export default Applications;