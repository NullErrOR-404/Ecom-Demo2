export type Department =
  | 'Luxury Gift Boxes'
  | 'Personalized & Engraved'
  | 'Flowers, Plants & Hampers'
  | 'Home & Lifestyle';

export type Occasion =
  | 'Birthday'
  | 'Anniversary'
  | 'Wedding'
  | 'Housewarming'
  | 'Thank You';

export type OrderStatus = 'Pending' | 'Packed' | 'Shipped' | 'Delivered';

export type AppMode = 'storefront' | 'admin';
export type AdminTab = 'analytics' | 'inventory' | 'orders';
export type DateRangeDays = 7 | 30 | 90;

export interface Product {
  id: string;
  sku: string;
  name: string;
  department: Department;
  occasion: Occasion;
  price: number;
  stock: number;
  personalizable: boolean;
  image: string;
  description: string;
  details: string[];
}

export interface CartItem {
  productId: string;
  qty: number;
  engraving: string;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  department: Department;
  qty: number;
  price: number;
  engraving?: string;
}

export interface Order {
  id: string;
  customer: string;
  city: string;
  createdAtDaysAgo: number;
  status: OrderStatus;
  giftWrap: boolean;
  giftNote: string;
  items: OrderLineItem[];
  total: number;
}

export interface ToastNotice {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}
