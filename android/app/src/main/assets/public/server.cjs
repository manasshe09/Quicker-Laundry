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
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");
var import_database = require("firebase/database");
var firebaseConfig = {
  apiKey: "AIzaSyCHWnO0XrCNoZqO1uQejd3b12RP4fLKrhw",
  authDomain: "quicker-billing-dashboard.firebaseapp.com",
  databaseURL: "https://quicker-billing-dashboard-default-rtdb.firebaseio.com",
  projectId: "quicker-billing-dashboard",
  storageBucket: "quicker-billing-dashboard.firebasestorage.app",
  messagingSenderId: "331168436694",
  appId: "1:331168436694:web:9833c9ee5b1b583cb59477",
  measurementId: "G-58DG6NW0VQ"
};
var firebaseApp = (0, import_app.getApps)().length === 0 ? (0, import_app.initializeApp)(firebaseConfig) : (0, import_app.getApp)();
var db = (0, import_firestore.getFirestore)(firebaseApp);
var rtdb = (0, import_database.getDatabase)(firebaseApp);
var ordersCache = {};
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "Quicker Laundry & Dry Cleaning API",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/orders", async (req, res) => {
    try {
      const body = req.body || {};
      const customerName = body.customerName || body.name || "Valued Customer";
      const customerMobile = body.customerMobile || body.phone || body.mobile || "";
      const deliveryType = body.deliveryType || "DOORSTEP";
      const paymentStatus = body.paymentStatus || "PENDING";
      const paymentMethod = body.paymentMethod || (paymentStatus === "PAID" ? "UPI" : "PayOnDelivery");
      const rawItems = Array.isArray(body.items) ? body.items : [];
      const orderNum = Math.floor(1e3 + Math.random() * 9e3);
      const orderId = body.orderId || body.id || `QK${orderNum}`;
      let calculatedTotal = 0;
      const normalizedItems = rawItems.map((it, index) => {
        const unitPrice = Number(it.unitPrice ?? it.price ?? 0);
        const qty = Number(it.quantity ?? 1);
        const itemTotal = unitPrice * qty;
        calculatedTotal += itemTotal;
        return {
          serviceId: it.serviceId || `srv-item-${index + 1}`,
          name: it.serviceName || it.name || it.itemType || "Laundry Item",
          category: it.category || "General Care",
          itemType: it.itemType || it.name || "Item",
          pricingUnit: it.pricingUnit || it.unit || "PER_PIECE",
          unit: it.pricingUnit || it.unit || "PER_PIECE",
          unitPrice,
          price: unitPrice,
          quantity: qty,
          total: itemTotal,
          itemTotal,
          service: it.service || {
            id: it.serviceId || `srv-item-${index + 1}`,
            name: it.serviceName || it.name || it.itemType || "Laundry Item",
            price: unitPrice,
            categoryName: it.category || "General Care",
            unitLabel: it.pricingUnit || it.unit || "per piece"
          }
        };
      });
      const totalAmount = Number(body.totalAmount ?? body.total ?? (calculatedTotal || 0));
      const subtotal = Number(body.subtotal ?? totalAmount);
      const discount = Number(body.discount ?? 0);
      const deliveryFee = Number(body.deliveryFee ?? 0);
      const orderData = {
        id: orderId,
        orderId,
        customerId: body.customerId || `cust-${Date.now()}`,
        customerName,
        customerPhone: customerMobile,
        phone: customerMobile,
        items: normalizedItems,
        totalAmount,
        total: totalAmount,
        subtotal,
        discount,
        deliveryFee,
        deliveryType,
        paymentStatus,
        paymentMethod,
        status: body.status || "CONFIRMED",
        orderType: deliveryType === "WALK_IN" ? "WALK_IN" : "ONLINE",
        createdAt: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16),
        createdAtString: (/* @__PURE__ */ new Date()).toISOString(),
        pickupSlot: body.pickupSlot || {
          date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          dayLabel: "Today",
          timeRange: "10:00 AM - 12:00 PM"
        },
        address: body.address || {
          tag: deliveryType === "WALK_IN" ? "Store Walk-in" : "Primary Address",
          line1: deliveryType === "WALK_IN" ? "Quicker Laundry Storefront" : "Customer Address",
          city: "Hyderabad",
          pincode: "500081"
        },
        specialInstructions: body.specialInstructions || ""
      };
      ordersCache[orderId] = orderData;
      try {
        const orderDocRef = (0, import_firestore.doc)(db, "orders", orderId);
        await (0, import_firestore.setDoc)(orderDocRef, {
          ...orderData,
          createdAt: (0, import_firestore.serverTimestamp)()
        }, { merge: true });
        console.log(`[API /orders] Synced order ${orderId} to Firestore`);
      } catch (firestoreErr) {
        console.warn("[API /orders] Firestore sync notice:", firestoreErr?.message || firestoreErr);
      }
      try {
        const orderRtdbRef = (0, import_database.ref)(rtdb, `orders/${orderId}`);
        await (0, import_database.set)(orderRtdbRef, {
          ...orderData,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log(`[API /orders] Synced order ${orderId} to RTDB`);
      } catch (rtdbErr) {
        console.warn("[API /orders] RTDB sync notice:", rtdbErr?.message || rtdbErr);
      }
      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        orderId,
        order: orderData
      });
    } catch (error) {
      console.error("[API /orders] Error creating order:", error);
      return res.status(500).json({
        success: false,
        error: error?.message || "Internal Server Error while creating order"
      });
    }
  });
  app.get("/api/orders", async (req, res) => {
    try {
      const ordersList = Object.values(ordersCache);
      try {
        const snapshot = await (0, import_firestore.getDocs)((0, import_firestore.collection)(db, "orders"));
        const remoteMap = /* @__PURE__ */ new Map();
        snapshot.forEach((d) => {
          remoteMap.set(d.id, d.data());
        });
        for (const [id, data] of remoteMap.entries()) {
          ordersCache[id] = { ...ordersCache[id], ...data };
        }
      } catch (e) {
      }
      const allOrders = Object.values(ordersCache);
      return res.json({
        success: true,
        count: allOrders.length,
        orders: allOrders
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error?.message || "Failed to retrieve orders"
      });
    }
  });
  app.get("/api/orders/:id", async (req, res) => {
    const { id } = req.params;
    if (ordersCache[id]) {
      return res.json({ success: true, order: ordersCache[id] });
    }
    try {
      const docRef = (0, import_firestore.doc)(db, "orders", id);
      const docSnap = await (0, import_firestore.getDoc)(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        ordersCache[id] = data;
        return res.json({ success: true, order: data });
      }
    } catch (e) {
    }
    return res.status(404).json({
      success: false,
      error: `Order with ID ${id} not found`
    });
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
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Quicker Laundry] Server listening at http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
