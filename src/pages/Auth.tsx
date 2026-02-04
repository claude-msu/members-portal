import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Auth = () => {
  const location = useLocation();
  const hash = location.hash?.toLowerCase() || '';
  const [isLogin, setIsLogin] = useState(hash === '#signup' ? false : true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [banError, setBanError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signIn, loading: authLoading } = useAuth();
  const isMobile = useIsMobile();

  // Check for password reset token on mount
  useEffect(() => {
    const checkForResetToken = async () => {
      const hash = window.location.hash;

      if (!hash) return;

      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      console.log('Auth page loaded with hash params:', {
        hasAccessToken: !!accessToken,
        type,
        fullHash: hash.substring(0, 50) + '...' // Log first 50 chars for debugging
      });

      if (accessToken && type === 'recovery') {
        console.log('Password recovery flow detected');
        setIsResettingPassword(true);
        setIsLogin(true);
        setShowForgotPassword(false);
      } else if (type === 'signup' || hash.includes('confirmation')) {
        console.log('Email confirmation flow detected');
        // Let Supabase handle the email confirmation
        // The user will be automatically logged in if successful
      }
    };

    checkForResetToken();
  }, []);

  // Sync tab with URL hash (#signup → signup, #login or default → login)
  useEffect(() => {
    const hashParams = new URLSearchParams(hash.substring(1));
    const type = hashParams.get('type');

    // Don't interfere with password reset flow
    if (type === 'recovery') {
      return;
    }

    if (hash === '#signup') {
      setIsLogin(false);
      setIsResettingPassword(false);
    } else if (hash === '#login' || hash === '' || hash.includes('access_token')) {
      setIsLogin(true);
    }
  }, [hash]);

  // Redirect logged-in users (only after auth finishes loading)
  useEffect(() => {
    if (authLoading) return; // Wait for auth to initialize

    if (user) {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      // Navigate to stored redirect or default to dashboard
      // ProtectedRoute will handle profile completion and redirect clearing
      navigate(redirectUrl || '/dashboard', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateEmail = (email: string) => {
    if (!email.endsWith('.edu')) {
      toast({
        title: 'Invalid Email',
        description: 'Please use your .edu email address.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to reset your password.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      // Use the auth page URL - Supabase will append the recovery hash
      const resetUrl = `${window.location.origin}/auth`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });

      if (error) throw error;

      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a link to reset your password. The link expires in 1 hour.',
      });
      setShowForgotPassword(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email and click the verification link.',
      });
      setShowResendVerification(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: 'Required Fields Missing',
        description: 'Please enter and confirm your new password.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please ensure both passwords match.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been updated. You can now log in.',
      });

      // Clear the form and reset state
      setNewPassword('');
      setConfirmPassword('');
      setIsResettingPassword(false);

      // Clear URL hash
      navigate('/auth#login', { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!email.trim()) {
      toast({
        title: 'Required Field Missing',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    if (!password.trim()) {
      toast({
        title: 'Required Field Missing',
        description: 'Please enter your password',
        variant: 'destructive',
      });
      return;
    }

    if (!isLogin && !fullName.trim()) {
      toast({
        title: 'Required Field Missing',
        description: 'Please enter your full name',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Use signIn from AuthContext
        await signIn(email, password);

        toast({
          title: 'Success',
          description: 'Logged in successfully!',
        });

        // Navigate - don't clear redirectAfterLogin here, let ProtectedRoute handle it
        // The useEffect above will handle the navigation when user state updates
      } else {
        // Check if email belongs to a banned user before signup
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('is_banned')
          .eq('email', email)
          .single();

        if (existingProfile?.is_banned) {
          toast({
            title: 'Account Banned',
            description: 'This email address is associated with a banned account. Please contact the e-board for more information.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        // Sign up: include stored redirect in confirmation link so members can claim points after verifying
        const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
        const redirectPath = storedRedirect || '/dashboard';
        const emailRedirectTo =
          storedRedirect
            ? `https://claudemsu.dev/dashboard?redirect=${encodeURIComponent(redirectPath)}`
            : `https://claudemsu.dev/dashboard`;

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo,
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (!authData.user) {
          throw new Error('User creation failed');
        }

        toast({
          title: 'Success',
          description: 'Account created! Please check your email to verify.',
        });
        setIsLogin(true);
      }
    } catch (error: unknown) {
      // Handle specific errors
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      if (errorMessage?.includes('banned')) {
        setBanError('Your account has been banned. Please contact the e-board for more information.');
        toast({
          title: 'Account Banned',
          description: 'Your account has been banned. Please contact the e-board for more information.',
          variant: 'destructive',
        });
      } else if (errorMessage?.toLowerCase().includes('email not confirmed') ||
        errorMessage?.toLowerCase().includes('email link is invalid') ||
        errorMessage?.toLowerCase().includes('confirm your email')) {
        setShowResendVerification(true);
        toast({
          title: 'Email Not Verified',
          description: 'Please verify your email address. Click "Resend Verification Email" below.',
          variant: 'destructive',
        });
      } else if (errorMessage?.toLowerCase().includes('invalid login credentials') ||
        errorMessage?.toLowerCase().includes('invalid email or password')) {
        toast({
          title: 'Invalid Credentials',
          description: 'The email or password you entered is incorrect.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary ${isMobile ? 'px-4 py-8' : 'px-4'}`}>
      <Card className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
        <CardHeader className={isMobile ? 'pb-4' : ''}>
          <CardTitle className={isMobile ? 'text-xl' : ''}>
            {isResettingPassword ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}
          </CardTitle>
          <CardDescription className={isMobile ? 'text-sm' : ''}>
            {isResettingPassword
              ? 'Enter your new password'
              : isLogin
                ? 'Welcome back to Claude Builder Club'
                : 'Join Claude Builder Club @ MSU'}
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'pt-0' : ''}>
          {banError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-sm">
                {banError}
              </AlertDescription>
            </Alert>
          )}

          {isResettingPassword ? (
            <form onSubmit={handlePasswordReset} className={`space-y-4 ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
              <div className="space-y-2">
                <Label htmlFor="newPassword" required>New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  placeholder="Confirm new password"
                />
              </div>

              <Button type="submit" className={`w-full ${isMobile ? 'h-11' : ''}`} disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className={`w-full hover:bg-transparent hover:text-primary transition-all duration-200 ${isMobile ? 'h-11 text-sm' : ''}`}
                onClick={() => {
                  setIsResettingPassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                  navigate('/auth#login', { replace: true });
                }}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className={`space-y-4 ${isMobile ? 'space-y-3' : 'space-y-4'}`}>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" required>Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tom Izzo"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" required>University Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setBanError(null); // Clear ban error when user types
                  }}
                  placeholder="tom@msu.edu"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" required>Password</Label>
                  {isLogin && (
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </Button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setBanError(null); // Clear ban error when user types
                  }}
                  minLength={6}
                  placeholder="Enter your password"
                />
              </div>

              <Button type="submit" className={`w-full ${isMobile ? 'h-11' : ''}`} disabled={loading}>
                {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
              </Button>

              {showResendVerification && isLogin && (
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full ${isMobile ? 'h-11' : ''}`}
                  onClick={handleResendVerification}
                  disabled={loading}
                >
                  Resend Verification Email
                </Button>
              )}

              {showForgotPassword && isLogin && (
                <Alert className="border-primary/20">
                  <AlertDescription>
                    <p className="text-sm mb-3">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleForgotPassword}
                        disabled={loading}
                      >
                        Send Reset Link
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowForgotPassword(false)}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="button"
                variant="ghost"
                className={`w-full hover:bg-transparent hover:text-primary transition-all duration-200 ${isMobile ? 'h-11 text-sm' : ''}`}
                onClick={() => {
                  const nextLogin = !isLogin;
                  setIsLogin(nextLogin);
                  setBanError(null);
                  setShowForgotPassword(false);
                  setShowResendVerification(false);
                  navigate(nextLogin ? '/auth#login' : '/auth#signup', { replace: true });
                }}
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;