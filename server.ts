import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // For JSON parsing
  app.use(express.json());

  // Define API routes here FIRST
  // Example API route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Node.js backend is running alongside Firebase!" });
  });

  // Example API route to handle secure operations
  app.post("/api/verify-trade", (req, res) => {
    // This is where you would put secure logic that shouldn't be exposed to the client
    // e.g., verifying a payment before updating a Firestore document
    const { productId, amount } = req.body;
    // Perform checks...
    res.json({ success: true, message: `Trade verified for product ${productId}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from 'dist' in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
