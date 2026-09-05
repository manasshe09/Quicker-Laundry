export type ServiceCategoryId =
  | 'all'
  | 'wash'
  | 'mens_wear'
  | 'ladies_wear'
  | 'home_furnishings'
  | 'shoes'
  | 'soft_toys'
  | 'special_services'
  | 'laundry'
  | 'wash_iron'
  | 'dry_cleaning'
  | 'wash_fold'
  | 'ironing'
  | 'special_care';

export type PricingType = 'per_piece' | 'per_kg' | 'fixed' | 'inspection_based';

export type GarmentAudience = 'men' | 'women' | 'household' | 'kids' | 'general';

export interface ServiceItem {
  id: string;
  categoryId: ServiceCategoryId;
  categoryName: string;
  name: string;
  audience: GarmentAudience;
  description: string;
  pricingType: PricingType;
  price: number;
  unitLabel: string; // e.g., 'piece', 'kg', 'pair', 'item'
  turnaroundHours: number;
  popular?: boolean;
  active: boolean;
  iconName: string;
  careNotes?: string;
}

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

export interface Address {
  id: string;
  customerId: string;
  type: 'Home' | 'Work' | 'Other';
  name: string;
  phone: string;
  houseFlat: string;
  street: string;
  landmark?: string;
  area: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface PickupSlot {
  id: string;
  dayLabel: 'Today' | 'Tomorrow' | 'Day After';
  dateStr: string;
  timeRange: string;
  available: boolean;
  capacityLabel?: string; // e.g. "Available", "3 slots left"
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PICKUP_ASSIGNED'
  | 'PICKED_UP'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'QUALITY_CHECK'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  subtitle: string;
  completed: boolean;
  current: boolean;
  time?: string;
}

export interface StaffPartner {
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
}

export interface GarmentVerification {
  inspected: boolean;
  actualItemCount?: number;
  actualWeightKg?: number;
  stainsFound?: boolean;
  stainNotes?: string;
  specialCareApplied?: string;
  verifiedAt?: string;
}

export interface Order {
  id: string; // e.g. "QK1024"
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  appliedCoupon?: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'PayOnDelivery';
  paymentStatus: 'PAID' | 'PENDING';
  pickupSlot: PickupSlot;
  deliverySlotEstimated?: string;
  address: Address;
  status: OrderStatus;
  specialInstructions?: string;
  createdAt: string;
  assignedStaff?: StaffPartner;
  verification?: GarmentVerification;
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: string;
  active: boolean;
}

export interface AppNotification {
  id: string;
  orderId?: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'system';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  isGuest: boolean;
  photoURL?: string;
  authProvider?: 'google' | 'phone' | 'guest';
}
