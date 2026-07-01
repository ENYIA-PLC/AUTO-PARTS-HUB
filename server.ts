import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "fs";
import { Server } from "socket.io";
import * as http from "http";

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
  
  if (getApps().length === 0) {
    initializeApp({
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
    const decodedToken = await getAuth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token", error);
    res.status(403).json({ error: "Unauthorized: Token verification failed" });
  }
};

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    let simInterval: NodeJS.Timeout | null = null;

    socket.on("join-tracking", (trackingId) => {
      socket.join(`tracking_${trackingId}`);
      console.log(`Socket ${socket.id} joined tracking room: tracking_${trackingId}`);
      
      // Stop any existing simulation for this socket
      if (simInterval) clearInterval(simInterval);
      
      // Start a mock simulation loop for demo purposes
      let step = 0;
      const startLoc = { lat: 8.8, lng: 7.3 }; // Example start
      const destLoc = { lat: 9.076, lng: 7.398 }; // Example destination (Abuja)
      const totalSteps = 20;

      simInterval = setInterval(() => {
        step++;
        if (step > totalSteps) step = totalSteps;
        
        const progress = step / totalSteps;
        // Simple linear interpolation
        const currentLat = startLoc.lat + (destLoc.lat - startLoc.lat) * progress;
        const currentLng = startLoc.lng + (destLoc.lng - startLoc.lng) * progress;
        
        const etaMins = Math.max(0, 45 - Math.floor((45 * progress)));
        
        const payload = {
          lat: currentLat,
          lng: currentLng,
          speed: 45 + Math.floor(Math.random() * 15), // Random speed 45-60
          status: step === totalSteps ? 'Delivered' : 'In Transit',
          etaMins,
          timestamp: new Date().toISOString()
        };
        
        socket.emit("location_update", payload);
        
        if (step === totalSteps) {
            clearInterval(simInterval!);
        }
      }, 4000); // update every 4 seconds
    });

    socket.on("disconnect", () => {
        if (simInterval) clearInterval(simInterval);
    });
  });

  const PORT = 3000;

  // For JSON parsing
  app.use(express.json());

  // Define API routes here FIRST
  // Example API route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Node.js backend is running alongside Firebase!" });
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const db = getFirestore();
      const snapshot = await db.collection("products").get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const db = getFirestore();
      const doc = await db.collection("products").doc(req.params.id).get();
      if (!doc.exists) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, product: { id: doc.id, ...doc.data() } });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ success: false, error: "Failed to fetch product" });
    }
  });

  // Add a new product (Secure route)
  app.post("/api/products", verifyToken, async (req, res) => {
    try {
      const db = getFirestore();
      const user = (req as any).user;
      
      const newProduct = {
        ...req.body,
        sellerId: user.uid,
        createdAt: FieldValue.serverTimestamp(),
      };
      
      const docRef = await db.collection("products").add(newProduct);
      res.status(201).json({ success: true, product: { id: docRef.id, ...newProduct } });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ success: false, error: "Failed to create product" });
    }
  });

  // Create a new order (Secure route)
  app.post("/api/orders", verifyToken, async (req, res) => {
    try {
      const db = getFirestore();
      const user = (req as any).user;
      
      const { items, total, shippingAddress } = req.body;
      
      if (!items || !items.length) {
         res.status(400).json({ success: false, error: "Order must contain items" });
         return;
      }

      const newOrder = {
        userId: user.uid,
        items,
        total,
        shippingAddress,
        status: "Processing",
        createdAt: FieldValue.serverTimestamp(),
      };
      
      const docRef = await db.collection("orders").add(newOrder);
      res.status(201).json({ success: true, order: { id: docRef.id, ...newOrder } });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  });

  // Get user's orders (Secure route)
  app.get("/api/orders", verifyToken, async (req, res) => {
    try {
      const db = getFirestore();
      const user = (req as any).user;
      
      const snapshot = await db.collection("orders")
        .where("userId", "==", user.uid)
        .orderBy("createdAt", "desc")
        .get();
        
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, error: "Failed to fetch orders" });
    }
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

  // --- Live Location Tracker Features --- //

  // 1. WebSocket / REST hybrid for live location updates from courier
  app.post("/api/tracking/:orderId/location", verifyToken, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { lat, lng, speed, status } = req.body;
      const db = getFirestore();

      // Simple mock ETA calculation. Real app would use Google Maps Routes API.
      const etaMins = Math.max(1, Math.floor(Math.random() * 20) + 5); 

      const payload = {
        lat, 
        lng, 
        speed: speed || 0, 
        status: status || 'In Transit', 
        etaMins, 
        timestamp: FieldValue.serverTimestamp()
      };

      // Ensure tracking document exists and is updated
      const orderRef = db.collection("orders").doc(orderId);
      const trackingHistoryRef = orderRef.collection("tracking_history");
      
      await trackingHistoryRef.add(payload);
      
      const payloadString = { ...payload, timestamp: new Date().toISOString() };
      await orderRef.update({ currentLocation: payloadString }).catch(() => {}); // ignore error if not found 

      // Broadcast real-time location via Socket.IO
      io.to(`tracking_${orderId}`).emit("location_update", payloadString);

      res.json({ success: true, message: "Location broadcasted", payload: payloadString });
    } catch (error) {
      console.error("Location update err:", error);
      res.status(500).json({ success: false, error: "Failed to update location" });
    }
  });

  // 2. ETA Calculation API (Mocked dynamically based on current user coords)
  app.post("/api/tracking/:orderId/eta", verifyToken, async (req, res) => {
    const { lat, lng, destLat, destLng } = req.body;
    // Mock ETA and distance
    const distanceKm = +(Math.random() * 10 + 1).toFixed(1);
    const etaMins = Math.floor(distanceKm * 4); // roughly 4 mins per km in traffic
    res.json({ success: true, etaMins, distanceKm });
  });

  // 3. Get Route History (Location timeline for map rendering)
  app.get("/api/tracking/:orderId/history", verifyToken, async (req, res) => {
    try {
      const db = getFirestore();
      const snapshot = await db.collection("orders").doc(req.params.orderId)
                               .collection("tracking_history")
                               .orderBy("timestamp", "asc").limit(50).get();
                               
      const history = snapshot.docs.map(doc => {
         const data = doc.data();
         // handle firestore timestamp conversion
         const timestamp = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString();
         return { id: doc.id, ...data, timestamp };
      });

      res.json({ success: true, history });
    } catch(err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Failed to fetch tracking history" });
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
    // Serve static files from 'dist' in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
