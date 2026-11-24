import { lazy, Suspense } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Header } from './components/Header';
import { CartDrawer } from './components/storefront/CartDrawer';
import { StorefrontView } from './components/storefront/StorefrontView';
import { EASE_IN, EASE_OUT, TIMING } from './lib/motion';
import { useDemoStore } from './store/demoStore';

const AdminView = lazy(() =>
  import('./components/admin/AdminView').then((mod) => ({ default: mod.AdminView }))
);

export default function App() {
  const { mode, toast, dismissToast } = useDemoStore();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[var(--gs-bg)] text-[var(--gs-ink)]">
        <Header />

        <AnimatePresence mode="wait" initial={false}>
          {mode === 'storefront' ? (
            <motion.div
              key="storefront"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: TIMING.panel, ease: EASE_OUT }}
            >
              <StorefrontView />
            </motion.div>
          ) : (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: TIMING.panel, ease: EASE_OUT }}
            >
              <Suspense
                fallback={
                  <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-16 text-xs text-[var(--gs-ink-muted)]">
                    Loading store operations…
                  </div>
                }
              >
                <AdminView />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        <CartDrawer />

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.message}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.14, ease: EASE_IN } }}
              transition={{ duration: TIMING.panel, ease: EASE_OUT }}
              className="fixed bottom-5 right-5 z-50 max-w-sm bg-[var(--gs-ink)] text-[var(--gs-surface)] px-4 py-3 rounded-[4px] shadow-lg text-xs flex items-center gap-4"
            >
              <span>{toast.message}</span>
              {toast.ctaLabel && toast.onCta && (
                <button
                  type="button"
                  onClick={toast.onCta}
                  className="underline underline-offset-4 font-medium text-[#F3D8CE] hover:text-white shrink-0"
                >
                  {toast.ctaLabel}
                </button>
              )}
              <button
                type="button"
                onClick={dismissToast}
                aria-label="Dismiss notification"
                className="text-[var(--gs-border)] hover:text-white ml-1"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
