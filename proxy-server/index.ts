import express from "express";
import httpProxy from "http-proxy";

const app = express();
const PORT = 8000;

const BASE_PATH =
  "https://s3.eu-north-1.amazonaws.com/rapidserve.surajv.dev/__outputs";

const proxy = httpProxy.createProxyServer({});

proxy.on("proxyRes", (proxyRes, req, res) => {
  proxyRes.headers["Access-Control-Allow-Origin"] = "*";
  proxyRes.headers["Access-Control-Allow-Methods"] =
    "GET, HEAD, OPTIONS, POST, PUT, DELETE";
  proxyRes.headers["Access-Control-Allow-Headers"] = "Content-Type";
});

app.use((req, res, next) => {
  console.log(
    `[Proxy] Received request: ${req.method} ${req.hostname}${req.url}`,
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, HEAD, OPTIONS, POST, PUT, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
});

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

  if ("writeHead" in res && !res.headersSent) {
    res.writeHead(500, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    });
    res.end("Something went wrong with the proxy.");
  } else {
    console.error("Response object is not writable or headers already sent!");
  }
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
