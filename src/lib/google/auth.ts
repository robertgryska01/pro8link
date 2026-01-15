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
let isInitialized = false;

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
// SYNCHRONOUS TOKEN CHECK
// ========================
/**
 * Synchronously check if we have a valid token in localStorage
 * This is a READ-ONLY check that doesn't modify state
 */
export function hasValidToken(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem('google_token');
    if (!stored) return false;
    
    const tokenData = JSON.parse(stored);
    const now = Date.now();
    
    // Check if token is still valid (not expired)
    if (tokenData.expiry && tokenData.expiry > now) {
      return true;
    } else {
      localStorage.removeItem('google_token');
      return false;
    }
  } catch (error) {
    console.error('[AUTH] Error checking token:', error);
    localStorage.removeItem('google_token');
    return false;
  }
}

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
      console.log('[AUTH] GAPI initialized');
      tryEnableApp();
    } catch (error) {
      console.error('[AUTH] Error initializing GAPI:', error);
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
    console.log('[AUTH] GIS initialized');
    tryEnableApp();
  } catch (error) {
    console.error('[AUTH] Error initializing GIS:', error);
  }
}

// ========================
// TOKEN HANDLING
// ========================
function onTokenReceived(tokenResponse: any) {
  if (tokenResponse.error) {
    console.error('[AUTH] Token error:', tokenResponse.error);
    return;
  }

  console.log('[AUTH] Token received');
  
  // Store token with expiry
  const expiryTime = Date.now() + (tokenResponse.expires_in * 1000);
  localStorage.setItem('google_token', JSON.stringify({
    access_token: tokenResponse.access_token,
    expiry: expiryTime
  }));

  // Apply token
  applyToken(tokenResponse.access_token);
}

function tryEnableApp() {
  if (!gapiReady || !gisReady) return;

  console.log('[AUTH] Both GAPI and GIS ready');
  
  // Try to restore token or prompt login
  restoreTokenOrLogin();
}

function applyToken(token: string) {
  if (typeof window === 'undefined' || !(window as any).gapi?.client) return;

  console.log('[AUTH] Applying token to GAPI');

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

  console.log('[AUTH] User authenticated - app ready');
}

// ========================
// TOKEN RESTORATION
// ========================
function restoreTokenOrLogin() {
  try {
    const stored = localStorage.getItem('google_token');
    
    if (!stored) {
      console.log('[AUTH] No stored token - user needs to login');
      return;
    }

    const tokenData = JSON.parse(stored);
    const now = Date.now();

    // Check if token is expired
    if (tokenData.expiry < now) {
      console.log('[AUTH] Token expired - clearing storage');
      localStorage.removeItem('google_token');
      return;
    }

    console.log('[AUTH] Valid token found - restoring session');
    applyToken(tokenData.access_token);
  } catch (error) {
    console.error('[AUTH] Error restoring token:', error);
    localStorage.removeItem('google_token');
  }
}

// ========================
// TOKEN REFRESH
// ========================
let refreshInterval: NodeJS.Timeout | null = null;

export function startTokenRefresh() {
  if (refreshInterval) return;

  console.log('[AUTH] Starting token refresh interval');

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
        console.log('[AUTH] Token expiring soon - refreshing...');
        if (tokenClient) {
          tokenClient.requestAccessToken({ prompt: '' });
        }
      }
    } catch (error) {
      console.error('[AUTH] Error in token refresh:', error);
    }
  }, 60000); // Check every 60 seconds
}

export function stopTokenRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('[AUTH] Token refresh stopped');
  }
}

// ========================
// SIGN OUT
// ========================
export function signOut() {
  console.log('[AUTH] Signing out...');

  // Clear token
  localStorage.removeItem('google_token');

  // Revoke token if available
  const token = state.driveAccessToken;
  if (token && (window as any).google?.accounts?.oauth2) {
    (window as any).google.accounts.oauth2.revoke(token, () => {
      console.log('[AUTH] Token revoked');
    });
  }

  // Clear state
  state.isSignedIn = false;
  state.driveAccessToken = null;

  // Stop refresh
  stopTokenRefresh();

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ========================
// INITIALIZATION
// ========================
export function initGoogleAuth() {
  if (typeof window === 'undefined') return;
  
  // Prevent multiple initializations
  if (isInitialized) {
    console.log('[AUTH] Google Auth already initialized');
    return;
  }

  console.log('[AUTH] Initializing Google Auth...');
  isInitialized = true;
  
  // Load scripts
  loadGoogleScripts();
  
  // Start token refresh
  startTokenRefresh();
}
