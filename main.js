const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const CryptoJS = require('crypto-js')

const ENCRYPTION_KEY = 'your-secret-key' // In a real app, this should be securely stored and not hard-coded

let win
let masterPasswordHash

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Be cautious with this in production
      allowRunningInsecureContent: true // Be cautious with this in production
    }
  })

  win.loadURL('http://localhost:3000')
  win.webContents.openDevTools()

  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (message.includes('Autofill.enable failed') || message.includes('Autofill.setAddresses failed')) {
      event.preventDefault();
    }
  });
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString()
}

function encrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

ipcMain.on('save-item', (event, item) => {
  console.log('Saving item:', item);
  const filePath = path.join(app.getPath('userData'), 'items.enc')
  let items = []
  if (fs.existsSync(filePath)) {
    try {
      const encryptedData = fs.readFileSync(filePath, 'utf-8')
      items = decrypt(encryptedData)
    } catch (error) {
      console.error('Error reading or decrypting existing items:', error)
    }
  }
  items.push(item)
  try {
    const encryptedItems = encrypt(items)
    fs.writeFileSync(filePath, encryptedItems)
    console.log('Item saved successfully');
    event.reply('item-saved', 'Item saved successfully')
  } catch (error) {
    console.error('Error encrypting or saving items:', error)
    event.reply('item-saved', 'Error saving item')
  }
})

ipcMain.on('load-items', (event) => {
  console.log('Loading items');
  const filePath = path.join(app.getPath('userData'), 'items.enc')
  let items = []
  if (fs.existsSync(filePath)) {
    try {
      const encryptedData = fs.readFileSync(filePath, 'utf-8')
      items = decrypt(encryptedData)
      console.log('Items loaded successfully:', items.length);
    } catch (error) {
      console.error('Error reading or decrypting items:', error)
    }
  } else {
    console.log('No items file found');
  }
  event.reply('items-loaded', items)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});