import path from "path";
import url from "url";
import { app, BrowserWindow, ipcMain, nativeImage, Tray } from "electron";

let tray = null;
let canvas = null;

app.on("ready", () => {
  createCanvas();
  createTray();
});

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
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
