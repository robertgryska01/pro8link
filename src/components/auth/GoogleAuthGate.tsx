// File: src/components/auth/GoogleAuthGate.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initGoogleAuth, state, signOut, hasValidToken } from '@/lib/google/auth';
import { Loader2 } from 'lucide-react';

interface GoogleAuthGateProps {
  children: React.ReactNode;
}

export function GoogleAuthGate({ children }: GoogleAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Use lazy initialization - function runs ONCE on mount, not every render
  const [isAuthenticated, setIsAuthenticated] = useState(() => hasValidToken());
  const [isLoading, setIsLoading] = useState(() => !hasValidToken());

  // Initialize Google Auth ONCE on mount
  useEffect(() => {
    console.log('[GoogleAuthGate] Starting initialization...');
    initGoogleAuth();
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    // If we already know user is authenticated from localStorage, skip waiting
    if (isAuthenticated) {
      console.log('[GoogleAuthGate] Valid token found - skipping wait');
      return;
    }

    // Listen for auth success
    const handleAuthSuccess = () => {
      console.log('[GoogleAuthGate] Auth success event received');
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    window.addEventListener('google-auth-success', handleAuthSuccess);

    // Check if authenticated via API initialization
    const checkAuth = setInterval(() => {
      if (state.isSignedIn) {
        console.log('[GoogleAuthGate] User signed in via API');
        setIsAuthenticated(true);
        setIsLoading(false);
        clearInterval(checkAuth);
      }
    }, 100);

    // Shorter timeout - 3 seconds instead of 10
    const timeout = setTimeout(() => {
      console.log('[GoogleAuthGate] Initialization timeout (3s)');
      setIsLoading(false);
      clearInterval(checkAuth);
    }, 3000);

    return () => {
      window.removeEventListener('google-auth-success', handleAuthSuccess);
      clearInterval(checkAuth);
      clearTimeout(timeout);
    };
  }, [isAuthenticated]);

  // Handle redirects based on authentication state and pathname
  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && pathname === '/login') {
      console.log('[GoogleAuthGate] Authenticated - redirecting to /dashboard');
      router.replace('/dashboard');
    } else if (!isAuthenticated && pathname !== '/login') {
      console.log('[GoogleAuthGate] Not authenticated - redirecting to /login');
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show loading only if we don't have a valid token and we're still initializing
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f1b2e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // If on login page, always render
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not authenticated, redirect (will show briefly before redirect)
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f1b2e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // User is authenticated - render the app
  return <>{children}</>;
}

// Export sign out function for use in components
export { signOut };
