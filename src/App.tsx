import React, { useEffect } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TooltipProvider } from "./components/ui/tooltip";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import Index from "./pages/Index";
import Auth from "./pages/common/Auth";
import NotFound from "./pages/common/NotFound";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/applications/Applications";
import Events from "./pages/events/Events";
import Classes from "./pages/classes/Classes";
import Projects from "./pages/Projects";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import Prospects from "./pages/Prospects";
import Checkin from "./pages/events/CheckIn";
import ApplicationViewerPage from "@/pages/applications/ApplicationViewer";

// Class imports
import GuideToLeetCode from "./pages/classes/guide-to-leetcode";
import IntroductionToFundamentals from "./pages/classes/introduction-to-fundamentals";
import Week1Lecture1 from "./pages/classes/introduction-to-fundamentals/week-1/lecture-1";
import Week1Lecture2 from "./pages/classes/introduction-to-fundamentals/week-1/lecture-2";
import Week1Activity from "./pages/classes/introduction-to-fundamentals/week-1/activity";
import Week2Lecture1 from "./pages/classes/introduction-to-fundamentals/week-2/lecture-1";
import Week2Lecture2 from "./pages/classes/introduction-to-fundamentals/week-2/lecture-2";
import Week2Activity from "./pages/classes/introduction-to-fundamentals/week-2/activity";
import Week3Lecture1 from "./pages/classes/introduction-to-fundamentals/week-3/lecture-1";
import Week3Lecture2 from "./pages/classes/introduction-to-fundamentals/week-3/lecture-2";
import Week3Activity from "./pages/classes/introduction-to-fundamentals/week-3/activity";
import Week4Lecture1 from "./pages/classes/introduction-to-fundamentals/week-4/lecture-1";
import Week4Lecture2 from "./pages/classes/introduction-to-fundamentals/week-4/lecture-2";
import Week4Activity from "./pages/classes/introduction-to-fundamentals/week-4/activity";
import Week5Lecture1 from "./pages/classes/introduction-to-fundamentals/week-5/lecture-1";
import Week5Lecture2 from "./pages/classes/introduction-to-fundamentals/week-5/lecture-2";
import Week5Activity from "./pages/classes/introduction-to-fundamentals/week-5/activity";
import Week6Lecture1 from "./pages/classes/introduction-to-fundamentals/week-6/lecture-1";
import Week6Lecture2 from "./pages/classes/introduction-to-fundamentals/week-6/lecture-2";
import Week6Activity from "./pages/classes/introduction-to-fundamentals/week-6/activity";
import Week7Lecture1 from "./pages/classes/introduction-to-fundamentals/week-7/lecture-1";
import Week7Lecture2 from "./pages/classes/introduction-to-fundamentals/week-7/lecture-2";
import Week7Activity from "./pages/classes/introduction-to-fundamentals/week-7/activity";
import Week8Lecture1 from "./pages/classes/introduction-to-fundamentals/week-8/lecture-1";
import Week8Lecture2 from "./pages/classes/introduction-to-fundamentals/week-8/lecture-2";
import Week8Activity from "./pages/classes/introduction-to-fundamentals/week-8/activity";

const queryClient = new QueryClient();

