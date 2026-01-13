// File: src/lib/google/sheets.ts
// Google Sheets API Functions

import { GOOGLE_CONFIG } from './config';

// Wait for authentication to complete
async function waitForAuth() {
  if (typeof window === 'undefined') return;
  await (window as any).driveTokenReady;
}

// ========================
// READ DATA FROM SHEET
// ========================

/**
 * Get data from a specific range in the spreadsheet
 * @param range - e.g., "Sheet1!A1:D10" or "Sheet1!A:D"
 * @returns Array of rows
 */
export async function getSheetData(range: string): Promise<any[][]> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: range,
    });

    const values = response.result.values || [];
    console.log(`✅ Retrieved ${values.length} rows from ${range}`);
    return values;
  } catch (error) {
    console.error('❌ Error reading sheet:', error);
    throw error;
  }
}

/**
 * Get all data from a specific sheet
 * @param sheetName - Name of the sheet tab
 * @returns Array of rows
 */
export async function getAllSheetData(sheetName: string = 'Sheet1'): Promise<any[][]> {
  return getSheetData(`${sheetName}!A:Z`);
}

/**
 * Get data as objects with headers as keys
 * @param range - e.g., "Sheet1!A1:D10"
 * @returns Array of objects
 */
export async function getSheetDataAsObjects(range: string): Promise<Record<string, any>[]> {
  const data = await getSheetData(range);
  
  if (data.length === 0) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  
  return rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

// ========================
// WRITE DATA TO SHEET
// ========================

/**
 * Update data in a specific range
 * @param range - e.g., "Sheet1!A1:D10"
 * @param values - 2D array of values
 * @returns Update response
 */
export async function updateSheetData(range: string, values: any[][]): Promise<any> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: range,
      valueInputOption: 'RAW',
      resource: { values },
    });

    console.log(`✅ Updated ${response.result.updatedCells} cells in ${range}`);
    return response.result;
  } catch (error) {
    console.error('❌ Error updating sheet:', error);
    throw error;
  }
}

/**
 * Append data to the end of a sheet
 * @param range - e.g., "Sheet1!A:D"
 * @param values - 2D array of values to append
 * @returns Append response
 */
export async function appendSheetData(range: string, values: any[][]): Promise<any> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    });

    console.log(`✅ Appended ${values.length} rows to ${range}`);
    return response.result;
  } catch (error) {
    console.error('❌ Error appending to sheet:', error);
    throw error;
  }
}

/**
 * Clear data in a specific range
 * @param range - e.g., "Sheet1!A1:D10"
 * @returns Clear response
 */
export async function clearSheetData(range: string): Promise<any> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.clear({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: range,
    });

    console.log(`✅ Cleared data in ${range}`);
    return response.result;
  } catch (error) {
    console.error('❌ Error clearing sheet:', error);
    throw error;
  }
}

// ========================
// BATCH OPERATIONS
// ========================

/**
 * Get multiple ranges at once
 * @param ranges - Array of ranges, e.g., ["Sheet1!A1:B10", "Sheet2!C1:D20"]
 * @returns Object with range names as keys
 */
export async function batchGetSheetData(ranges: string[]): Promise<Record<string, any[][]>> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      ranges: ranges,
    });

    const result: Record<string, any[][]> = {};
    response.result.valueRanges.forEach((valueRange: any) => {
      result[valueRange.range] = valueRange.values || [];
    });

    console.log(`✅ Retrieved ${ranges.length} ranges`);
    return result;
  } catch (error) {
    console.error('❌ Error batch reading sheets:', error);
    throw error;
  }
}

/**
 * Update multiple ranges at once
 * @param data - Array of {range, values} objects
 * @returns Batch update response
 */
export async function batchUpdateSheetData(
  data: Array<{ range: string; values: any[][] }>
): Promise<any> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: data,
      },
    });

    console.log(`✅ Updated ${data.length} ranges`);
    return response.result;
  } catch (error) {
    console.error('❌ Error batch updating sheets:', error);
    throw error;
  }
}

// ========================
// SHEET METADATA
// ========================

/**
 * Get spreadsheet metadata
 * @returns Spreadsheet info including sheet names
 */
export async function getSpreadsheetInfo(): Promise<any> {
  await waitForAuth();

  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
    });

    console.log('✅ Retrieved spreadsheet info');
    return response.result;
  } catch (error) {
    console.error('❌ Error getting spreadsheet info:', error);
    throw error;
  }
}

/**
 * Get list of all sheets in the spreadsheet
 * @returns Array of sheet names
 */
export async function getSheetNames(): Promise<string[]> {
  const info = await getSpreadsheetInfo();
  return info.sheets.map((sheet: any) => sheet.properties.title);
}

// ========================
// UTILITY FUNCTIONS
// ========================

/**
 * Convert column letter to number (A=1, B=2, etc.)
 */
export function columnToNumber(column: string): number {
  let num = 0;
  for (let i = 0; i < column.length; i++) {
    num = num * 26 + column.charCodeAt(i) - 64;
  }
  return num;
}

/**
 * Convert column number to letter (1=A, 2=B, etc.)
 */
export function numberToColumn(num: number): string {
  let column = '';
  while (num > 0) {
    const remainder = (num - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    num = Math.floor((num - 1) / 26);
  }
  return column;
}

/**
 * Create a range string from coordinates
 * @example createRange("Sheet1", 1, 1, 10, 5) => "Sheet1!A1:E10"
 */
export function createRange(
  sheetName: string,
  startRow: number,
  startCol: number,
  endRow?: number,
  endCol?: number
): string {
  const startColLetter = numberToColumn(startCol);
  const range = `${sheetName}!${startColLetter}${startRow}`;
  
  if (endRow && endCol) {
    const endColLetter = numberToColumn(endCol);
    return `${range}:${endColLetter}${endRow}`;
  }
  
  return range;
}
