// File: src/app/auth/page.tsx
'use client';

import { useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from '@/lib/firebase/config';

export default function AuthPage() {
  useEffect(() => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    // Ensure persistence is set to avoid issues in some environments
    setPersistence(auth, browserLocalPersistence).then(() => {
        signInWithPopup(auth, provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
    
            // Send message to parent window and close self
            window.opener?.postMessage('authSuccess', window.location.origin);
            window.close();
          })
          .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            
            window.opener?.postMessage(`authError: ${errorMessage}`, window.location.origin);
            window.close();
          });
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.opener?.postMessage(`authError: Persistence Error: ${errorMessage}`, window.location.origin);
        window.close();
    });

  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#0f1b2e', color: 'white', fontFamily: 'sans-serif' }}>
      <p>Please wait, authenticating...</p>
    </div>
  );
}
