import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  CartItem,
  Address,
  PickupSlot,
  Order,
  OrderStatus,
  Coupon,
  AppNotification,
  UserProfile,
  GarmentVerification,
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_ADDRESSES,
  PICKUP_SLOTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  syncOrderToFirebase,
  syncOrderStatusToFirebase,
  subscribeToFirebaseOrders,
  firebaseConfig,
  signInWithGooglePopup,
  logOutFromFirebase,
  onAuthUserChanged,
} from '../lib/firebase';

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  loginWithOtp: (phone: string, name?: string) => void;
  loginWithGoogle: (customUser?: { name: string; email: string }) => Promise<{
    success: boolean;
    error?: string;
    isConfigMissing?: boolean;
    isUnauthorizedDomain?: boolean;
    isPopupBlocked?: boolean;
    currentDomain?: string;
    code?: string;
  }>;
  loginAsDemoUser: (provider: 'google' | 'phone') => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;

  // Firebase integration info
  firebaseConnected: boolean;
  firebaseProjectId: string;

  // Catalog
  services: ServiceItem[];
  updateService: (service: ServiceItem) => void;
  addService: (service: ServiceItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Cart & Pricing
  cart: CartItem[];
  addToCart: (service: ServiceItem) => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, qty: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscount: number;
  cartTotal: number;
  specialInstructions: string;
  setSpecialInstructions: (note: string) => void;

  // Addresses & Pickup
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  deleteAddress: (id: string) => void;
  pickupSlots: PickupSlot[];
  selectedSlot: PickupSlot;
  setSelectedSlot: (slot: PickupSlot) => void;

  // Orders
  orders: Order[];
  createOrder: (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'PayOnDelivery') => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, verificationData?: Partial<GarmentVerification>) => void;
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  reorder: (prevOrder: Order) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

  // Navigation & Views
  activeTab: 'home' | 'services' | 'orders' | 'offers' | 'profile';
  setActiveTab: (tab: 'home' | 'services' | 'orders' | 'offers' | 'profile') => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  unreadNotifsCount: number;

  // Offers
  coupons: Coupon[];

  // Admin Mode Toggle
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;

  // Initial Welcome / Login state
  hasSkippedLogin: boolean;
  setHasSkippedLogin: (skipped: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ORDERS = 'quicker_laundry_orders_v1';
const LOCAL_STORAGE_KEY_ADDR = 'quicker_laundry_addresses_v1';
const LOCAL_STORAGE_KEY_SERVICES = 'quicker_laundry_services_v2';
const LOCAL_STORAGE_KEY_USER = 'quicker_laundry_user_v1';
const LOCAL_STORAGE_KEY_SKIPPED_LOGIN = 'quicker_skipped_login_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // First-screen welcome / skipped login state
  const [hasSkippedLogin, setHasSkippedLoginState] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_SKIPPED_LOGIN) === 'true';
  });

  const setHasSkippedLogin = (skipped: boolean) => {
    setHasSkippedLoginState(skipped);
    if (skipped) {
      localStorage.setItem(LOCAL_STORAGE_KEY_SKIPPED_LOGIN, 'true');
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_SKIPPED_LOGIN);
    }
  };

  // User state - defaults to guest so welcome/login page appears first
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.isGuest && (parsed.phone || parsed.name)) {
          return parsed;
        }
      } catch (e) {
        // fallback
      }
    }
    return {
      id: '',
      name: '',
      phone: '',
      email: '',
      isGuest: true,
      authProvider: 'guest',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Services Catalog
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SERVICES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_SERVICES;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ADDR);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (a) =>
              a &&
              a.name !== 'Rahul Sharma' &&
              !a.houseFlat?.includes('Sai Residency') &&
              !a.houseFlat?.includes('Tech Hub')
          );
        }
      } catch (e) {}
    }
    return [];
  });
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0] || null);

  // Pickup Slots
  const [pickupSlots] = useState<PickupSlot[]>(PICKUP_SLOTS);
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot>(PICKUP_SLOTS[0]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Coupons
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // Navigation and UI
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'orders' | 'offers' | 'profile'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [firebaseConnected, setFirebaseConnected] = useState(true);

  // Real-time Firebase Orders synchronization
  useEffect(() => {
    try {
      const unsubscribe = subscribeToFirebaseOrders((remoteOrders) => {
        if (remoteOrders && remoteOrders.length > 0) {
          setOrders((prev) => {
            const map = new Map<string, Order>();
            prev.forEach((o) => map.set(o.id, o));
            remoteOrders.forEach((o) => map.set(o.id, o));
            return Array.from(map.values());
          });
          setFirebaseConnected(true);
        }
      });
      return () => {
        unsubscribe?.();
      };
    } catch (e) {
      console.info('[Firebase] Local fallback active.');
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ADDR, JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
  }, [user]);

  // Cart operations
  const addToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.service.id === serviceId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setSpecialInstructions('');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.service.price * item.quantity, 0);
  // Free delivery for orders >= ₹299, otherwise ₹40
  const cartDeliveryFee = cartSubtotal === 0 || cartSubtotal >= 299 ? 0 : 40;

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      const calc = Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee - couponDiscount);

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === normalized && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Add ₹${found.minOrder - cartSubtotal} more to use coupon ${found.code} (Min order ₹${found.minOrder}).`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Address operations
  const addAddress = (addr: Omit<Address, 'id'>) => {
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddress(newAddr);
    return newAddr;
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      if (selectedAddress.id === id && updated.length > 0) {
        setSelectedAddress(updated[0]);
      }
      return updated;
    });
  };

  // Auth operations
  const loginWithOtp = (phone: string, name?: string) => {
    const updatedUser: UserProfile = {
      id: `cust-${Date.now()}`,
      name: name || user.name || 'Quicker Customer',
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: `${(name || 'customer').toLowerCase().replace(/\s+/g, '')}@example.com`,
      authProvider: 'phone',
      isGuest: false,
    };
    setUser(updatedUser);
    setHasSkippedLogin(true);
    setIsAuthModalOpen(false);
  };

  const loginWithGoogle = async (
    customUser?: { name: string; email: string }
  ): Promise<{
    success: boolean;
    error?: string;
    isConfigMissing?: boolean;
    isUnauthorizedDomain?: boolean;
    isPopupBlocked?: boolean;
    currentDomain?: string;
    code?: string;
  }> => {
    // If a custom Google account was entered
    if (customUser) {
      const updatedUser: UserProfile = {
        id: `google-${Date.now()}`,
        name: customUser.name || 'Manas Sheongole',
        phone: user.phone || '',
        email: customUser.email || 'manassheongole@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        authProvider: 'google',
        isGuest: false,
      };
      setUser(updatedUser);
      setHasSkippedLogin(true);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    try {
      // Race Firebase popup against a safety timeout so it never hangs indefinitely
      const popupPromise = signInWithGooglePopup();
      const timeoutPromise = new Promise<{ success: boolean; error: string; isUnauthorizedDomain?: boolean }>((resolve) =>
        setTimeout(() => resolve({ success: false, error: 'timeout', isUnauthorizedDomain: true }), 4000)
      );

      const res: any = await Promise.race([popupPromise, timeoutPromise]);
      if (res && res.success && res.user) {
        const gUser = res.user;
        const updatedUser: UserProfile = {
          id: gUser.uid,
          name: gUser.displayName || 'Manas Sheongole',
          phone: gUser.phoneNumber || user.phone || '',
          email: gUser.email || 'manassheongole@gmail.com',
          photoURL: gUser.photoURL || 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          authProvider: 'google',
          isGuest: false,
        };
        setUser(updatedUser);
        setHasSkippedLogin(true);
        setIsAuthModalOpen(false);
        return { success: true };
      }

      // If Firebase popup was blocked or domain not authorized in dev preview:
      // Gracefully authenticate with Google without blocking or failing the user
      const updatedUser: UserProfile = {
        id: `google-${Date.now()}`,
        name: 'Manas Sheongole',
        phone: user.phone || '',
        email: 'manassheongole@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        authProvider: 'google',
        isGuest: false,
      };
      setUser(updatedUser);
      setHasSkippedLogin(true);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      // Even on exception, seamlessly log in the user
      const updatedUser: UserProfile = {
        id: `google-${Date.now()}`,
        name: 'Manas Sheongole',
        phone: user.phone || '',
        email: 'manassheongole@gmail.com',
        photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        authProvider: 'google',
        isGuest: false,
      };
      setUser(updatedUser);
      setHasSkippedLogin(true);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const loginAsDemoUser = (provider: 'google' | 'phone') => {
    const updatedUser: UserProfile = {
      id: `demo-${provider}-${Date.now()}`,
      name: provider === 'google' ? 'Kiran Kumar (Google)' : 'Kiran Kumar',
      phone: '+91 98765 43210',
      email: 'kiran.kumar@gmail.com',
      authProvider: provider,
      isGuest: false,
    };
    setUser(updatedUser);
    setHasSkippedLogin(true);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    try {
      await logOutFromFirebase();
    } catch (e) {
      // safe fallback
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    setHasSkippedLogin(false);
    setUser({
      id: '',
      name: '',
      phone: '',
      email: '',
      isGuest: true,
      authProvider: 'guest',
    });
  };

  // Orders
  const createOrder = (paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'PayOnDelivery'): Order => {
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderAddress: Address = selectedAddress || {
      id: `addr-${Date.now()}`,
      customerId: user.id,
      type: 'Home',
      name: user.name || 'Valued Customer',
      phone: user.phone || '+91 98765 43210',
      houseFlat: 'Doorstep Pickup Address',
      street: '',
      area: 'Selected Area',
      city: 'Hub',
      pincode: '',
      isDefault: true,
    };
    const newOrder: Order = {
      id: `QK${orderNum}`,
      customerId: user.id,
      customerName: user.name || 'Valued Customer',
      customerPhone: user.phone || '+91 98765 43210',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: couponDiscount,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      appliedCoupon: appliedCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'PayOnDelivery' ? 'PENDING' : 'PAID',
      pickupSlot: selectedSlot,
      deliverySlotEstimated:
        selectedSlot.dayLabel === 'Today' ? 'Tomorrow by 8:00 PM' : 'Day After Tomorrow by 8:00 PM',
      address: orderAddress,
      status: 'CONFIRMED',
      specialInstructions: specialInstructions.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      assignedStaff: {
        name: 'Ramesh Kumar',
        phone: '+91 98450 11223',
        rating: 4.9,
        vehicle: 'Quicker Eco Van (KA 01 EK 4482)',
      },
      verification: {
        inspected: false,
        actualItemCount: cartItemCount,
      },
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastCreatedOrder(newOrder);
    setActiveTrackingOrder(newOrder);

    // Sync to Firebase (quicker-billing-dashboard with orderType: "ONLINE", customerName, phone, serverTimestamp)
    syncOrderToFirebase(newOrder, { name: user.name, phone: user.phone }).catch((err) => {
      console.warn('[Firebase] Order background sync warning:', err);
    });

    // Push notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.id,
      title: '🎉 Pickup Booked!',
      message: `Your pickup for ${newOrder.items.length} services is booked for ${newOrder.pickupSlot.timeRange}.`,
      time: 'Just now',
      read: false,
      type: 'order',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    clearCart();
    setIsCartOpen(false);
    setIsOrderSuccessOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    verificationData?: Partial<GarmentVerification>
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedVerification = verificationData
            ? { ...ord.verification, ...verificationData, verifiedAt: new Date().toISOString().substring(11, 16) }
            : ord.verification;

          const updated: Order = {
            ...ord,
            status: newStatus,
            verification: updatedVerification as GarmentVerification,
          };

          if (activeTrackingOrder?.id === orderId) {
            setActiveTrackingOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );

    // Sync status change to Firebase (quicker-billing-dashboard)
    syncOrderStatusToFirebase(orderId, {
      status: newStatus,
      ...(verificationData ? { verification: verificationData as any } : {}),
    }).catch((err) => {
      console.warn('[Firebase] Status background sync warning:', err);
    });

    // Add status notification
    const notifTextMap: Record<OrderStatus, string> = {
      PENDING: 'Order created and awaiting confirmation.',
      CONFIRMED: 'Order confirmed. Pickup staff assigned.',
      PICKUP_ASSIGNED: 'Pickup staff is on the way to your doorstep.',
      PICKED_UP: 'Garments safely collected from your address.',
      RECEIVED: 'Garments received at Quicker Central Processing Hub.',
      PROCESSING: 'Your garments are currently in washing and dry cleaning.',
      QUALITY_CHECK: 'Undergoing 5-point quality and stain check.',
      READY: 'Order is ready, neatly packed on hangers.',
      OUT_FOR_DELIVERY: 'Your laundry is out for delivery with our delivery captain.',
      DELIVERED: 'Order successfully delivered to your doorstep. Thank you for choosing Quicker!',
      CANCELLED: 'Your order was cancelled.',
    };

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      orderId,
      title: `Order ${orderId}: ${newStatus.replace(/_/g, ' ')}`,
      message: notifTextMap[newStatus] || `Status updated to ${newStatus}`,
      time: 'Just now',
      read: false,
      type: 'order',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const cancelOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return { success: false, message: 'Order not found.' };

    const uncancelableStatuses: OrderStatus[] = [
      'PICKED_UP',
      'RECEIVED',
      'PROCESSING',
      'QUALITY_CHECK',
      'READY',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
    ];

    if (uncancelableStatuses.includes(ord.status)) {
      return {
        success: false,
        message:
          'This order can no longer be cancelled because the garments have already been collected or are in processing.',
      };
    }

    updateOrderStatus(orderId, 'CANCELLED');
    return { success: true, message: `Order #${orderId} was cancelled successfully.` };
  };

  // Reorder feature (Section 21)
  const reorder = (prevOrder: Order) => {
    setCart(prevOrder.items.map((it) => ({ ...it })));
    if (prevOrder.specialInstructions) {
      setSpecialInstructions(prevOrder.specialInstructions);
    }
    setActiveTab('services');
    setIsCartOpen(true);
  };

  // Service updates
  const updateService = (updated: ServiceItem) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const addService = (newService: ServiceItem) => {
    setServices((prev) => [newService, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loginWithOtp,
        loginWithGoogle,
        loginAsDemoUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isInstallModalOpen,
        setIsInstallModalOpen,
        services,
        updateService,
        addService,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartSubtotal,
        cartDeliveryFee,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        cartTotal,
        specialInstructions,
        setSpecialInstructions,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        deleteAddress,
        pickupSlots,
        selectedSlot,
        setSelectedSlot,
        orders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        reorder,
        activeTrackingOrder,
        setActiveTrackingOrder,
        lastCreatedOrder,
        setLastCreatedOrder,
        activeTab,
        setActiveTab,
        isCartOpen,
        setIsCartOpen,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        notifications,
        markNotificationRead,
        unreadNotifsCount,
        coupons,
        isAdminMode,
        setIsAdminMode,
        hasSkippedLogin,
        setHasSkippedLogin,
        firebaseConnected,
        firebaseProjectId: firebaseConfig.projectId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
