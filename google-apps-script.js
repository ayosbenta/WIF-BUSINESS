// WiFi Business Dashboard API - Google Apps Script Backend

const SHEET_ID = '1bNgPXCuAXjbEAX_6G1w-OFju0RaxiTiyP4v8k9w9c0c';
const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
const usersSheet = spreadsheet.getSheetByName('Users');
const productsSheet = spreadsheet.getSheetByName('Products');
const paymentsSheet = spreadsheet.getSheetByName('Payments');

// --- Main API Entry Points ---

// Handles GET requests - currently not used by the frontend but good for testing.
function doGet(e) {
  return handleResponse({ status: 'success', data: getAllData() });
}

// Handles POST requests, which is the main method for all CRUD operations.
function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    const { action, payload } = request;

    switch (action) {
      case 'GET_ALL_DATA':
        return handleResponse({ status: 'success', data: getAllData() });

      // User Actions
      case 'ADD_USER':
        return handleResponse({ status: 'success', data: addUser(payload) });
      case 'UPDATE_USER':
        return handleResponse({ status: 'success', data: updateUser(payload) });
      case 'DELETE_USER':
        return handleResponse({ status: 'success', data: deleteRowById(usersSheet, payload.id) });

      // Product Actions
      case 'ADD_PRODUCT':
        return handleResponse({ status: 'success', data: addProduct(payload) });
      case 'UPDATE_PRODUCT':
        return handleResponse({ status: 'success', data: updateProduct(payload) });
      case 'DELETE_PRODUCT':
        return handleResponse({ status: 'success', data: deleteRowById(productsSheet, payload.id) });

      // Payment Actions
      case 'ADD_PAYMENT':
        return handleResponse({ status: 'success', data: addPayment(payload) });

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    Logger.log(error);
    return handleResponse({ status: 'error', message: error.message }, 500);
  }
}

// --- Data Retrieval ---

function getAllData() {
  return {
    users: getSheetData(usersSheet),
    products: getSheetData(productsSheet),
    payments: getSheetData(paymentsSheet).sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort payments newest first
  };
}

// --- CRUD Functions ---

function addUser(payload) {
  const newUser = {
    id: Utilities.getUuid(),
    joinDate: new Date().toISOString().split('T')[0],
    name: payload.name,
    address: payload.address,
    email: payload.email,
    planId: payload.planId,
    status: payload.status,
  };
  appendRow(usersSheet, newUser);
  return newUser;
}

function updateUser(payload) {
  updateRow(usersSheet, payload);
  return payload;
}

function addProduct(payload) {
  const newProduct = {
    id: Utilities.getUuid(),
    name: payload.name,
    speed: payload.speed,
    price: payload.price,
    description: payload.description,
  };
  appendRow(productsSheet, newProduct);
  return newProduct;
}

function updateProduct(payload) {
  updateRow(productsSheet, payload);
  return payload;
}

function addPayment(payload) {
  const newPayment = {
    id: Utilities.getUuid(),
    date: new Date().toISOString().split('T')[0],
    userId: payload.userId,
    amount: payload.amount,
    method: payload.method,
  };
  appendRow(paymentsSheet, newPayment);
  return newPayment;
}

// --- Utility Functions ---

// Converts sheet data to an array of JSON objects.
function getSheetData(sheet) {
  if (sheet.getLastRow() < 2) return [];
  const range = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  const values = range.getValues();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  return values.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      // Handle date objects correctly
      if (values[i] instanceof Date) {
        obj[header] = row[i].toISOString().split('T')[0];
      } else {
        obj[header] = row[i];
      }
    });
    return obj;
  });
}

// Appends a new row to a sheet based on a JSON object.
function appendRow(sheet, rowObject) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => rowObject[header] || "");
  sheet.appendRow(row);
}

// Updates an existing row identified by its ID.
function updateRow(sheet, rowObject) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idCol = headers.indexOf('id') + 1;
  const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues().flat();
  const rowIndex = ids.findIndex(id => id == rowObject.id);
  
  if (rowIndex === -1) {
    throw new Error(`Row with ID ${rowObject.id} not found.`);
  }

  const rowData = headers.map(header => rowObject[header] || "");
  sheet.getRange(rowIndex + 2, 1, 1, headers.length).setValues([rowData]);
}

// Deletes a row from a sheet by its ID.
function deleteRowById(sheet, id) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const idCol = headers.indexOf('id') + 1;
  const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues().flat();
  const rowIndex = ids.findIndex(rowId => rowId == id);

  if (rowIndex === -1) {
    throw new Error(`Row with ID ${id} not found for deletion.`);
  }

  sheet.deleteRow(rowIndex + 2); // +2 because sheets are 1-indexed and we skip the header
  return { id };
}

// Formats the response to be sent back to the client.
function handleResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}