import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { GIFT_WRAP_FEE, SEED_ORDERS, SEED_PRODUCTS } from '../data/seed';
import type {
  AdminTab,
  AppMode,
  CartItem,
  Department,
  Occasion,
  Order,
  OrderStatus,
  Product,
  ToastNotice,
} from '../types/shop';

const STORAGE_KEY = 'giftshop_demo_v1';

interface PersistedState {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  giftWrap: boolean;
  giftNote: string;
}

interface NewProductInput {
  name: string;
  department: Department;
  occasion: Occasion;
  price: number;
  stock: number;
  personalizable: boolean;
  description: string;
}

interface DemoStoreValue extends PersistedState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toast: ToastNotice | null;
  dismissToast: () => void;
  addToCart: (productId: string, engraving?: string) => void;
  updateCartQty: (index: number, delta: number) => void;
  setGiftWrap: (enabled: boolean) => void;
  setGiftNote: (note: string) => void;
  placeDemoOrder: (customerName?: string, city?: string) => boolean;
  adjustStock: (productId: string, delta: number) => void;
  updateProductPrice: (productId: string, price: number) => void;
  addProduct: (input: NewProductInput) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  resetDemoData: () => void;
}

const DEFAULT_PERSISTED: PersistedState = {
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  cart: [{ productId: 'p1', qty: 1, engraving: '' }],
  giftWrap: true,
  giftNote: 'Wishing you a calm and joyful year ahead.',
};

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_PERSISTED);
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (!Array.isArray(parsed.products) || !Array.isArray(parsed.orders)) {
      return structuredClone(DEFAULT_PERSISTED);
    }
    return {
      products: parsed.products,
      orders: parsed.orders,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
      giftWrap: typeof parsed.giftWrap === 'boolean' ? parsed.giftWrap : true,
      giftNote: typeof parsed.giftNote === 'string' ? parsed.giftNote : '',
    };
  } catch {
    return structuredClone(DEFAULT_PERSISTED);
  }
}

