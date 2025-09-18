const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require("electron");
const path = require("path");
const PRELOAD = (typeof MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY !== "undefined") ? MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY : path.join(__dirname,"preload.js");
const INDEX = (typeof MAIN_WINDOW_WEBPACK_ENTRY !== "undefined") ? MAIN_WINDOW_WEBPACK_ENTRY : "file://" + path.join(__dirname,"index.html");
const __nf = require('node-fetch'); const fetch = (__nf && __nf.default) ? __nf.default : __nf;

// ---- IPC: broker proxy (loads immediately)
ipcMain.handle('council:query', async (_evt, payload, base) => {
  const url = (base || 'http://localhost:8081').replace(/\/+$/,'') + '/query';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {})
    });
    return await res.json();
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
});

const ICON_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
const icon = nativeImage.createFromBuffer(Buffer.from(ICON_BASE64,'base64'));
let tray, win;

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 520,
    show: true,
    frame: false,
    resizable: true,
    skipTaskbar: true,
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false
    }
  });
  win.loadURL(INDEX);
  win.show();
win.on('blur', () => { if (!win.webContents.isDevToolsOpened()) win.hide(); });
}

function toggleWindow() {
  if (!win) return;
  if (win.isVisible()) return win.hide();
  const t = tray.getBounds(), b = win.getBounds();
  const x = Math.round(t.x + t.width/2 - b.width/2);
  const y = Math.round(t.y + t.height + 4);
  win.setPosition(Math.max(0,x), Math.max(0,y));
  win.show(); win.focus();
}

app.whenReady().then(() => {
  createWindow();
  tray = new Tray(icon);
  tray.setToolTip('Council'); tray.setTitle('Council');
  tray.on('click', toggleWindow);
  tray.on('right-click', () => {
    const menu = Menu.buildFromTemplate([
      { label:'Open', click: toggleWindow },
      { type:'separator' }, { role:'quit' }
    ]);
    tray.popUpContextMenu(menu);
  });
});

app.on('window-all-closed', (e) => { if (process.platform === 'darwin') e.preventDefault(); });
