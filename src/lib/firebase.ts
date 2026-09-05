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
  setLogLevel,
} from 'firebase/firestore';
import { getDatabase, ref, set, update, onValue } from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
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

// Silence SDK internal offline warnings when Firestore backend is not yet provisioned in Console
try {
  setLogLevel('silent');
} catch {}

// Initialize Firestore & Realtime Database
export const db = getFirestore(firebaseApp);
export const rtdb = getDatabase(firebaseApp);
export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export interface GoogleSignInResult {
  success: boolean;
  user?: FirebaseUser;
  error?: string;
  code?: string;
  isUnauthorizedDomain?: boolean;
  isConfigMissing?: boolean;
  isPopupBlocked?: boolean;
  currentDomain?: string;
}

/**
 * Sign in using Firebase Google Auth with popup
 */
export async function signInWithGooglePopup(): Promise<GoogleSignInResult> {
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('[Firebase Auth] Google Sign-In error:', error);
    const errorCode = error?.code || '';
    const errorMsg = error?.message || '';

    const isUnauthorizedDomain =
      errorCode === 'auth/unauthorized-domain' ||
      errorMsg.includes('unauthorized-domain');

    const isPopupBlocked =
      errorCode === 'auth/popup-blocked' ||
      errorMsg.includes('popup-blocked');

    const isConfigMissing =
      errorCode === 'auth/configuration-not-found' ||
      errorMsg.includes('configuration-not-found') ||
      errorCode === 'auth/operation-not-allowed';

    let userFriendlyMessage = errorMsg || 'Google sign-in could not be completed.';
    if (isUnauthorizedDomain) {
      userFriendlyMessage = `Domain authorization required: "${currentDomain}" needs to be added to Authorized Domains in your Firebase Console (quicker-billing-dashboard).`;
    } else if (isPopupBlocked) {
      userFriendlyMessage = 'Popup was blocked by your browser. Please allow popups for this site.';
    } else if (isConfigMissing) {
      userFriendlyMessage = 'Google Sign-In is not enabled yet in your Firebase Console under Authentication > Sign-in method.';
    }

    return {
      success: false,
      error: userFriendlyMessage,
      code: errorCode,
      isUnauthorizedDomain,
      isConfigMissing,
      isPopupBlocked,
      currentDomain,
    };
  }
}

/**
 * Sign out from Firebase Auth
 */
export async function logOutFromFirebase(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (err) {
    console.warn('[Firebase Auth] Logout error:', err);
  }
}

/**
 * Listen to Firebase Auth state changes
 */
export function onAuthUserChanged(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

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
 * Listen for real-time updates to orders collection safely
 */
export function subscribeToFirebaseOrders(onOrdersChanged: (orders: Order[]) => void) {
  let isUnsubscribed = false;
  let firestoreUnsub: (() => void) | null = null;
  let rtdbUnsub: (() => void) | null = null;

  // 1. Listen to Firestore with auto-detachment on backend unavailability
  try {
    const ordersCol = collection(db, 'orders');
    const q = query(ordersCol);
    firestoreUnsub = onSnapshot(
      q,
      (snapshot) => {
        if (!isUnsubscribed && !snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            list.push(data);
          });
          onOrdersChanged(list);
        }
      },
      (_error) => {
        // Detach immediately on error (e.g. offline, database not provisioned) to avoid continuous connection retries
        if (firestoreUnsub && !isUnsubscribed) {
          try {
            firestoreUnsub();
          } catch {}
          firestoreUnsub = null;
        }
      }
    );
  } catch {
    // Silently fall back to local state
  }

  // 2. Also listen to Realtime Database if configured
  try {
    const ordersRtdbRef = ref(rtdb, 'orders');
    rtdbUnsub = onValue(
      ordersRtdbRef,
      (snapshot) => {
        if (!isUnsubscribed && snapshot.exists()) {
          const val = snapshot.val();
          if (val && typeof val === 'object') {
            const list: Order[] = Object.values(val);
            if (list.length > 0) {
              onOrdersChanged(list);
            }
          }
        }
      },
      () => {
        // Silently catch permission notices
      }
    );
  } catch {
    // Silently ignore
  }

  return () => {
    isUnsubscribed = true;
    if (firestoreUnsub) {
      try {
        firestoreUnsub();
      } catch {}
    }
    if (rtdbUnsub) {
      try {
        rtdbUnsub();
      } catch {}
    }
  };
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
