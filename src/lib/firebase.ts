import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { getDatabase, ref, set, update, onValue } from 'firebase/database';
import { Order, ServiceItem, Address } from '../types';

// The user's Firebase web app configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCHWnO0XrCNoZqO1uQejd3b12RP4fLKrhw",
  authDomain: "quicker-billing-dashboard.firebaseapp.com",
  databaseURL: "https://quicker-billing-dashboard-default-rtdb.firebaseio.com",
  projectId: "quicker-billing-dashboard",
  storageBucket: "quicker-billing-dashboard.firebasestorage.app",
  messagingSenderId: "331168436694",
  appId: "1:331168436694:web:9833c9ee5b1b583cb59477",
  measurementId: "G-58DG6NW0VQ",
};

// Initialize Firebase App singleton safely
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore & Realtime Database
export const db = getFirestore(firebaseApp);
export const rtdb = getDatabase(firebaseApp);

export interface FirebaseSyncStatus {
  isConnected: boolean;
  projectId: string;
  databaseUrl: string;
  lastSyncedAt: string | null;
  error: string | null;
}

/**
 * Save an order to Firestore 'orders' collection and Realtime Database
 * Configured specifically for integration with quicker-billing-dashboard
 */
export async function syncOrderToFirebase(
  order: Order,
  user?: { name: string; phone: string }
): Promise<boolean> {
  let success = false;

  // Format cart items cleanly for billing dashboards
  const cartItems = order.items.map((it) => ({
    serviceId: it.service.id,
    name: it.service.name,
    category: it.service.categoryName,
    unit: it.service.unitLabel,
    price: it.service.price,
    quantity: it.quantity,
    total: it.service.price * it.quantity,
    itemTotal: it.service.price * it.quantity,
    service: it.service,
  }));

  const customerName = user?.name || order.customerName || 'Customer';
  const customerPhone = user?.phone || order.customerPhone || '';

  try {
    // 1. Save to Firestore collection 'orders'
    // Matches the exact schema for quicker-billing-dashboard with orderType: "ONLINE"
    const firestoreOrderDocRef = doc(db, 'orders', order.id);
    await setDoc(
      firestoreOrderDocRef,
      {
        orderId: order.id,
        id: order.id,
        customerName: customerName,
        phone: customerPhone,
        items: cartItems,
        totalAmount: order.total,
        total: order.total,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryFee: order.deliveryFee,
        status: order.status || 'CONFIRMED',
        orderType: 'ONLINE', // Used for filtering online orders in the billing dashboard
        createdAt: serverTimestamp(),
        createdAtString: order.createdAt || new Date().toISOString(),
        pickupSlot: order.pickupSlot,
        address: order.address,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        specialInstructions: order.specialInstructions || '',
      },
      { merge: true }
    );
    success = true;
  } catch (err: any) {
    console.warn('[Firebase Firestore] Could not sync order to Firestore:', err?.message || err);
  }

  try {
    // 2. Also save to Realtime Database with ISO timestamp for real-time tracking
    const orderRtdbRef = ref(rtdb, `orders/${order.id}`);
    await set(orderRtdbRef, {
      orderId: order.id,
      id: order.id,
      customerName: customerName,
      phone: customerPhone,
      items: cartItems,
      totalAmount: order.total,
      total: order.total,
      status: order.status || 'CONFIRMED',
      orderType: 'ONLINE',
      createdAt: order.createdAt || new Date().toISOString(),
      pickupSlot: order.pickupSlot,
      address: order.address,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    });
    success = true;
  } catch (err: any) {
    console.warn('[Firebase Realtime DB] Could not sync order to RTDB:', err?.message || err);
  }

  return success;
}

/**
 * Direct helper matching:
 * await addDoc(collection(db, "orders"), { customerName, phone, items, totalAmount, status, orderType: "ONLINE", createdAt: serverTimestamp() })
 */
export async function createFirestoreOrder(orderData: {
  customerName: string;
  phone: string;
  items: any[];
  totalAmount: number;
  status?: string;
  orderType?: string;
  [key: string]: any;
}): Promise<string> {
  const payload = {
    ...orderData,
    status: orderData.status || 'CONFIRMED',
    orderType: orderData.orderType || 'ONLINE',
    createdAt: serverTimestamp(),
  };

  if (orderData.id || orderData.orderId) {
    const docId = orderData.id || orderData.orderId;
    const docRef = doc(db, 'orders', docId);
    await setDoc(docRef, payload, { merge: true });
    return docId;
  } else {
    const docRef = await addDoc(collection(db, 'orders'), payload);
    return docRef.id;
  }
}

/**
 * Update an order status and verification details in Firebase
 */
export async function syncOrderStatusToFirebase(orderId: string, updates: Partial<Order>): Promise<boolean> {
  let success = false;
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, { ...updates, updatedAt: new Date().toISOString() });
    success = true;
  } catch (err: any) {
    console.warn('[Firebase Firestore] Status update notice:', err?.message || err);
  }

  try {
    const orderRtdbRef = ref(rtdb, `orders/${orderId}`);
    await update(orderRtdbRef, { ...updates, updatedAt: new Date().toISOString() });
    success = true;
  } catch (err: any) {
    console.warn('[Firebase RTDB] Status update notice:', err?.message || err);
  }

  return success;
}

/**
 * Listen for real-time updates to orders collection
 */
export function subscribeToFirebaseOrders(onOrdersChanged: (orders: Order[]) => void) {
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            list.push(data);
          });
          onOrdersChanged(list);
        }
      },
      (error) => {
        console.info('[Firebase] Using local state; Firestore listener received:', error.message);
      }
    );
    return unsubscribe;
  } catch (e: any) {
    console.info('[Firebase] Listener error:', e?.message || e);
    return () => {};
  }
}

/**
 * Sync service item changes to Firebase
 */
export async function syncServiceToFirebase(service: ServiceItem): Promise<boolean> {
  try {
    const svcRef = doc(db, 'services', service.id);
    await setDoc(svcRef, service, { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firebase] Service sync notice:', err);
    return false;
  }
}
