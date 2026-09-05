import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getDatabase, ref, set, get } from 'firebase/database';

// Firebase configuration for quicker-billing-dashboard
const firebaseConfig = {
  apiKey: "AIzaSyCHWnO0XrCNoZqO1uQejd3b12RP4fLKrhw",
  authDomain: "quicker-billing-dashboard.firebaseapp.com",
  databaseURL: "https://quicker-billing-dashboard-default-rtdb.firebaseio.com",
  projectId: "quicker-billing-dashboard",
  storageBucket: "quicker-billing-dashboard.firebasestorage.app",
  messagingSenderId: "331168436694",
  appId: "1:331168436694:web:9833c9ee5b1b583cb59477",
  measurementId: "G-58DG6NW0VQ",
};

// Initialize Firebase App singleton
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(firebaseApp);
const rtdb = getDatabase(firebaseApp);

// In-memory fallback / cache of orders
const ordersCache: Record<string, any> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // CORS middleware - allows external fetch from mobile apps, localhost, or LAN (e.g. 192.168.x.x)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Quicker Laundry & Dry Cleaning API',
      timestamp: new Date().toISOString(),
    });
  });

  // POST /api/orders - Endpoint to place a laundry order
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const body = req.body || {};

      const customerName = body.customerName || body.name || 'Valued Customer';
      const customerMobile = body.customerMobile || body.phone || body.mobile || '';
      const deliveryType = body.deliveryType || 'DOORSTEP';
      const paymentStatus = body.paymentStatus || 'PENDING';
      const paymentMethod = body.paymentMethod || (paymentStatus === 'PAID' ? 'UPI' : 'PayOnDelivery');
      const rawItems = Array.isArray(body.items) ? body.items : [];

      // Generate a distinct order ID if not provided
      const orderNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = body.orderId || body.id || `QK${orderNum}`;

      // Normalize items structure
      let calculatedTotal = 0;
      const normalizedItems = rawItems.map((it: any, index: number) => {
        const unitPrice = Number(it.unitPrice ?? it.price ?? 0);
        const qty = Number(it.quantity ?? 1);
        const itemTotal = unitPrice * qty;
        calculatedTotal += itemTotal;

        return {
          serviceId: it.serviceId || `srv-item-${index + 1}`,
          name: it.serviceName || it.name || it.itemType || 'Laundry Item',
          category: it.category || 'General Care',
          itemType: it.itemType || it.name || 'Item',
          pricingUnit: it.pricingUnit || it.unit || 'PER_PIECE',
          unit: it.pricingUnit || it.unit || 'PER_PIECE',
          unitPrice: unitPrice,
          price: unitPrice,
          quantity: qty,
          total: itemTotal,
          itemTotal: itemTotal,
          service: it.service || {
            id: it.serviceId || `srv-item-${index + 1}`,
            name: it.serviceName || it.name || it.itemType || 'Laundry Item',
            price: unitPrice,
            categoryName: it.category || 'General Care',
            unitLabel: it.pricingUnit || it.unit || 'per piece',
          },
        };
      });

      const totalAmount = Number(body.totalAmount ?? body.total ?? (calculatedTotal || 0));
      const subtotal = Number(body.subtotal ?? totalAmount);
      const discount = Number(body.discount ?? 0);
      const deliveryFee = Number(body.deliveryFee ?? 0);

      const orderData = {
        id: orderId,
        orderId: orderId,
        customerId: body.customerId || `cust-${Date.now()}`,
        customerName: customerName,
        customerPhone: customerMobile,
        phone: customerMobile,
        items: normalizedItems,
        totalAmount: totalAmount,
        total: totalAmount,
        subtotal: subtotal,
        discount: discount,
        deliveryFee: deliveryFee,
        deliveryType: deliveryType,
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethod,
        status: body.status || 'CONFIRMED',
        orderType: deliveryType === 'WALK_IN' ? 'WALK_IN' : 'ONLINE',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        createdAtString: new Date().toISOString(),
        pickupSlot: body.pickupSlot || {
          date: new Date().toISOString().split('T')[0],
          dayLabel: 'Today',
          timeRange: '10:00 AM - 12:00 PM',
        },
        address: body.address || {
          tag: deliveryType === 'WALK_IN' ? 'Store Walk-in' : 'Primary Address',
          line1: deliveryType === 'WALK_IN' ? 'Quicker Laundry Storefront' : 'Customer Address',
          city: 'Hyderabad',
          pincode: '500081',
        },
        specialInstructions: body.specialInstructions || '',
      };

      // Store in memory cache
      ordersCache[orderId] = orderData;

      // Sync to Firestore 'orders' collection
      try {
        const orderDocRef = doc(db, 'orders', orderId);
        await setDoc(orderDocRef, {
          ...orderData,
          createdAt: serverTimestamp(),
        }, { merge: true });
        console.log(`[API /orders] Synced order ${orderId} to Firestore`);
      } catch (firestoreErr: any) {
        console.warn('[API /orders] Firestore sync notice:', firestoreErr?.message || firestoreErr);
      }

      // Sync to Realtime Database
      try {
        const orderRtdbRef = ref(rtdb, `orders/${orderId}`);
        await set(orderRtdbRef, {
          ...orderData,
          createdAt: new Date().toISOString(),
        });
        console.log(`[API /orders] Synced order ${orderId} to RTDB`);
      } catch (rtdbErr: any) {
        console.warn('[API /orders] RTDB sync notice:', rtdbErr?.message || rtdbErr);
      }

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        orderId: orderId,
        order: orderData,
      });
    } catch (error: any) {
      console.error('[API /orders] Error creating order:', error);
      return res.status(500).json({
        success: false,
        error: error?.message || 'Internal Server Error while creating order',
      });
    }
  });

  // GET /api/orders - Fetch all orders
  app.get('/api/orders', async (req: Request, res: Response) => {
    try {
      const ordersList: any[] = Object.values(ordersCache);

      // Attempt to pull any latest orders from Firestore as well
      try {
        const snapshot = await getDocs(collection(db, 'orders'));
        const remoteMap = new Map<string, any>();
        snapshot.forEach((d) => {
          remoteMap.set(d.id, d.data());
        });
        for (const [id, data] of remoteMap.entries()) {
          ordersCache[id] = { ...ordersCache[id], ...data };
        }
      } catch (e: any) {
        // Fallback to cache if Firestore fetch fails
      }

      const allOrders = Object.values(ordersCache);
      return res.json({
        success: true,
        count: allOrders.length,
        orders: allOrders,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: error?.message || 'Failed to retrieve orders',
      });
    }
  });

  // GET /api/orders/:id - Fetch a single order
  app.get('/api/orders/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    if (ordersCache[id]) {
      return res.json({ success: true, order: ordersCache[id] });
    }

    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        ordersCache[id] = data;
        return res.json({ success: true, order: data });
      }
    } catch (e: any) {
      // Continue
    }

    return res.status(404).json({
      success: false,
      error: `Order with ID ${id} not found`,
    });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Quicker Laundry] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