/** Handles ?redirect= after email confirmation so members can land on e.g. check-in to claim points */
const PostAuthRedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    if (loading || !user || !redirect) return;
    // Only allow relative paths to avoid open redirect
    const path = redirect.startsWith("/") ? redirect : `/${redirect}`;
    if (!path.startsWith("/")) return;

    // Store as redirect so ProtectedRoute can handle profile completion flow
    sessionStorage.setItem('redirectAfterLogin', path);
    navigate(path, { replace: true });
  }, [loading, user, redirect, navigate]);

  return null;
};

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading, profile } = useAuth();
  const { loading: profileLoading } = useProfile();

  // Show loading spinner while auth is initializing
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // User not logged in - save current URL and redirect to auth
  if (!user) {
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    return <Navigate to="/auth#login" replace />;
  }

  // Check if user is truly new (profile never manually updated after initial creation)
  // We check if updated_at equals created_at, which means they never saved their profile
  const isNewUser = profile?.created_at && profile?.updated_at &&
    profile.created_at === profile.updated_at;
  const isOnProfilePage = window.location.pathname === '/profile';

  if (isNewUser && !isOnProfilePage) {
    // Save where they were trying to go
    const currentPath = window.location.pathname + window.location.search;
    const existingRedirect = sessionStorage.getItem('redirectAfterLogin');

    // Only save if not already stored (to preserve original destination)
    if (!existingRedirect) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }

    return <Navigate to="/profile" replace />;
  }

  // Successfully on protected route - clear redirect if we've reached the destination
  const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
  if (storedRedirect) {
    const currentPath = window.location.pathname + window.location.search;

    // Clear redirect if we've reached the intended destination
    if (currentPath === storedRedirect ||
      window.location.pathname === new URL(storedRedirect, window.location.origin).pathname) {
      sessionStorage.removeItem('redirectAfterLogin');
    }
  }

  // Render children if all checks pass
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <TooltipProvider delayDuration={150} skipDelayDuration={100}>
            <ThemeProvider>
              <PostAuthRedirectHandler />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Applications />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Events />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/classes"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Classes />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Projects />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/members"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Members />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/prospects"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Prospects />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Check-in Route - Requires authentication to track attendance */}
                <Route
                  path="/events/checkin/:token"
                  element={
                    <ProtectedRoute>
                      <Checkin />
                    </ProtectedRoute>
                  }
                />

                {/* Protected route application viewer */}
                <Route
                  path="/applications/:id"
                  element={
                    <ProtectedRoute>
                      <ApplicationViewerPage />
                    </ProtectedRoute>
                  }
                />

                {/* Class resources */}
                <Route
                  path="/classes/introduction-to-fundamentals"
                  element={
                    <ProtectedRoute>
                      <IntroductionToFundamentals />
                    </ProtectedRoute>
                  }
                />

                {/* Introduction to Fundamentals, lectures and activities */}
                {[
                  {
                    week: 1,
                    lectures: [
                      { path: "lecture-1", component: Week1Lecture1 },
                      { path: "lecture-2", component: Week1Lecture2 },
                    ],
                    activity: { component: Week1Activity },
                  },
                  {
                    week: 2,
                    lectures: [
                      { path: "lecture-1", component: Week2Lecture1 },
                      { path: "lecture-2", component: Week2Lecture2 },
                    ],
                    activity: { component: Week2Activity },
                  },
                  {
                    week: 3,
                    lectures: [
                      { path: "lecture-1", component: Week3Lecture1 },
                      { path: "lecture-2", component: Week3Lecture2 },
                    ],
                    activity: { component: Week3Activity },
                  },
                  {
                    week: 4,
                    lectures: [
                      { path: "lecture-1", component: Week4Lecture1 },
                      { path: "lecture-2", component: Week4Lecture2 },
                    ],
                    activity: { component: Week4Activity },
                  },
                  {
                    week: 5,
                    lectures: [
                      { path: "lecture-1", component: Week5Lecture1 },
                      { path: "lecture-2", component: Week5Lecture2 },
                    ],
                    activity: { component: Week5Activity },
                  },
                  {
                    week: 6,
                    lectures: [
                      { path: "lecture-1", component: Week6Lecture1 },
                      { path: "lecture-2", component: Week6Lecture2 },
                    ],
                    activity: { component: Week6Activity },
                  },
                  {
                    week: 7,
                    lectures: [
                      { path: "lecture-1", component: Week7Lecture1 },
                      { path: "lecture-2", component: Week7Lecture2 },
                    ],
                    activity: { component: Week7Activity },
                  },
                  {
                    week: 8,
                    lectures: [
                      { path: "lecture-1", component: Week8Lecture1 },
                      { path: "lecture-2", component: Week8Lecture2 },
                    ],
                    activity: { component: Week8Activity },
                  },
                ].map(({ week, lectures, activity }) => (
                  <React.Fragment key={week}>
                    {lectures.map(({ path, component: Component }) => (
                      <Route
                        key={`week${week}-${path}`}
                        path={`/classes/introduction-to-fundamentals/week-${week}/${path}`}
                        element={
                          <ProtectedRoute>
                            <Component />
                          </ProtectedRoute>
                        }
                      />
                    ))}
                    <Route
                      key={`week${week}-activity`}
                      path={`/classes/introduction-to-fundamentals/week-${week}/activity`}
                      element={
                        <ProtectedRoute>
                          <activity.component />
                        </ProtectedRoute>
                      }
                    />
                  </React.Fragment>
                ))}

                {/* Guide to LeetCode class page */}
                <Route
                  path="/classes/guide-to-leetcode"
                  element={
                    <ProtectedRoute>
                      <GuideToLeetCode />
                    </ProtectedRoute>
                  }
                />

                {/* Redirects from legacy /dashboard/${page} routes to new /${page} routes */}
                <Route path="/dashboard/applications" element={<Navigate to="/applications" replace />} />
                <Route path="/dashboard/events" element={<Navigate to="/events" replace />} />
                <Route path="/dashboard/classes" element={<Navigate to="/classes" replace />} />
                <Route path="/dashboard/projects" element={<Navigate to="/projects" replace />} />
                <Route path="/dashboard/members" element={<Navigate to="/members" replace />} />
                <Route path="/dashboard/profile" element={<Navigate to="/profile" replace />} />
                <Route path="/dashboard/prospects" element={<Navigate to="/prospects" replace />} />

                {/* 404 - Must be last */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ThemeProvider>
          </TooltipProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;