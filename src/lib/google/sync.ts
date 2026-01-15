// File: src/lib/google/sync.ts
// Google Sheets Synchronization for ProLink Inventory

import { GOOGLE_CONFIG } from './config';

// ========================
// CACHE & STATE
// ========================
let namedRangeCache: any = null;
let sheetMetadata: any = null;

export const inventoryState = {
  products: [] as any[],
  storageLocations: [] as string[],
  purchaseLocations: [] as string[],
  isSyncing: false,
};

// ========================
// HELPER FUNCTIONS
// ========================

// Parse price from string (handles Â£, $, commas)
function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const cleaned = String(priceStr).replace(/[Â£$,]/g, '').trim();
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}

/**
 * Extract container from SKU (first segment before "-")
 * Example: "B01-0001-5" -> "B01"
 */
export function extractContainer(sku: string): string | null {
  if (!sku) return null;
  const parts = String(sku).split('-');
  return parts[0] || null;
}

/**
 * Extract sequence number from SKU (4-digit number)
 * Example: "B01-0001-5" -> "0001"
 */
export function extractSequenceNumber(sku: string): string | null {
  if (!sku) return null;
  const match = String(sku).match(/\d{4}/);
  return match ? match[0] : null;
}

// Convert column index to letter (0=A, 1=B, etc.)
function columnIndexToLetter(index: number): string {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode(65 + (index % 26)) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}

// Wait for GAPI to be ready
async function waitForGapi() {
  if (typeof window === 'undefined') return;
  await (window as any).driveTokenReady;
}

// ========================
// METADATA FUNCTIONS
// ========================

async function getSheetMetadata() {
  if (sheetMetadata) return sheetMetadata;
  
  await waitForGapi();
  
  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      fields: 'sheets(properties)'
    });
    
    sheetMetadata = response.result.sheets.find(
      (s: any) => s.properties.title === 'Main Inventory'
    );
    
    return sheetMetadata;
  } catch (error) {
    console.error('âŒ Error getting sheet metadata:', error);
    throw error;
  }
}

async function getNamedRangeMetadata() {
  if (namedRangeCache) return namedRangeCache;
  
  await waitForGapi();
  
  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      fields: 'namedRanges,sheets(properties)'
    });
    
    namedRangeCache = response.result;
    return namedRangeCache;
  } catch (error) {
    console.error('âŒ Error getting named ranges:', error);
    throw error;
  }
}

// ========================
// READ FUNCTIONS
// ========================

async function getNamedRange(rangeName: string): Promise<string[]> {
  await waitForGapi();
  
  try {
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: rangeName,
    });
    
    return (response.result.values || []).map((row: any[]) => row[0]);
  } catch (error) {
    console.warn(`âš ï¸ Named range ${rangeName} not found:`, error);
    return [];
  }
}

// ========================
// MAIN SYNC FUNCTION
// ========================

