import type { NextConfig } from "next";
const path = require("path");
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  /* config options here */
};

export default nextConfig;
