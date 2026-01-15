// File: src/app/login/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { state } from '@/lib/google/auth';

// Custom Link Icon with Gradient (matching icon.png)
const GradientLinkIcon = ({ className }: { className?: string }) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B9CFF" />
        <stop offset="100%" stopColor="#4ADE80" />
      </linearGradient>
    </defs>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="url(#iconGradient)"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="url(#iconGradient)" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenClient, setTokenClient] = useState<any>(null);

  useEffect(() => {
    // Check if already authenticated
    if (state.isSignedIn) {
      console.log('[LoginPage] Already authenticated, redirecting to dashboard');
      router.replace('/dashboard');
      return;
    }

    // Listen for auth success
    const handleAuthSuccess = () => {
      console.log('[LoginPage] Auth success - redirecting to dashboard');
      router.replace('/dashboard');
    };

    window.addEventListener('google-auth-success', handleAuthSuccess);

    // Wait for tokenClient to be initialized
    const checkTokenClient = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).googleTokenClient) {
        setTokenClient((window as any).googleTokenClient);
        clearInterval(checkTokenClient);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkTokenClient);
      if (!tokenClient) {
        setError('Failed to initialize Google Sign-In. Please refresh the page.');
      }
    }, 10000);

    return () => {
      window.removeEventListener('google-auth-success', handleAuthSuccess);
      clearInterval(checkTokenClient);
      clearTimeout(timeout);
    };
  }, [router, tokenClient]);

  const handleLogin = () => {
    if (!tokenClient) {
      setError('Google Sign-In is not ready yet. Please wait a moment and try again.');
      return;
    }

    console.log('[LoginPage] Initiating Google Sign-In...');
    setIsLoading(true);
    setError(null);

    try {
      // Request access token with consent screen
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } catch (err: any) {
      console.error('[LoginPage] Error during sign-in:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f1b2e] p-4">
      <div className="absolute inset-0 bg-noise z-0"></div>
      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <span
            className="font-headline text-3xl font-semibold tracking-wider bg-clip-text text-transparent mr-px"
            style={{ backgroundImage: 'linear-gradient(to right, #3B9CFF, #4DA3FF)'}}
          >
            Pro
          </span>
          <GradientLinkIcon />
          <span
            className="font-headline text-3xl font-semibold tracking-wider bg-clip-text text-transparent ml-px"
            style={{ backgroundImage: 'linear-gradient(to right, #34D399, #4ADE80)'}}
          >
            Link
          </span>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 bg-destructive/20 border-destructive/50 text-destructive-foreground">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="bg-background/50 border-white/10 backdrop-blur-sm rounded-xl shadow-2xl shadow-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-white/90">
              Sign In
            </CardTitle>
            <CardDescription className="text-white/60">
              Sign in with your Google account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleLogin}
              disabled={isLoading || !tokenClient}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : !tokenClient ? (
                'Initializing...'
              ) : (
                'Sign In with Google'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