export async function loadProductsFromSheet(): Promise<void> {
  await waitForGapi();
  
  try {
    console.log('ðŸ“Š Loading products from Google Sheets...');
    
    // Define all named ranges for inventory
    const ranges = [
      'MainInventoryStatus',
      'MainInventoryItemID',
      'MainInventorySKU',
      'MainInventoryProductTitle',
      'MainInventoryPurchaseDate',
      'MainInventoryPurchaseLocation',
      'MainInventoryPurchasePrice',
      'MainInventoryImages',
      'MainInventoryListingStatus',
      'MainInventoryListingStartDate',
      'MainInventoryListingEndDate',
      'MainInventoryListingType',
      'MainInventoryCategory',
      'MainInventoryMarketplace',
      'MainInventoryDaysInStock',
      'MainInventoryDaysListed',
      'MainInventoryListedPrice',
      'MainInventoryCondition',
      'MainInventoryBrand',
      'MainInventoryPostedDate',
      'MainInventoryDeliveredDate',
      'MainInventorySaleDate',
      'MainInventorySoldPrice',
      'MainInventoryShippingStatus',
      'MainInventoryShippingProvider',
      'MainInventoryTrackingNumber',
      'MainInventoryBuyerID',
      'MainInventoryPromotedListing',
      'MainInventoryHandlingTime',
      'MainInventoryPrivateSale',
      'MainInventoryeBayOrderNo'
    ];
    
    // BATCH GET - 1 API call instead of 30!
    const response = await (window as any).gapi.client.sheets.spreadsheets.values.batchGet({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      ranges: ranges
    });
    
    // Extract values from batch response
    const valueRanges = response.result.valueRanges;
    const [
      status, itemId, sku, title, purchaseDate, purchaseLocation, purchasePrice,
      images, listingStatus, listingStartDate, listingEndDate, listingType, 
      category, marketplace, daysInStock, daysListed, listedPrice, condition, 
      brand, postedDate, deliveredDate, saleDate, soldPrice, shippingStatus, 
      shippingProvider, trackingNumber, buyerId, promotedListing, handlingTime, 
      privateSale, ebayOrderNo
    ] = valueRanges.map((vr: any) => (vr.values || []).map((row: any[]) => row[0]));
    
    // Find max rows
    const numRows = Math.max(
      status?.length || 0,
      sku?.length || 0,
      title?.length || 0
    );
    
    // Build products array
    inventoryState.products = [];
    for (let i = 0; i < numRows; i++) {
      if (!sku[i]) continue; // Skip empty rows
      
      inventoryState.products.push({
        rowIndex: i + 2, // Row number in sheet (1-indexed, +1 for header)
        status: status[i] || '',
        itemId: itemId[i] || '',
        sku: sku[i] || '',
        title: title[i] || '',
        purchaseDate: purchaseDate[i] || '',
        purchaseLocation: purchaseLocation[i] || '',
        purchasePrice: parsePrice(purchasePrice[i]),
        images: images[i] || '',
        listingStatus: listingStatus[i] || '',
        listingStartDate: listingStartDate[i] || '',
        listingEndDate: listingEndDate[i] || '',
        listingType: listingType[i] || '',
        category: category[i] || '',
        marketplace: marketplace[i] || '',
        daysInStock: daysInStock[i] || '',
        daysListed: daysListed[i] || '',
        listedPrice: parsePrice(listedPrice[i]),
        condition: condition[i] || '',
        brand: brand[i] || '',
        postedDate: postedDate[i] || '',
        deliveredDate: deliveredDate[i] || '',
        saleDate: saleDate[i] || '',
        soldPrice: parsePrice(soldPrice[i]),
        shippingStatus: shippingStatus[i] || '',
        shippingProvider: shippingProvider[i] || '',
        trackingNumber: trackingNumber[i] || '',
        buyerId: buyerId[i] || '',
        promotedListing: promotedListing[i] || '',
        handlingTime: handlingTime[i] || '',
        privateSale: privateSale[i] || '',
        ebayOrderNo: ebayOrderNo[i] || ''
      });
    }
    
    console.log(`âœ… Loaded ${inventoryState.products.length} products from sheet`);
  } catch (error) {
    console.error('âŒ Error loading products:', error);
    throw error;
  }
}

// ========================
// LOAD SETUP DATA
// ========================

export async function loadSetupData(): Promise<void> {
  await waitForGapi();
  
  try {
    console.log('âš™ï¸ Loading setup data...');
    
    // Storage Locations (Setup!A2:A100)
    const storageResponse = await (window as any).gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: 'Setup!A2:A100',
    });
    inventoryState.storageLocations = (storageResponse.result.values || [])
      .map((row: any[]) => row[0])
      .filter(Boolean);
    
    // Purchase Locations (Setup!C2:C15)
    const purchaseResponse = await (window as any).gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: 'Setup!C2:C15',
    });
    inventoryState.purchaseLocations = (purchaseResponse.result.values || [])
      .map((row: any[]) => row[0])
      .filter(Boolean);
    
    console.log('âœ… Storage Locations:', inventoryState.storageLocations.length);
    console.log('âœ… Purchase Locations:', inventoryState.purchaseLocations.length);
  } catch (error) {
    console.error('âŒ Error loading setup data:', error);
    throw error;
  }
}

// ========================
// WRITE FUNCTIONS
// ========================

