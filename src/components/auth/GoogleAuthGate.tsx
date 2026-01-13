// File: src/components/auth/GoogleAuthGate.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initGoogleAuth, state, signOut } from '@/lib/google/auth';
import { Loader2 } from 'lucide-react';

interface GoogleAuthGateProps {
  children: React.ReactNode;
}

export function GoogleAuthGate({ children }: GoogleAuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 GoogleAuthGate: Starting initialization...');
    
    // Initialize Google Auth on mount
    initGoogleAuth();

    // Listen for auth success
    const handleAuthSuccess = () => {
      console.log('🎉 GoogleAuthGate: Auth success event received');
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Redirect to dashboard if on login page
      if (pathname === '/login') {
        router.replace('/dashboard');
      }
    };

    window.addEventListener('google-auth-success', handleAuthSuccess);

    // Check if already authenticated
    const checkAuth = setInterval(() => {
      if (state.isSignedIn) {
        console.log('✅ GoogleAuthGate: User is signed in');
        setIsAuthenticated(true);
        setIsLoading(false);
        clearInterval(checkAuth);
        
        // Redirect to dashboard if on login page
        if (pathname === '/login') {
          router.replace('/dashboard');
        }
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      console.log('⏱️ GoogleAuthGate: Initialization timeout reached');
      setIsLoading(false);
      clearInterval(checkAuth);
      
      // Redirect to login if not authenticated
      if (!state.isSignedIn && pathname !== '/login') {
        console.log('🔒 Not authenticated - redirecting to /login');
        router.replace('/login');
      }
    }, 10000);

    return () => {
      window.removeEventListener('google-auth-success', handleAuthSuccess);
      clearInterval(checkAuth);
      clearTimeout(timeout);
    };
  }, [router, pathname]);

  // Show loading while initializing
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f1b2e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // If on login page, always render (let login page handle its own logic)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated) {
    console.log('🔒 GoogleAuthGate: User NOT authenticated - redirecting to login');
    router.replace('/login');
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0f1b2e]">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // User is authenticated - render the app
  console.log('✅ GoogleAuthGate: User authenticated - rendering app');
  return <>{children}</>;
}

// Export sign out function for use in components
export { signOut };
