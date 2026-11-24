import { ArrowCounterClockwise, Bag, Gift } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { SPRING_PILL } from '../lib/motion';
import { useDemoStore } from '../store/demoStore';

export function Header() {
  const { mode, setMode, cart, setCartOpen, resetDemoData } = useDemoStore();
  const bagCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header
      className="sticky top-0 z-30 border-b border-[var(--gs-border)]"
      style={{ backgroundColor: 'rgba(244, 239, 230, 0.96)' }}
    >
      <div className="w-full px-2.5 sm:px-[var(--gs-gutter)] h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        <button
          type="button"
          onClick={() => setMode('storefront')}
          className="flex items-center gap-1.5 sm:gap-2 text-left shrink-0"
        >
          <Gift size={18} weight="light" className="text-[var(--gs-accent)]" aria-hidden="true" />
          <span className="font-display text-lg sm:text-2xl font-medium tracking-tight text-[var(--gs-ink)]">
            GiftShop
          </span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div
            role="tablist"
            aria-label="Workspace mode"
            className="inline-flex p-0.5 rounded-[4px] border border-[var(--gs-border-strong)] bg-[var(--gs-surface-chip)]"
          >
            {(['storefront', 'admin'] as const).map((tabMode) => {
              const active = mode === tabMode;
              return (
                <button
                  key={tabMode}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMode(tabMode)}
                  className={`relative px-2.5 sm:px-3.5 py-1.5 text-xs font-medium rounded-[3px] transition-colors ${
                    active
                      ? 'text-[var(--gs-ink)]'
                      : 'text-[var(--gs-ink-secondary)] hover:text-[var(--gs-ink)]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="workspace-mode-pill"
                      transition={SPRING_PILL}
                      className="absolute inset-0 rounded-[3px] bg-[var(--gs-surface)] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10 capitalize">{tabMode}</span>
                </button>
              );
            })}
          </div>

          {mode === 'storefront' ? (
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="px-2.5 sm:px-4 py-2 rounded-[4px] text-xs font-medium bg-[var(--gs-ink)] text-[var(--gs-surface)] hover:bg-[var(--gs-accent)] transition-colors flex items-center gap-1.5"
            >
              <Bag size={16} weight="light" aria-hidden="true" />
              <span className="hidden sm:inline">Bag</span>
              <motion.span
                key={bagCount}
                initial={{ scale: 0.82 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
                className="tabular-nums inline-block"
              >
                ({bagCount})
              </motion.span>
            </button>
          ) : (
            <button
              type="button"
              onClick={resetDemoData}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-[4px] border border-[var(--gs-border-strong)] text-xs font-medium text-[var(--gs-ink)] hover:bg-[var(--gs-surface-chip)] transition-colors flex items-center gap-1.5"
            >
              <ArrowCounterClockwise size={15} weight="regular" aria-hidden="true" />
              <span className="hidden sm:inline">Reset demo</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