async function updateNamedRangeCell(
  rangeName: string, 
  absoluteRow: number, 
  value: any
): Promise<void> {
  await waitForGapi();
  
  try {
    const metadata = await getNamedRangeMetadata();
    
    const namedRange = metadata.namedRanges.find((nr: any) => nr.name === rangeName);
    if (!namedRange) {
      throw new Error(`Named range ${rangeName} not found`);
    }
    
    const sheetId = namedRange.range.sheetId;
    const sheet = metadata.sheets.find((s: any) => s.properties.sheetId === sheetId);
    const sheetName = sheet.properties.title;
    const columnIndex = namedRange.range.startColumnIndex;
    const columnLetter = columnIndexToLetter(columnIndex);
    
    await (window as any).gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      range: `${sheetName}!${columnLetter}${absoluteRow}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[value]]
      }
    });
    
    console.log(`âœ… Updated ${rangeName} at row ${absoluteRow}`);
  } catch (error) {
    console.error(`âŒ Error updating ${rangeName}:`, error);
    throw error;
  }
}

async function findNextAvailableRow(): Promise<number> {
  try {
    const skus = await getNamedRange('MainInventorySKU');
    
    for (let i = 0; i < skus.length; i++) {
      if (!skus[i]) {
        return i + 2; // +2 because: 1-indexed + 1 for header
      }
    }
    
    return skus.length + 2;
  } catch (error) {
    console.error('âŒ Error finding next row:', error);
    return inventoryState.products.length + 2;
  }
}

// ========================
// CRUD OPERATIONS
// ========================

export async function addProduct(productData: {
  title: string;
  date: string;
  purchaseLocation: string;
  price: number;
  storageLocation: string;
  privateSale: boolean;
  images: boolean;
}): Promise<void> {
  await waitForGapi();
  
  try {
    console.log('âž• Adding product...');
    
    // Generate SKU (you'll need to implement getNextSKUNumber)
    const nextNumber = 1; // TODO: Implement SKU numbering logic
    const sku = `${productData.storageLocation}-${String(nextNumber).padStart(4, '0')}-${Math.round(productData.price)}`;
    
    const nextRow = await findNextAvailableRow();
    
    // Add product to sheet (parallel writes)
    await Promise.all([
      updateNamedRangeCell('MainInventorySKU', nextRow, sku),
      updateNamedRangeCell('MainInventoryProductTitle', nextRow, productData.title),
      updateNamedRangeCell('MainInventoryPurchaseDate', nextRow, productData.date),
      updateNamedRangeCell('MainInventoryPurchaseLocation', nextRow, productData.purchaseLocation),
      updateNamedRangeCell('MainInventoryPurchasePrice', nextRow, productData.price),
      updateNamedRangeCell('MainInventoryPrivateSale', nextRow, productData.privateSale ? 'TRUE' : 'FALSE'),
      updateNamedRangeCell('MainInventoryImages', nextRow, productData.images ? 'TRUE' : 'FALSE')
    ]);
    
    // Wait for Sheets to process
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Refresh data
    await syncData();
    
    console.log('âœ… Product added successfully!');
  } catch (error) {
    console.error('âŒ Error adding product:', error);
    throw error;
  }
}

export async function updateProduct(
  product: any,
  formData: {
    title: string;
    purchaseDate: string;
    purchaseLocation: string;
    purchasePrice: number;
    storageLocation: string;
    privateSale: boolean;
    images: boolean;
  }
): Promise<void> {
  await waitForGapi();
  
  try {
    console.log('âœï¸ Updating product...');
    
    const currentStorageLocation = product.sku.split('-')[0];
    const skuParts = product.sku.split('-');
    const skuNumber = skuParts[1];
    
    // Regenerate SKU if storage or price changed
    const newSKU = 
      formData.storageLocation !== currentStorageLocation || 
      parseFloat(String(formData.purchasePrice)) !== product.purchasePrice
        ? `${formData.storageLocation}-${skuNumber}-${Math.round(formData.purchasePrice)}`
        : product.sku;
    
    await Promise.all([
      updateNamedRangeCell('MainInventorySKU', product.rowIndex, newSKU),
      updateNamedRangeCell('MainInventoryProductTitle', product.rowIndex, formData.title),
      updateNamedRangeCell('MainInventoryPurchaseDate', product.rowIndex, formData.purchaseDate),
      updateNamedRangeCell('MainInventoryPurchaseLocation', product.rowIndex, formData.purchaseLocation),
      updateNamedRangeCell('MainInventoryPurchasePrice', product.rowIndex, formData.purchasePrice),
      updateNamedRangeCell('MainInventoryPrivateSale', product.rowIndex, formData.privateSale ? 'TRUE' : 'FALSE'),
      updateNamedRangeCell('MainInventoryImages', product.rowIndex, formData.images ? 'TRUE' : 'FALSE')
    ]);
    
    // Refresh data
    await syncData();
    
    console.log('âœ… Product updated successfully!');
  } catch (error) {
    console.error('âŒ Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(product: any): Promise<void> {
  await waitForGapi();
  
  try {
    console.log('ðŸ—‘ï¸ Deleting product...');
    
    const metadata = await getSheetMetadata();
    const sheetId = metadata.properties.sheetId;
    
    await (window as any).gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_CONFIG.SPREADSHEET_ID,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: product.rowIndex - 1, // 0-indexed
              endIndex: product.rowIndex
            }
          }
        }]
      }
    });
    
    // Clear cache and refresh
    namedRangeCache = null;
    sheetMetadata = null;
    await syncData();
    
    console.log('âœ… Product deleted successfully!');
  } catch (error) {
    console.error('âŒ Error deleting product:', error);
    throw error;
  }
}

// ========================
// SYNC FUNCTION
// ========================

/**
 * Trigger syncAll() function in Google Apps Script
 * This calls the spreadsheet's syncAll() function which fetches fresh data from eBay API
 * The function runs automatically every hour, but this allows manual triggering
 */
export async function triggerSyncAll(): Promise<void> {
  await waitForGapi();
  
  try {
    console.log('🔄 Triggering syncAll() in Google Apps Script...');
    
    const scriptId = GOOGLE_CONFIG.SCRIPT_ID;
    
    if (!scriptId) {
      console.warn('⚠️ SCRIPT_ID not configured. Skipping Apps Script call and refreshing local data only.');
      namedRangeCache = null;
      sheetMetadata = null;
      await syncData();
      return;
    }
    
    // Call Apps Script using the execution API
    const scriptUrl = `https://script.googleapis.com/v1/scripts/${scriptId}:run`;
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${(window as any).gapi.client.getToken().access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: 'syncAll',
        devMode: false,
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      console.error('❌ Apps Script error:', result.error);
      console.log('⚠️ Apps Script failed, refreshing local data anyway...');
    } else {
      console.log('✅ syncAll() triggered successfully in Apps Script');
    }
    
    // Wait for the script to complete (Apps Script may take time to fetch from eBay)
    console.log('⏳ Waiting for Apps Script to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Clear all caches to force fresh data
    namedRangeCache = null;
    sheetMetadata = null;
    
    // Refresh local data from spreadsheet
    await syncData();
    
    console.log('✅ Full sync completed successfully');
  } catch (error) {
    console.error('❌ Error triggering syncAll():', error);
    
    // Fallback: just refresh local data even if Apps Script call failed
    console.log('⚠️ Falling back to local data refresh...');
    try {
      namedRangeCache = null;
      sheetMetadata = null;
      await syncData();
    } catch (syncError) {
      console.error('❌ Local sync also failed:', syncError);
      throw syncError;
    }
  }
}

export async function syncData(): Promise<void> {
  if (inventoryState.isSyncing) {
    console.log('â³ Sync already in progress...');
    return;
  }
  
  inventoryState.isSyncing = true;
  
  try {
    console.log('ðŸ”„ Syncing data from Google Sheets...');
    
    // Clear cache to force fresh data
    namedRangeCache = null;
    
    // Load all data
    await Promise.all([
      loadProductsFromSheet(),
      loadSetupData()
    ]);
    
    console.log('âœ… Sync completed successfully!');
  } catch (error) {
    console.error('âŒ Sync failed:', error);
    throw error;
  } finally {
    inventoryState.isSyncing = false;
  }
}

// All functions are already exported above with 'export' keyword