// File: src/lib/google/config.example.ts
// Google API Configuration Template
// 
// INSTRUKCJA:
// 1. Skopiuj ten plik jako config.ts
// 2. Wypełnij poniższe wartości swoimi credentials
// 3. NIE commituj pliku config.ts do repozytorium!

export const GOOGLE_CONFIG = {
  // Spreadsheet ID from URL: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',
  
  // Apps Script ID for calling syncAll() function
  // Find in: Extensions → Apps Script → Project Settings → Script ID
  SCRIPT_ID: 'YOUR_SCRIPT_ID_HERE',
  
  // Google Cloud Project API Key
  // Get from: https://console.cloud.google.com/apis/credentials
  API_KEY: 'YOUR_API_KEY_HERE',
  
  // OAuth 2.0 Client ID
  // Get from: https://console.cloud.google.com/apis/credentials
  CLIENT_ID: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
  
  // API Discovery Docs (no need to change)
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  
  // OAuth Scopes (no need to change)
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/script.projects',
};

/**
 * Validate that all required config values are present
 */
export function validateConfig(): boolean {
  const required = ['SPREADSHEET_ID', 'SCRIPT_ID', 'API_KEY', 'CLIENT_ID'];
  
  for (const key of required) {
    const value = GOOGLE_CONFIG[key as keyof typeof GOOGLE_CONFIG];
    if (!value || value === `YOUR_${key}_HERE`) {
      console.error(`Missing or not configured: ${key}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Get a user-friendly error message for missing config
 */
export function getConfigErrorMessage(): string {
  const missing: string[] = [];
  
  if (!GOOGLE_CONFIG.SPREADSHEET_ID || GOOGLE_CONFIG.SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
    missing.push('SPREADSHEET_ID');
  }
  if (!GOOGLE_CONFIG.SCRIPT_ID || GOOGLE_CONFIG.SCRIPT_ID === 'YOUR_SCRIPT_ID_HERE') {
    missing.push('SCRIPT_ID');
  }
  if (!GOOGLE_CONFIG.API_KEY || GOOGLE_CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
    missing.push('API_KEY');
  }
  if (!GOOGLE_CONFIG.CLIENT_ID || GOOGLE_CONFIG.CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    missing.push('CLIENT_ID');
  }
  
  if (missing.length === 0) return '';
  
  return `Not configured in config.ts: ${missing.join(', ')}. Please update src/lib/google/config.ts with your values.`;
}
