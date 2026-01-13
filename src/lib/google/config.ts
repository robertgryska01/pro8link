// File: src/lib/google/config.ts
// Google OAuth + Sheets API Configuration

export const GOOGLE_CONFIG = {
 // ============================================
  // TUTAJ DODAJ KLUCZE
  // ============================================
  CLIENT_ID: "822212014818-301v982avhjn3liqeaqb3did8r5u1da4.apps.googleusercontent.com", // Wklej: "123456789-...apps.googleusercontent.com"
  API_KEY: "AIzaSyALNOloKXlZ_WQb1bk7x05ysyiwpYlcKlE", // Wklej: "AIzaSyB..."
  SPREADSHEET_ID: "1KLTdKlpnLCVgVAjo9kineOnVCpNPZ_c_HvOcOW7saqg", // Wklej: "1AbC123..."
  // ============================================

  // Scopes - uprawnienia API
  SCOPES: "https://www.googleapis.com/auth/spreadsheets",
  
  // Discovery docs dla Google Sheets API
  DISCOVERY_DOCS: [
    "https://sheets.googleapis.com/$discovery/rest?version=v4"
  ]
};

// Validate configuration
export function validateConfig() {
  const missing = [];
  
  if (!GOOGLE_CONFIG.CLIENT_ID) missing.push("CLIENT_ID");
  if (!GOOGLE_CONFIG.API_KEY) missing.push("API_KEY");
  if (!GOOGLE_CONFIG.SPREADSHEET_ID) missing.push("SPREADSHEET_ID");
  
  if (missing.length > 0) {
    console.error("❌ Missing Google configuration:", missing.join(", "));
    console.error("Please add your keys in src/lib/google/config.ts");
    return false;
  }
  
  return true;
}
