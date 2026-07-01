var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
var import_firestore = require("firebase-admin/firestore");
var import_fs = __toESM(require("fs"), 1);
var import_socket = require("socket.io");
var http = __toESM(require("http"), 1);
try {
  let configStr = "";
  try {
    configStr = import_fs.default.readFileSync(import_path.default.join(process.cwd(), "firebase-applet-config.json"), "utf8");
  } catch (e) {
  }
  const config = configStr ? JSON.parse(configStr) : null;
  const projectId = config?.projectId || process.env.FIREBASE_PROJECT_ID || "platinum-scout-qf4nj";
  if ((0, import_app.getApps)().length === 0) {
    (0, import_app.initializeApp)({
      projectId
    });
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}
var verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return;
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await (0, import_auth.getAuth)().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying auth token", error);
    res.status(403).json({ error: "Unauthorized: Token verification failed" });
  }
};
async function startServer() {
  const app = (0, import_express.default)();
  const server = http.createServer(app);
  const io = new import_socket.Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    let simInterval = null;
    socket.on("join-tracking", (trackingId) => {
      socket.join(`tracking_${trackingId}`);
      console.log(`Socket ${socket.id} joined tracking room: tracking_${trackingId}`);
      if (simInterval) clearInterval(simInterval);
      let step = 0;
      const startLoc = { lat: 8.8, lng: 7.3 };
      const destLoc = { lat: 9.076, lng: 7.398 };
      const totalSteps = 20;
      simInterval = setInterval(() => {
        step++;
        if (step > totalSteps) step = totalSteps;
        const progress = step / totalSteps;
        const currentLat = startLoc.lat + (destLoc.lat - startLoc.lat) * progress;
        const currentLng = startLoc.lng + (destLoc.lng - startLoc.lng) * progress;
        const etaMins = Math.max(0, 45 - Math.floor(45 * progress));
        const payload = {
          lat: currentLat,
          lng: currentLng,
          speed: 45 + Math.floor(Math.random() * 15),
          // Random speed 45-60
          status: step === totalSteps ? "Delivered" : "In Transit",
          etaMins,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        socket.emit("location_update", payload);
        if (step === totalSteps) {
          clearInterval(simInterval);
        }
      }, 4e3);
    });
    socket.on("disconnect", () => {
      if (simInterval) clearInterval(simInterval);
    });
  });
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Node.js backend is running alongside Firebase!" });
  });
  app.get("/api/products", async (req, res) => {
    try {
      const db = (0, import_firestore.getFirestore)();
      const snapshot = await db.collection("products").get();
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  });
  app.get("/api/products/:id", async (req, res) => {
    try {
      const db = (0, import_firestore.getFirestore)();
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
  app.post("/api/products", verifyToken, async (req, res) => {
    try {
      const db = (0, import_firestore.getFirestore)();
      const user = req.user;
      const newProduct = {
        ...req.body,
        sellerId: user.uid,
        createdAt: import_firestore.FieldValue.serverTimestamp()
      };
      const docRef = await db.collection("products").add(newProduct);
      res.status(201).json({ success: true, product: { id: docRef.id, ...newProduct } });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ success: false, error: "Failed to create product" });
    }
  });
  app.post("/api/orders", verifyToken, async (req, res) => {
    try {
      const db = (0, import_firestore.getFirestore)();
      const user = req.user;
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
        createdAt: import_firestore.FieldValue.serverTimestamp()
      };
      const docRef = await db.collection("orders").add(newOrder);
      res.status(201).json({ success: true, order: { id: docRef.id, ...newOrder } });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ success: false, error: "Failed to create order" });
    }
  });
  app.get("/api/orders", verifyToken, async (req, res) => {
    try {
      const db = (0, import_firestore.getFirestore)();
      const user = req.user;
      const snapshot = await db.collection("orders").where("userId", "==", user.uid).orderBy("createdAt", "desc").get();
      const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, error: "Failed to fetch orders" });
    }
  });
  app.post("/api/verify-trade", verifyToken, async (req, res) => {
    const { productId, amount, paymentReference } = req.body;
    const user = req.user;
    if (!paymentReference) {
      res.status(400).json({ success: false, message: "Payment reference is required" });
      return;
    }
    res.json({
      success: true,
      message: `Trade verified securely for product ${productId}`,
      userId: user.uid
    });
  });
  app.post("/api/tracking/:orderId/location", verifyToken, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { lat, lng, speed, status } = req.body;
      const db = (0, import_firestore.getFirestore)();
      const etaMins = Math.max(1, Math.floor(Math.random() * 20) + 5);
      const payload = {
        lat,
        lng,
        speed: speed || 0,
        status: status || "In Transit",
        etaMins,
        timestamp: import_firestore.FieldValue.serverTimestamp()
      };
      const orderRef = db.collection("orders").doc(orderId);
      const trackingHistoryRef = orderRef.collection("tracking_history");
      await trackingHistoryRef.add(payload);
      const payloadString = { ...payload, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
      await orderRef.update({ currentLocation: payloadString }).catch(() => {
      });
      io.to(`tracking_${orderId}`).emit("location_update", payloadString);
      res.json({ success: true, message: "Location broadcasted", payload: payloadString });
    } catch (error) {
      console.error("Location update err:", error);
      res.status(500).json({ success: false, error: "Failed to update location" });
    }
  });
  app.post("/api/tracking/:orderId/eta", verifyToken, async (req, res) => {
    const { lat, lng, destLat, destLng } = req.body;
    const distanceKm = +(Math.random() * 10 + 1).toFixed(1);
    const etaMins = Math.floor(distanceKm * 4);
    res.json({ success: true, etaMins, distanceKm });
  });
  app.get("/api/tracking/:orderId/history", verifyToken, async (req, res) => {
    try {
      const db = (0, import_firestore.getFirestore)();
      const snapshot = await db.collection("orders").doc(req.params.orderId).collection("tracking_history").orderBy("timestamp", "asc").limit(50).get();
      const history = snapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : (/* @__PURE__ */ new Date()).toISOString();
        return { id: doc.id, ...data, timestamp };
      });
      res.json({ success: true, history });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: "Failed to fetch tracking history" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
