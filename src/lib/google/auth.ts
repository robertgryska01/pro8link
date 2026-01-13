// File: src/lib/google/auth.ts
// Google OAuth Authentication using GIS + GAPI
// Implementation based on Google Identity Services

import { GOOGLE_CONFIG, validateConfig } from './config';

// ========================
// AUTH STATE
// ========================
let gapiReady = false;
let gisReady = false;
let tokenClient: any = null;

// Promise that resolves when a valid access token is applied
let tokenReadyResolve: ((value: boolean) => void) | null = null;
if (typeof window !== 'undefined') {
  (window as any).driveTokenReady = new Promise((resolve) => {
    tokenReadyResolve = resolve;
  });
}

// Application state
export const state = {
  isSignedIn: false,
  driveAccessToken: null as string | null,
};

// ========================
// SCRIPT LOADING
// ========================
export function loadGoogleScripts() {
  if (typeof window === 'undefined') return;
  
  // Validate configuration first
  if (!validateConfig()) {
    console.error("Cannot load Google scripts - configuration is incomplete");
    return;
  }

  // Load GAPI
  if (!document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.async = true;
    gapiScript.defer = true;
    gapiScript.onload = () => gapiLoaded();
    document.body.appendChild(gapiScript);
  }

  // Load GIS
  if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    gisScript.async = true;
    gisScript.defer = true;
    gisScript.onload = () => gisLoaded();
    document.body.appendChild(gisScript);
  }
}

// ========================
// GAPI INITIALIZATION
// ========================
function gapiLoaded() {
  if (typeof window === 'undefined' || !(window as any).gapi) return;

  (window as any).gapi.load('client', async () => {
    try {
      await (window as any).gapi.client.init({
        apiKey: GOOGLE_CONFIG.API_KEY,
        discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
      });
      
      gapiReady = true;
      console.log('✅ GAPI initialized');
      tryEnableApp();
    } catch (error) {
      console.error('❌ Error initializing GAPI:', error);
    }
  });
}

// ========================
// GIS INITIALIZATION
// ========================
function gisLoaded() {
  if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) return;

  try {
    tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CONFIG.CLIENT_ID,
      scope: GOOGLE_CONFIG.SCOPES + ' https://www.googleapis.com/auth/drive.readonly',
      callback: onTokenReceived,
    });

    // Expose tokenClient globally for login page
    (window as any).googleTokenClient = tokenClient;

    gisReady = true;
    console.log('✅ GIS initialized');
    tryEnableApp();
  } catch (error) {
    console.error('❌ Error initializing GIS:', error);
  }
}

// ========================
// ENABLE APP
// ========================
function tryEnableApp() {
  if (!gapiReady || !gisReady) {
    console.log('⏳ Waiting for GAPI and GIS...');
    return;
  }

  console.log('✅ Both GAPI and GIS ready');

  // Try to restore token
  restoreTokenOrLogin();
}

// ========================
// TOKEN HANDLING
// ========================
function onTokenReceived(response: any) {
  if (response.error) {
    console.error('❌ Token error:', response.error);
    return;
  }

  console.log('✅ Token received');

  // Calculate expiry timestamp (tokens typically last 3600 seconds)
  const expiresIn = response.expires_in || 3600;
  const expiry = Date.now() + (expiresIn * 1000);

  // Store token
  const tokenData = {
    access_token: response.access_token,
    expiry: expiry,
  };

  try {
    localStorage.setItem('google_token', JSON.stringify(tokenData));
    console.log('✅ Token saved to localStorage');
  } catch (error) {
    console.error('❌ Error saving token:', error);
  }

  // Apply token
  applyToken(response.access_token);
}

function applyToken(token: string) {
  if (typeof window === 'undefined' || !(window as any).gapi?.client) return;

  console.log('✅ Applying token to GAPI');

  // Set token in GAPI client
  (window as any).gapi.client.setToken({ access_token: token });

  // Update state
  state.isSignedIn = true;
  state.driveAccessToken = token;

  // Resolve the token ready promise
  if (tokenReadyResolve) {
    tokenReadyResolve(true);
  }

  // Notify app that user is authenticated
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('google-auth-success'));
  }

  console.log('✅ User authenticated - app ready');
}

// ========================
// TOKEN RESTORATION
// ========================
function restoreTokenOrLogin() {
  try {
    const stored = localStorage.getItem('google_token');
    
    if (!stored) {
      console.log('⚠️ No stored token - user needs to login');
      // GoogleAuthGate will redirect to /login
      return;
    }

    const tokenData = JSON.parse(stored);
    const now = Date.now();

    // Check if token is expired
    if (tokenData.expiry < now) {
      console.log('⚠️ Token expired - clearing storage');
      localStorage.removeItem('google_token');
      // GoogleAuthGate will redirect to /login
      return;
    }

    console.log('✅ Valid token found - restoring session');
    applyToken(tokenData.access_token);
  } catch (error) {
    console.error('❌ Error restoring token:', error);
    localStorage.removeItem('google_token');
    // GoogleAuthGate will redirect to /login
  }
}

// ========================
// TOKEN REFRESH
// ========================
let refreshInterval: NodeJS.Timeout | null = null;

export function startTokenRefresh() {
  if (refreshInterval) return;

  console.log('🔄 Starting token refresh interval');

  refreshInterval = setInterval(() => {
    try {
      const stored = localStorage.getItem('google_token');
      if (!stored) return;

      const tokenData = JSON.parse(stored);
      const now = Date.now();
      const timeUntilExpiry = tokenData.expiry - now;
      const fiveMinutes = 5 * 60 * 1000;

      // Refresh if less than 5 minutes remaining
      if (timeUntilExpiry < fiveMinutes) {
        console.log('🔄 Token expiring soon - refreshing...');
        if (tokenClient) {
          tokenClient.requestAccessToken({ prompt: '' });
        }
      }
    } catch (error) {
      console.error('❌ Error in token refresh:', error);
    }
  }, 60000); // Check every 60 seconds
}

export function stopTokenRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('🛑 Token refresh stopped');
  }
}

// ========================
// SIGN OUT
// ========================
export function signOut() {
  console.log('👋 Signing out...');

  // Clear token
  localStorage.removeItem('google_token');

  // Revoke token if available
  const token = state.driveAccessToken;
  if (token && (window as any).google?.accounts?.oauth2) {
    (window as any).google.accounts.oauth2.revoke(token, () => {
      console.log('✅ Token revoked');
    });
  }

  // Clear state
  state.isSignedIn = false;
  state.driveAccessToken = null;

  // Stop refresh
  stopTokenRefresh();

  // Redirect to login (let Next.js router handle this)
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ========================
// INITIALIZATION
// ========================
export function initGoogleAuth() {
  if (typeof window === 'undefined') return;

  console.log('🚀 Initializing Google Auth...');
  
  // Load scripts
  loadGoogleScripts();
  
  // Start token refresh
  startTokenRefresh();
}
