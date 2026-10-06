import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import site from "./src/config/site.js";

export default defineConfig({
  plugins: [react()],

  base: site.basePath,
});
