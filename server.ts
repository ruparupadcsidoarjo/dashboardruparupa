import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy API routes for Google Sheets
  app.get("/api/sheet-a", async (req, res) => {
    try {
      const response = await fetch("https://docs.google.com/spreadsheets/d/1T9uV6PyiKflDaruPYbMid5WOooPlHWZP5nbxpodRGsA/export?format=csv&gid=0");
      if (!response.ok) {
        throw new Error(`Google Sheets responded with status ${response.status}`);
      }
      const data = await response.text();
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.send(data);
    } catch (error: any) {
      console.error("Error proxying Sheet A:", error);
      res.status(500).json({ error: error.message || "Failed to fetch Sheet A" });
    }
  });

  app.get("/api/sheet-b", async (req, res) => {
    try {
      const response = await fetch("https://docs.google.com/spreadsheets/d/1AXqJ7plwv7p3KVD8VQ7d_EY-EX87RPJGlIDGxam_6Fo/export?format=csv&gid=263708152");
      if (!response.ok) {
        throw new Error(`Google Sheets responded with status ${response.status}`);
      }
      const data = await response.text();
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.send(data);
    } catch (error: any) {
      console.error("Error proxying Sheet B:", error);
      res.status(500).json({ error: error.message || "Failed to fetch Sheet B" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
