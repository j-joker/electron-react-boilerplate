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
import { app, BrowserWindow, shell, ipcMain, globalShortcut, clipboard, screen, } from 'electron';
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

  if (!starWindow) {
    starWindow = new BrowserWindow({
      width: 100,
      height: 100,
      frame: false,
      focusable: false,
      transparent: true,
      type: 'panel',
      movable: true, // Prevent user from moving the window
      backgroundColor: '#00000000', // Fully transparent background
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    // Add this line to hide the window from the dock on macOS
    if (process.platform === 'darwin') {
      app.dock.hide();
    }
  
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    starWindow.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y);
    starWindow.loadURL(resolveHtmlPath('index.html'));
    starWindow.on('closed', () => {
      starWindow = null;
    });
  }

  // Find the display where the mouse cursor is
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });
  
  // Set window position relative to the current display
  const relativeX = x - currentDisplay.bounds.x;
  const relativeY = y - currentDisplay.bounds.y;
  starWindow.setPosition(currentDisplay.bounds.x + relativeX - 20, currentDisplay.bounds.y + relativeY - 20);

  // Remove this line
  // starWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  starWindow.setAlwaysOnTop(true, 'screen-saver');

  // Show the window
  starWindow.show();
}

function watchClipboard() {
  let lastText = clipboard.readText();

  setInterval(() => {
    const currentText = clipboard.readText();
    if (currentText !== lastText) {
      lastText = currentText;
      if (currentText.trim() !== '') {
        showStarAtCursor();
      }
    }
  }, 200); // Check every 200ms
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = false
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
    watchClipboard();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      // if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
