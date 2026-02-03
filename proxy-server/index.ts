import express from "express";
import httpProxy from "http-proxy";

const app = express();
const PORT = 8000;

const BASE_PATH =
  "https://s3.eu-north-1.amazonaws.com/rapidserve.surajv.dev/__outputs";

const proxy = httpProxy.createProxyServer({});

app.use((req, res) => {
  const hostname = req.hostname;
  const subdomain = hostname.split(".")[0];

  if (req.url === "/") {
    req.url = "/index.html";
  }

  const resolvesTo = `${BASE_PATH}/${subdomain}`;
  proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

proxy.on("error", (err, req, res) => {
  console.error("Proxy Error:", err);

  if ("writeHead" in res) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Something went wrong with the proxy.");
  } else {
    console.error("Response object is not writable!");
  }
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
