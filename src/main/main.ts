/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut, clipboard, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}



let starWindow: BrowserWindow | null = null;

function showStarAtCursor() {
  // Get mouse cursor absolute position
  const { x, y } = screen.getCursorScreenPoint();
  
  // Find the display where the mouse cursor is
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });

  if (!starWindow) {
    starWindow = new BrowserWindow({
      width: 20,
      height: 20,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      focusable: false,
      show: false, // Initially hidden
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    starWindow.loadURL(`data:text/html,<html><body style="margin:0;display:flex;justify-content:center;align-items:center;font-size:20px;">⭐</body></html>`);

    starWindow.on('closed', () => {
      starWindow = null;
    });
  }

  // Set window position to the cursor position
  starWindow.setPosition(x - 10, y - 10);

  // Ensure the window is visible on the correct display
  starWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  starWindow.setAlwaysOnTop(true, 'screen-saver');

  // Show the window
  starWindow.show();
}

function registerGlobalShortcut() {
 

  globalShortcut.register('CommandOrControl+Shift+X', () => {
 
    showStarAtCursor();

  });
}



if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = true
  // process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};



/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    // createWindow();
    registerGlobalShortcut();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      // if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
