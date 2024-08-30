const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const argon2 = require('argon2');

let win;
let masterKey = null;

app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false  // Note: Only use this for development
    }
  });

  win.loadURL('http://localhost:3000');
  
  // Suppress DevTools warnings
  win.webContents.on('devtools-opened', () => {
    win.webContents.executeJavaScript(`
      const originalConsoleWarn = console.warn;
      const originalConsoleError = console.error;
      
      console.warn = function(...args) {
        if (!args[0].includes('Autofill')) {
          originalConsoleWarn.apply(this, args);
        }
      };
      
      console.error = function(...args) {
        if (!args[0].includes('Autofill')) {
          originalConsoleError.apply(this, args);
        }
      };
    `);
  });

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

async function deriveKey(password, salt) {
  try {
    console.log('Deriving key');
    const derivedKey = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      salt: salt
    });
    console.log('Key derived successfully');
    return derivedKey;
  } catch (err) {
    console.error('Error in key derivation:', err);
    throw err;
  }
}

async function encrypt(text, key) {
  console.log('Encrypting data');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  console.log('Data encrypted successfully');
  return iv.toString('hex') + ':' + authTag + ':' + encrypted;
}

async function decrypt(text, key) {
  console.log('Decrypting data');
  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const authTag = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('Data decrypted successfully');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data. The file may be corrupted or the master password may be incorrect.');
  }
}

ipcMain.handle('check-master-password-exists', async (event) => {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return { exists: !!config.masterPasswordHash };
  }
  return { exists: false };
});

ipcMain.handle('set-master-password', async (event, password) => {
  try {
    console.log('Setting master password');
    const salt = crypto.randomBytes(16);
    const derivedKey = await deriveKey(password, salt);
    masterKey = crypto.createHash('sha256').update(derivedKey).digest('hex');
    const masterPasswordHash = await argon2.hash(password);
    
    const config = {
      masterPasswordHash: masterPasswordHash,
      salt: salt.toString('hex')
    };
    const configPath = path.join(app.getPath('userData'), 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config));
    
    console.log('Master password set successfully');
    return { success: true };
  } catch (error) {
    console.error('Error setting master password:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('unlock-database', async (event, { password }) => {
  try {
    console.log('Unlocking database');
    const configPath = path.join(app.getPath('userData'), 'config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    if (await argon2.verify(config.masterPasswordHash, password)) {
      const derivedKey = await deriveKey(password, Buffer.from(config.salt, 'hex'));
      masterKey = crypto.createHash('sha256').update(derivedKey).digest('hex');
      console.log('Database unlocked successfully');
      return { success: true };
    } else {
      console.log('Incorrect password');
      return { success: false, error: 'Incorrect password' };
    }
  } catch (error) {
    console.error('Error unlocking database:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-database', async (event, data) => {
  console.log('Save database called');
  if (!masterKey) {
    console.log('Master key not set');
    return { success: false, error: 'Master key not set' };
  }

  try {
    console.log('Encrypting data');
    const encryptedData = await encrypt(JSON.stringify(data), masterKey);
    console.log('Data encrypted');

    console.log('Showing save dialog');
    const result = await dialog.showSaveDialog(win, {
      title: 'Save Password Database',
      defaultPath: path.join(app.getPath('documents'), 'openpass.opdb'),
      filters: [{ name: 'OpenPass Database', extensions: ['opdb'] }]
    });

    console.log('Save dialog result:', result);

    if (result.canceled) {
      console.log('Save operation canceled');
      return { success: false, error: 'Save operation canceled' };
    }

    console.log('Writing file');
    fs.writeFileSync(result.filePath, encryptedData);
    console.log('File written successfully');

    return { success: true, message: 'Database saved successfully' };
  } catch (error) {
    console.error('Error saving database:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-database', async (event) => {
  console.log('Load database called');
  if (!masterKey) {
    console.log('Master key not set');
    return { success: false, error: 'Master key not set' };
  }

  try {
    console.log('Showing open dialog');
    const result = await dialog.showOpenDialog(win, {
      title: 'Load Password Database',
      defaultPath: app.getPath('documents'),
      filters: [{ name: 'OpenPass Database', extensions: ['opdb'] }]
    });

    console.log('Open dialog result:', result);

    if (result.canceled) {
      console.log('Load operation canceled');
      return { success: false, error: 'Load operation canceled' };
    }

    console.log('Reading file');
    const encryptedData = fs.readFileSync(result.filePaths[0], 'utf-8');
    console.log('File read successfully');

    console.log('Decrypting data');
    const decryptedData = await decrypt(encryptedData, masterKey);
    console.log('Data decrypted');

    return { success: true, data: JSON.parse(decryptedData) };
  } catch (error) {
    console.error('Error loading database:', error);
    return { success: false, error: error.message };
  }
});

console.log('User data path:', app.getPath('userData'));