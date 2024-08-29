const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let win;
const ENCRYPTION_KEY = 'your-secret-key-for-testing-only'; // In production, use a secure method to store and retrieve this key

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

ipcMain.on('save-database', (event, data) => {
  dialog.showSaveDialog(win, {
    title: 'Save Password Database',
    defaultPath: path.join(app.getPath('documents'), 'openpass.kdbx'),
    filters: [{ name: 'OpenPass Database', extensions: ['kdbx'] }]
  }).then(result => {
    if (!result.canceled) {
      const encryptedData = encrypt(JSON.stringify(data));
      fs.writeFileSync(result.filePath, encryptedData);
      event.reply('database-saved', 'Database saved successfully');
    }
  }).catch(err => {
    console.error('Error in save dialog:', err);
    event.reply('database-saved', 'Error saving database');
  });
});

ipcMain.on('load-database', (event) => {
  dialog.showOpenDialog(win, {
    title: 'Load Password Database',
    defaultPath: app.getPath('documents'),
    filters: [{ name: 'OpenPass Database', extensions: ['kdbx'] }]
  }).then(result => {
    if (!result.canceled) {
      const encryptedData = fs.readFileSync(result.filePaths[0], 'utf-8');
      const decryptedData = decrypt(encryptedData);
      event.reply('database-loaded', JSON.parse(decryptedData));
    }
  }).catch(err => {
    console.error('Error in open dialog:', err);
    event.reply('database-loaded', []);
  });
});

console.log('User data path:', app.getPath('userData'));