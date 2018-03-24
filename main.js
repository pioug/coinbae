import path from "path";
import url from "url";
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  shell,
  Tray
} from "electron";

let tray = null;
let canvas = null;
let preferences = null;

app.on("ready", () => {
  createCanvas();
  createTray();
});

ipcMain.on("Canvas", (event, params) => {
  const im = nativeImage.createFromDataURL(params.dataURL);
  const i = im.crop({
    x: 0,
    y: 0,
    height: im.getSize().height,
    width: Math.ceil(params.width)
  });
  tray.setImage(i.resize({ height: 32 }));
});

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
  tray.setContextMenu(createTrayMenu());
}

function createTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: "Preferences...",
      click: createPreferencesWindow
    },
    {
      type: "separator"
    },
    {
      label: "Check for update...",
      click: function() {}
    },
    {
      enabled: false,
      label: `Current version: ${app.getVersion()}`
    },
    {
      type: "separator"
    },
    {
      label: "Help",
      click: function() {
        shell.openExternal("https://www.github.com/pioug/coinbae");
      }
    },
    {
      type: "separator"
    },
    {
      label: "Quit Coinbae",
      role: "quit"
    }
  ]);
}

function createPreferencesWindow() {
  if (preferences) {
    preferences.show();
    return;
  }

  preferences = new BrowserWindow();
  preferences.loadURL(
    url.format({
      pathname: path.join(__dirname, "preferences.html"),
      protocol: "file:",
      slashes: true
    })
  );
  if (process.env.DEBUG) {
    preferences.webContents.openDevTools();
  }

  preferences.on("close", () => {
    preferences = null;
  });
}

function createCanvas() {
  canvas = new BrowserWindow({ width: 800, height: 600 });
  canvas.loadURL(
    url.format({
      pathname: path.join(__dirname, "canvas.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (process.env.DEBUG) {
    canvas.webContents.openDevTools();
  }

  canvas.on("closed", () => {
    canvas = null;
  });
}
