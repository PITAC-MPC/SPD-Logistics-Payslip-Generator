const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const appId = 'com.pitac.driving.payslip';

let mainWindow = null;

app.setAppUserModelId(appId);

const hasSingleInstanceLock = app.requestSingleInstanceLock();

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return;

    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 950,
    minWidth: 980,
    minHeight: 720,
    show: false,
    backgroundColor: '#f3f5f9',
    autoHideMenuBar: true,
    title: 'PITAC Driving Payslip',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    if (devServerUrl && navigationUrl.startsWith(devServerUrl)) return;
    if (!devServerUrl && navigationUrl.startsWith('file://')) return;

    event.preventDefault();
  });

  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

function sanitizePdfFileName(value) {
  const baseName = path
    .basename(String(value || 'Payslip.pdf'))
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const safeName = baseName || 'Payslip.pdf';
  return safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`;
}

ipcMain.handle('payslip:save-pdf', async (event, suggestedName) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return { success: false, error: 'The payslip window is unavailable.' };
  }

  const { canceled, filePath } = await dialog.showSaveDialog(window, {
    title: 'Save payslip as PDF',
    defaultPath: path.join(
      app.getPath('documents'),
      sanitizePdfFileName(suggestedName),
    ),
    filters: [{ name: 'PDF document', extensions: ['pdf'] }],
  });

  if (canceled || !filePath) {
    return { canceled: true };
  }

  const pdfFilePath = filePath.toLowerCase().endsWith('.pdf')
    ? filePath
    : `${filePath}.pdf`;

  try {
    const pdf = await window.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      landscape: false,
      preferCSSPageSize: true,
    });

    await fs.writeFile(pdfFilePath, pdf);

    return { success: true, filePath: pdfFilePath };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Unable to create the PDF.',
    };
  }
});

ipcMain.handle('payslip:print', async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return {
      success: false,
      failureReason: 'The payslip window is unavailable.',
    };
  }

  return new Promise((resolve) => {
    window.webContents.print(
      {
        printBackground: true,
        pageSize: 'A4',
        landscape: false,
      },
      (success, failureReason) => {
        resolve({ success, failureReason });
      },
    );
  });
});
