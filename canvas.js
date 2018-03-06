import { ipcRenderer } from "electron";
import { readFileSync } from "fs";
import axios from "axios";

draw();
setInterval(draw, 60000);

async function draw() {
  const file = readFileSync(
    __dirname + "/node_modules/cryptocoins-icons/SVG/ETH-alt.svg"
  );
  const parser = new DOMParser();
  const doc = parser.parseFromString(file, "image/svg+xml");
  [...doc.querySelectorAll("path")].forEach(p =>
    p.setAttribute("fill", "white")
  );
  const serializer = new XMLSerializer();
  const white = serializer.serializeToString(doc);
  const svg = new Blob([white], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svg);
  const logo = await loadImage(url);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const text = await getPrice();

  canvas.width = 1000;
  canvas.height = 128;
  context.drawImage(logo, 0, 32, 64, 64);
  context.font = "58px BlinkMacSystemFont";
  context.fillStyle = "white";
  context.fillText(text, 80, 84);
  ipcRenderer.send("Canvas", {
    dataURL: canvas.toDataURL("image/png", 1),
    width: 80 + context.measureText(text).width
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function getPrice() {
  return axios
    .get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&e=bitfinex"
    )
    .then(({ data: { USD } }) =>
      USD.toLocaleString("en-US", { style: "currency", currency: "USD" }).replace('$', '')
    );
}
