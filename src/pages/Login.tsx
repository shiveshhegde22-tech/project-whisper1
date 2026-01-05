import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { isEmailAllowed } from '@/lib/allowedEmailsService';

export default function Login() {
  const { user, loading, signIn } = useAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already logged in
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signIn();
      // Don't show success toast here - it will be shown after access check
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive"
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 flex-col justify-center px-8 xl:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="relative z-10">
          <h1 className="font-display text-3xl xl:text-4xl font-bold text-foreground mb-4">
            Kirti Mistry
          </h1>
          <p className="text-base xl:text-lg text-primary font-medium mb-6 xl:mb-8">INTERIOR DESIGN</p>
          <p className="text-lg xl:text-xl text-muted-foreground leading-relaxed max-w-md">
            Welcome to your design studio dashboard. Manage your portfolio, track client submissions, and analyze your business—all in one place.
          </p>
          
          <div className="mt-12 xl:mt-16 p-4 xl:p-6 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
            <p className="text-muted-foreground italic text-sm xl:text-base">
              "The best rooms have something to say about the people who live in them."
            </p>
            <p className="text-xs xl:text-sm text-primary mt-2">— David Hicks</p>
          </div>
        </div>
      </div>

      {/* Right side - Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8 sm:mb-12">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Kirti Mistry
            </h1>
            <p className="text-primary font-medium text-sm sm:text-base">INTERIOR DESIGN</p>
          </div>

          <div className="text-center lg:text-left mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-foreground mb-2">
              Welcome Back
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </div>

          <Button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full h-11 sm:h-12 text-sm sm:text-base"
            size="lg"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>

          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6 sm:mt-8">
            Only authorized administrators can access this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
