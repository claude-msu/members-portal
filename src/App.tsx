import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import DashboardLayout from "@/components/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Applications from "./pages/dashboard/Applications";
import Events from "./pages/dashboard/Events";
import Classes from "./pages/dashboard/Classes";
import Projects from "./pages/dashboard/Projects";
import Members from "./pages/dashboard/Members";
import Profile from "./pages/Profile";
import Prospects from "./pages/dashboard/Prospects";
import Checkin from "./pages/CheckIn";
import ApplicationViewerPage from "@/pages/ApplicationViewer";
import { ProfileProvider, useProfile } from "./contexts/ProfileContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useEffect } from "react";

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
                path="/dashboard/applications"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Applications />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/events"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Events />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/classes"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Classes />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/projects"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Projects />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/members"
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
                path="/dashboard/prospects"
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
                path="/checkin/:token"
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

              {/* 404 - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;