const DEPT_DEFAULT_IMAGE: Record<Department, string> = {
  'Luxury Gift Boxes': '/images/sandalwood-box.jpg',
  'Personalized & Engraved': '/images/walnut-frame.jpg',
  'Flowers, Plants & Hampers': '/images/botanical-hamper.jpg',
  'Home & Lifestyle': '/images/stoneware-tea.jpg',
};

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(loadInitialState);
  const [mode, setMode] = useState<AppMode>('storefront');
  const [adminTab, setAdminTab] = useState<AdminTab>('analytics');
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotice | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Ignore storage quota errors in private browsing.
    }
  }, [persisted]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 6500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (notice: ToastNotice) => setToast(notice);

  const addToCart = (productId: string, engraving = '') => {
    const prod = persisted.products.find((p) => p.id === productId);
    if (!prod || prod.stock <= 0) return;

    const currentQty = persisted.cart
      .filter((c) => c.productId === productId)
      .reduce((sum, c) => sum + c.qty, 0);

    if (currentQty >= prod.stock) {
      showToast({ message: `Only ${prod.stock} left in stock for ${prod.name}.` });
      return;
    }

    const cleanEngraving = engraving.trim();
    setPersisted((prev) => {
      const idx = prev.cart.findIndex(
        (c) => c.productId === productId && c.engraving === cleanEngraving
      );
      const nextCart = [...prev.cart];
      if (idx >= 0) {
        nextCart[idx] = { ...nextCart[idx], qty: nextCart[idx].qty + 1 };
      } else {
        nextCart.push({ productId, qty: 1, engraving: cleanEngraving });
      }
      return { ...prev, cart: nextCart };
    });
    setCartOpen(true);
  };

  const updateCartQty = (index: number, delta: number) => {
    setPersisted((prev) => {
      const item = prev.cart[index];
      if (!item) return prev;
      const prod = prev.products.find((p) => p.id === item.productId);
      const nextQty = item.qty + delta;
      const nextCart = [...prev.cart];
      if (nextQty <= 0) {
        nextCart.splice(index, 1);
      } else if (prod && nextQty <= prod.stock) {
        nextCart[index] = { ...item, qty: nextQty };
      }
      return { ...prev, cart: nextCart };
    });
  };

  const setGiftWrap = (giftWrap: boolean) =>
    setPersisted((prev) => ({ ...prev, giftWrap }));

  const setGiftNote = (giftNote: string) =>
    setPersisted((prev) => ({ ...prev, giftNote }));

  const placeDemoOrder = (customerName = 'Demo Guest', city = 'Bengaluru'): boolean => {
    if (persisted.cart.length === 0) return false;

    const nextProducts = persisted.products.map((p) => ({ ...p }));
    const orderItems: Order['items'] = [];
    let subtotal = 0;

    for (const c of persisted.cart) {
      const prod = nextProducts.find((p) => p.id === c.productId);
      if (!prod || prod.stock < c.qty) {
        showToast({ message: `Insufficient stock for ${prod?.name ?? 'an item'}.` });
        return false;
      }
      prod.stock -= c.qty;
      subtotal += prod.price * c.qty;
      orderItems.push({
        productId: prod.id,
        name: prod.name,
        department: prod.department,
        qty: c.qty,
        price: prod.price,
        engraving: c.engraving || undefined,
      });
    }

    const total = subtotal + (persisted.giftWrap ? GIFT_WRAP_FEE : 0);
    const maxOrderNum = persisted.orders.reduce((max, o) => {
      const num = parseInt(o.id.replace(/\D/g, ''), 10);
      return Number.isFinite(num) ? Math.max(max, num) : max;
    }, 1047);
    const orderId = `GS-${maxOrderNum + 1}`;

    const newOrder: Order = {
      id: orderId,
      customer: customerName.trim() || 'Demo Guest',
      city: city.trim() || 'Bengaluru',
      createdAtDaysAgo: 0,
      status: 'Pending',
      giftWrap: persisted.giftWrap,
      giftNote: persisted.giftNote.trim(),
      items: orderItems,
      total,
    };

    setPersisted((prev) => ({
      ...prev,
      products: nextProducts,
      orders: [newOrder, ...prev.orders],
      cart: [],
    }));
    setCartOpen(false);
    showToast({
      message: `Order #${orderId} placed`,
      ctaLabel: 'Open Admin',
      onCta: () => {
        setMode('admin');
        setAdminTab('analytics');
        setToast(null);
      },
    });
    return true;
  };

  const adjustStock = (productId: string, delta: number) => {
    setPersisted((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      ),
    }));
  };

  const updateProductPrice = (productId: string, price: number) => {
    if (!Number.isFinite(price) || price < 99) return;
    setPersisted((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, price: Math.round(price) } : p
      ),
    }));
  };

  const addProduct = (input: NewProductInput) => {
    const id = `p-${Date.now()}`;
    const sku = `GS-CAT-${String(persisted.products.length + 1).padStart(2, '0')}`;
    const product: Product = {
      id,
      sku,
      name: input.name.trim(),
      department: input.department,
      occasion: input.occasion,
      price: Math.max(99, Math.round(input.price)),
      stock: Math.max(0, Math.round(input.stock)),
      personalizable: input.personalizable,
      image: DEPT_DEFAULT_IMAGE[input.department],
      description:
        input.description.trim() ||
        'Added from Admin Inventory and ready for immediate storefront ordering.',
      details: ['Packed in warm linen wrap', 'Includes handwritten card option'],
    };
    setPersisted((prev) => ({
      ...prev,
      products: [product, ...prev.products],
    }));
    showToast({ message: `${product.name} added to catalog.` });
  };

  const deleteProduct = (productId: string) => {
    setPersisted((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
      cart: prev.cart.filter((c) => c.productId !== productId),
    }));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setPersisted((prev) => ({
      ...prev,
      orders: prev.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  };

  const resetDemoData = () => {
    setPersisted(structuredClone(DEFAULT_PERSISTED));
    showToast({ message: 'Demo data restored to initial state.' });
  };

  return (
    <DemoStoreContext.Provider
      value={{
        ...persisted,
        mode,
        setMode,
        adminTab,
        setAdminTab,
        cartOpen,
        setCartOpen,
        toast,
        dismissToast: () => setToast(null),
        addToCart,
        updateCartQty,
        setGiftWrap,
        setGiftNote,
        placeDemoOrder,
        adjustStock,
        updateProductPrice,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        resetDemoData,
      }}
    >
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore(): DemoStoreValue {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error('useDemoStore must be used inside DemoStoreProvider');
  return ctx;
}
