import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as admin from "firebase-admin";
import fs from "fs";

// Initialize Firebase Admin
try {
  let configStr = "";
  try {
    configStr = fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8");
  } catch (e) {
    // Ignore error
  }
  
  const config = configStr ? JSON.parse(configStr) : null;
  const projectId = config?.projectId || process.env.FIREBASE_PROJECT_ID || "platinum-scout-qf4nj";
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: projectId,
    });
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

// Middleware to verify Firebase Auth token
const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token", error);
    res.status(403).json({ error: "Unauthorized: Token verification failed" });
  }
};

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
  app.post("/api/verify-trade", verifyToken, async (req, res) => {
    // This is where you would put secure logic that shouldn't be exposed to the client
    // e.g., verifying a payment before updating a Firestore document
    const { productId, amount, paymentReference } = req.body;
    const user = (req as any).user;
    
    // Simulate payment verification with a payment gateway (e.g., Paystack/Stripe)
    if (!paymentReference) {
      res.status(400).json({ success: false, message: "Payment reference is required" });
      return;
    }
    
    // Example: verify paymentReference externally here...
    
    res.json({ 
      success: true, 
      message: `Trade verified securely for product ${productId}`,
      userId: user.uid
    });
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
