import { ChartLineUp, Package, Receipt } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT, SPRING_PILL, TIMING } from '../../lib/motion';
import { useDemoStore } from '../../store/demoStore';
import type { AdminTab } from '../../types/shop';
import { AnalyticsTab } from './AnalyticsTab';
import { InventoryTab } from './InventoryTab';
import { OrdersTab } from './OrdersTab';

export function AdminView() {
  const { adminTab, setAdminTab, orders } = useDemoStore();

  const navItems: { id: AdminTab; label: string; icon: typeof ChartLineUp }[] = [
    { id: 'analytics', label: 'Analytics', icon: ChartLineUp },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'orders', label: `Orders (${orders.length})`, icon: Receipt },
  ];

  return (
    <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-64px)]">
      {/* Left Sidebar Rail */}
      <aside className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-[var(--gs-border)] bg-[var(--gs-surface-muted)]/70 p-4 sm:p-5">
        <p className="hidden lg:block text-xs text-[var(--gs-ink-muted)] px-3 pb-2.5">
          Store operations
        </p>
        <nav aria-label="Admin sections" className="flex lg:flex-col gap-1.5 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = adminTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAdminTab(item.id)}
                className={`relative px-3.5 py-2.5 rounded-[4px] text-xs font-medium flex items-center gap-2.5 whitespace-nowrap transition-colors ${
                  active
                    ? 'text-[var(--gs-surface)]'
                    : 'text-[var(--gs-ink-secondary)] hover:bg-[var(--gs-surface-chip)] hover:text-[var(--gs-ink)]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav-pill"
                    transition={SPRING_PILL}
                    className="absolute inset-0 rounded-[4px] bg-[var(--gs-ink)]"
                    aria-hidden="true"
                  />
                )}
                <Icon size={16} weight="regular" className="relative z-10" aria-hidden="true" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Admin Workspace */}
      <main className="lg:col-span-10 p-5 sm:p-8 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={adminTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: TIMING.fast, ease: EASE_OUT }}
          >
            {adminTab === 'analytics' && <AnalyticsTab />}
            {adminTab === 'inventory' && <InventoryTab />}
            {adminTab === 'orders' && <OrdersTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
